import HiveBase from "./HiveBase";
import Signal from "./Signal";

export class Node extends HiveBase {
	static $;
	static CommandCharacter = "$";		// Set the command-tag prefix here (df: "$")
	static ReducerTriggers = {
		Invoke: "update",
		Notify: "state",
		Handler: function(signal) {	// Handler is here as a reference in case it needs to be removed as a handler and will be bound to the Node in the constructor
			if(signal.meta.isCoerced) {
				// (Implicit data) Functionally, this occurs when a Signal was created ad hoc, and the original @args were condensed into an array and assigned to .data, thus unpackage
				[ this.state ] = signal.data;
			} else {
				// (Explicit data) A Signal was explicitly created, so use w/e data was present in the Signal
				this.state = signal.data;
			}
		},
	};

	constructor({ id, state, mesh = [], config = {}, triggers = [], tags = [], namespace } = {}) {
		super(id, tags);
		
		this._state = new Map([[ "state", {} ]]);	// Split out like this in case @state is a Map
		this.state = state;

		this._triggers = new Map(...triggers);
		this._mesh = new Set(...mesh);
		this._config = {
			isReducer: true,	// Make ALL triggers return a state -- to exclude a trigger from state, create a * handler that returns true on those triggers
			allowRPC: true,		// If no trigger handlers exist AND an internal method is named equal to the trigger, pass ...args to that method

			queue: new Set(),
			isBatchProcessing: false,
			maxBatchSize: 1000,

			//TODO There's a lot of nuance here that needs to be worked out, but key here added as a future addition
			namespace: typeof namespace === "function" ? namespace : trigger => trigger,

			...config,
		};

		//? Default reducer that is only added if at least one (1) custom reducer has NOT been added
		if(!this._triggers.has(Node.ReducerTriggers.Invoke)) {
			this.addTrigger(Node.ReducerTriggers.Invoke, Node.ReducerTriggers.Handler.bind(this));
		}
	}

	get state() {
		return this._state.get("state");
	}
	set state(state = {}) {
		if(state instanceof Map) {
			this._state = state;
		} else {
			this._state.set("state", state);
		}

		return this;
	}

	get triggers() {
		return this._triggers;
	}
	set triggers(triggers) {
		this._triggers = new Map(...triggers);

		for(let trigger of triggers) {
			this._state.set(trigger, {});
		}

		return this;
	}

	get mesh() {
		return this._mesh;
	}
	set mesh(mesh) {
		this._mesh = new Set(...mesh);

		return this;
	}

	get config() {
		return this._config;
	}
	set config(config = {}) {
		this._config = config;

		return this;
	}

	/**
	 * Convenience function for toggling/altering configuration booleans -- must be a boolean
	 */
	toggle(configAttribute, newValue) {
		if(typeof this.config[ configAttribute ] === "boolean") {
			if(typeof newValue === "boolean") {	
				this.config[ configAttribute ] = newValue;
			} else {
				this.config[ configAttribute ] = !this.config[ configAttribute ];
			}
		}

		return this;
	}
	assert(configAttribute, expectedValue) {
		return this.config[ configAttribute] === expectedValue;
	}

	enmesh(node, binary = false) {
		this._mesh.add(node);

		if(binary) {
			node._mesh.add(this);
		}		

		return this;
	}
	demesh(node, binary = false) {
		if(binary) {
			node._mesh.delete(this);
		}

		return this._mesh.delete(node);
	}

	/**
	 * A middleware function that routes an invocation command via a Mesh request
	 * by a .broadcast call.  This can be reassigned externally to change the
	 * receiving logic, but attempt to use the pre filter (*) handlers or build
	 * logic into the trigger handlers.
	 */
	receive(signalOrTrigger, ...args) {
		this.invoke(signalOrTrigger, ...args);	// If received from .broadcast, args[ 0 ] will be a Message

		return this;
	}

	/**
	 * Send an invocation command to all
	 * Nodes in the Mesh.
	 */
	broadcast(signalOrTrigger, ...args) {
		for(let node of this._mesh) {
			if(node !== this) {
				node.receive(signalOrTrigger, ...args);
			}
		}

		return this;
	}


	/**
	 * @trigger can be anything, not limited to strings
	 */
	addTrigger(trigger, handler) {
		let handlers = this._triggers.get(trigger);

		if(!(handlers instanceof Set)) {
			let value = new Set();
			this._triggers.set(trigger, value);
			handlers = value;
		}

		handlers.add(handler);

		return this;
	}
	addTriggers(addTriggerArgs = []) {
		for(let args of addTriggerArgs) {
			this.addTrigger(...args);
		}

		return this;
	}
	removeTrigger(trigger, handler) {
		let handlers = this._triggers.get(trigger);

		if(handlers instanceof Set) {
			return handlers.delete(handler);
		}

		return false;
	}
	removeTriggers(removeTriggerArgs = []) {
		let results = [];
		for(let args of removeTriggerArgs) {
			results.push(this.removeTrigger(...args));
		}

		return results;
	}

	/**
	 * This should NOT be used externally.
	 * 
	 * A handling abstract to more easily deal with
	 * batching vs immediate invocations
	 */
	_handleInvocation(signal) {
		// Many contingent handlers receive the same payload, so abstract it here
		const payload = [ signal, {
			trigger: signal.type,
			node: this,
			state: this._state.get(signal.type),
			globalState: this.state,
			broadcast: this.broadcast,
			invoke: this.invoke,
		} ];

		if(typeof signal.type === "string" && signal.type[ 0 ] === Node.CommandCharacter) {
			//TODO	Route the signal to Node.$ (i.e. Nexus)

			return true;
		}

		/**
		 * ? Pre hooks
		 * These act as filters iff one returns << true >> and will cease execution immediately (i.e. no handlers or effects will be processed)
		 */
		for(let fn of (this._triggers.get("*") || [])) {
			let result = fn(...payload);

			if(result === true) {
				return false;
			}
		}

		let hadMatch = false;
		for(let [ trigger, handlers ] of this._triggers) {
			if(signal.type === trigger) {
				hadMatch = true;
				/**
				 * "state" handlers won't reduce, but could theoretically use
				 * this._state directly, if needed
				 */
				if(this.config.isReducer === true && signal.type !== Node.ReducerTriggers.Notify) {
					let next;
					// Execute all handlers before continuing
					for(let handler of handlers) {
						next = handler(...payload);
					}

					const oldState = this._state.get(trigger);
					this._state.set(trigger, next);

					this.invoke(Node.ReducerTriggers.Notify, { current: next, previous: oldState });
				} else {
					// Execute all handlers before continuing
					for(let handler of handlers) {
						handler(...payload);
					}
				}
			}
		}

		// Only execute below if a trigger handler did not exist AND Node is configured to accept RPC
		//? Note, there are limitations to this usage paradigm, so explicitly define a custom RPC handler to handle such cases (e.g. .update vis-a-vis "update")
		if(hadMatch === false && this._config.allowRPC === true) {
			// Verify that the RPC has a landing method
			if(typeof signal.type === "string" && typeof this[ signal.type ] === "function") {
				//!	If the .data is an Array, expand it -- you may need to array-wrap the data payload depending on how .invoke was called (cf .invoke @args)
				// * As a general rule, explicitly create a Signal when performing RPC
				if(Array.isArray(signal.data)) {
					this[ signal.type ](...signal.data);
				} else {
					this[ signal.type ](signal.data);
				}

				hadMatch = true;
			}
		}

		/**
		 * ? Post hooks
		 * Treat these like Effects
		 */
		for(let fn of (this._triggers.get("**") || [])) {
			fn(...payload);
		}

		return hadMatch;
	}

	/**
	 * If in batch mode, add trigger to queue; else,
	 * handle the invocation immediately.
	 * 
	 * This is overloaded by either passing a Signal
	 * directly, or by passing the trigger type and
	 * data args and a Signal will be created
	 */
	invoke(signalOrTrigger, ...args) {
		let signal;

		if(Signal.Conforms(signalOrTrigger)) {
			signal = signalOrTrigger;
		} else {
			signal = Signal.Create({
				type: signalOrTrigger,
				data: args,
				emitter: this,
			}, {
				coerced: true,
			});
		}

		/**
		 * Short-circuit the invocation if the trigger has not been loaded
		 */
		if(!this._triggers.has(signal.type)) {
			return false;
		}

		if(this._config.isBatchProcessing === true) {
			this._config.queue.add(signal);

			return true;
		} else {
			return this._handleInvocation(signal);
		}
	}
	/**
	 * If the ReducerTriggers Handler is still present, update will modify the state directly via the default function
	 * If it is not present, this would act as a lazy way to invoke ReducerTriggers Invoke more easily
	 * 
	 * In either case, .update returns this and thus can be chained
	 */
	update(...reducerArgs) {
		this.invoke(Node.ReducerTriggers.Invoke, ...reducerArgs);

		return this;
	}

	/**
	 * Process @qty amount of queued triggers
	 */
	process(qty = this._config.maxBatchSize) {
		if(this._config.isBatchProcessing !== true) {
			return [];
		}

		const queue = [ ...this._config.queue ];
		const results = [];
		const runSize = Math.min(qty, this._config.maxBatchSize);

		for(let i = 0; i < runSize; i++) {
			const signal = queue[ i ];
			const result = this._handleInvocation(signal);

			results.push(result);
		}

		this._config.queue = new Set(queue.slice(runSize));

		return results;
	}

	async asyncInvoke(signalOrTrigger, ...args) {
		return await Promise.resolve(this.invoke(signalOrTrigger, ...args));
	}
	async asyncProcess(qty = this._config.maxBatchSize) {
		return await Promise.resolve(this.process(qty));
	}

	static Create(obj = {}) {
		return new Node(obj);
	}
	static Factory(qty = 1, fnOrObj) {
		let nodes = [];
		for(let i = 0; i < qty; i++) {
			let node = Node.Create(typeof fnOrObj === "function" ? fnOrObj(i, qty) : fnOrObj);

			nodes.push(node);
		}

		if(qty === 1) {
			return nodes[ 0 ];
		}

		return nodes;
	}
};

export default Node;