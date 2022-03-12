import HiveBase from "./HiveBase";
import Signal from "./Signal";

/**
 * In normal usage, any Node should be .Spawn[ed] by a Nexus
 */
export class Node extends HiveBase {
	static $;	// Singleton reference to -- and injected by -- Nexus
	static MetaCharacters = {
		Command: "$",
		Component: ":",
		Filter: "*",
		Effect: "**",
	};
	
	static StateTrigger = "change";
	static DefaultReducer = (signal) => {	// Handler is here as a reference in case it needs to be removed as a handler and will be bound to the Node in the constructor
		if(signal.meta.isCoerced) {
			// (Implicit data) Functionally, this occurs when a Signal was created ad hoc, and the original @args were condensed into an array and assigned to .data, thus unpackage
			return signal.data[ 0 ];
		}
		
			// (Explicit data) A Signal was explicitly created, so use w/e data was present in the Signal
		return signal.data;
	}

	constructor({ id, state, parent, mesh = [], config = {}, triggers = [], tags = [], namespace, components = [] } = {}) {
		super({ id, tags, parent });
		
		this._state = {};
		this._components = new Map();

		//TODO Create an ECS paradigm where
		/**
		 * 1a) Component classes contain a << name >>, << state >>, and a << single-function handler map >> (e.g. { event: handler, ... })
		 * 	Make these event handlers basically just native methods, whereby the Component is invoked via RPC
		 *  Either make .name required, or create get trap to return the .id if .name is optional and absent
		 * 1b) Component classes contain a << name >>, << state >> and are housed internally within the Node
		 * 	System classes contain a << Map<trigger, fns[]> >>, and optional internal methods that the handlers will be given access to as an destructurable input parameter @methods
		 * 	ALL components are reducers, but if a fn returns nothing, the current state will remain unchanged
		 * 	In this scenario, the Component and the System should be abstracted into a single higher-order object/class
		 * 1c) Take 1a/1b ECS ideas and merge it with original Overlay idea that does everything from Overlay but within a ComponentName scope
		 * 	This should also maintain the paradigm of:
		 * 		Node.ComponentName --> Component..state
		 * 		Injecting a Component into a Node registers a .dispatch(ComponentName, ...args) function to the Node (similar to .receive, but for Components)
		 * 		Component..state is immutable and must be altered by invoking the associated handlers
		 * 		Component handlers can be invoked either by: Adding ":ComponentName" as a Signal tag OR a Signal.type === ComponentName:trigger
		 * 			New precendence order is thus: ComponentName, trigger, method
		 * 		Component state changes do not bubble, but since they are Nodes, can be subscribed to directly
		 * 	Create an Overlay for a Node to become a: Component, Nexus
		 * 	Use TitleCase for ComponentNames
		 * 2) The Component .state is mapped to the { ":ComponentName": state } in << this.state >>
		 * 	Attempting to add a handler with a ":" prefix is disallowed by << .addTrigger >>
		 * 	Consider consolidating ALL of the component states into { $: Map<ComponentName, state> }
		 * 3) On a Node, accessing << .ComponentName >> returns the state of that Component with matching << name >>
		 * 4) If a Signal << .tag >> contains << :ComponentName >> then it will route it directly to the Component instead of handling it
		 * 5) Invoking << .on___ = fn|fn[] >> and assigning a function or an array of functions acts as << addTrigger(s)(___, fn|fn[]) >>
		 * 	This is most easily done in a Proxy trap
		 */

		this._triggers = new Map(...triggers);
		this._mesh = new Set(mesh);
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
		
		this.state = state;
		this.components = components;
	}

	get state() {
		return this._state;
	}
	set state(state = {}) {
		if(typeof state === "object") {
			this._state = state;
		}

		return this;
	}

	get triggers() {
		return this._triggers;
	}
	set triggers(triggers) {
		if(Array.isArray(triggers)) {
			if(Array.isArray(triggers[ 0 ])) {
				this._triggers = new Map(triggers);
			}
		} else if(triggers instanceof Map) {
			this._triggers = triggers;
		}

		return this;
	}

	get mesh() {
		return this._mesh;
	}
	set mesh(mesh) {
		if(Array.isArray(mesh)) {
			this._mesh = new Set(mesh);
		} else if(mesh instanceof Set) {
			this._mesh = mesh;
		}

		return this;
	}

	get components() {
		return this._components;
	}
	set components(components = []) {
		if(Array.isArray(components)) {
			if(Array.isArray(components[ 0 ])) {
				this._components = new Map(components);
			} else {
				for(let comp of components) {
					this._components.set(components.id, comp);
				}
			}
		} else if(components instanceof Map) {
			this._components = components;
		}

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
		return this.config[ configAttribute ] === expectedValue;
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
		let handlers = this._triggers.get(trigger) || new Set();
		
		if(typeof handler === "function") {
			handlers.add(handler);
		}

		this._triggers.set(trigger, handlers);

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
		if(typeof signal.type === "string") {
			if(signal.type[ 0 ] === Node.MetaCharacters.Component) {
				//TODO Route the signal to the Component System
				
				return true;
			} else if(signal.type[ 0 ] === Node.MetaCharacters.Command) {
				//TODO	Route the signal to Node.$ (i.e. Nexus)
	
				return true;
			}
		}

		// Many contingent handlers receive the same payload, so abstract it here
		const payload = [ signal, {
			trigger: signal.type,
			node: this,
			state: this._state,
			globalState: this.state,
			broadcast: this.broadcast,
			invoke: this.invoke,
		} ];

		/**
		 * ? Pre hooks
		 * These act as filters iff one returns << true >> and will cease execution immediately (i.e. no handlers or effects will be processed)
		 */
		for(let fn of (this._triggers.get(Node.MetaCharacters.Filter) || [])) {
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
				if(this.config.isReducer === true && signal.type !== Node.StateTrigger) {
					let next;
					// Execute all handlers before continuing

					if(handlers.size === 0) {
						next = Node.DefaultReducer(...payload);
					} else {
						for(let handler of handlers) {
							next = handler(...payload);
						}
					}

					const oldState = this._state;
					this._state = next;

					this.invoke(Node.StateTrigger, { current: next, previous: oldState });
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
		for(let fn of (this._triggers.get(Node.MetaCharacters.Effect) || [])) {
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
		// Single-parameter override for .Spawning one (1) Node
		if(typeof qty === "function" || typeof qty === "object") {
			fnOrObj = qty;
			qty = 1;
		}

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