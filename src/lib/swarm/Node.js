import Brood from "./Brood";
import Message from "./Message";

export class Node extends Brood {
	constructor({ id, state = {}, mesh = [], config = {}, triggers = [], tags = [] } = {}) {
		super(id, tags);
		
		this._state = state;
		this._triggers = new Map(...triggers);
		this._mesh = new Set(...mesh);
		this._config = {
			isReducer: true,	// Make ALL triggers return a state -- to exclude a trigger from state, create a * handler that returns true on those triggers
			allowRPC: true,		// If no trigger handlers exist AND an internal method is named equal to the trigger, pass ...args to that method

			queue: new Set(),
			isBatchProcessing: false,
			maxBatchSize: 1000,

			...config,
		};
	}

	deconstructor() {}

	get state() {
		return this._state;
	}
	set state(state = {}) {
		this._state = state;

		return this;
	}

	get triggers() {
		return this._triggers;
	}
	set triggers(triggers) {
		this._triggers = new Map(...triggers);

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
	 * A middleware function that routes an
	 * invocation command via a Mesh request
	 * by a .broadcast call.  This can be
	 * reassigned externally to change the
	 * receiving logic, but attempt to use
	 * the pre filter (*) handlers or build
	 * logic into the trigger handlers.
	 */
	receive(trigger, ...args) {
		this.invoke(trigger, ...args);	// If received from .broadcast, args[ 0 ] will be a Message

		return this;
	}

	/**
	 * Send an invocation command to all
	 * Nodes in the Mesh.
	 */
	broadcast(trigger, ...args) {
		for(let node of this._mesh) {
			if(node !== this) {
				//NOTE:	For now, limit Messages to be from broadcasting only -- if needed elsewhere, then upgrade concept to a Packet/Message paradigm
				node.receive(trigger, Message.Create({ data: args, emitter: this }));
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
	_handleInvocation(trigger, ...args) {
		/**
		 * ? Pre hooks
		 * These act as filters iff one returns << true >>
		 */
		for(let fn of this._triggers.get("*")) {
			let result = fn(args, { trigger, node: this });

			if(result === true) {
				return false;
			}
		}

		let hadMatch = false;
		for(let [ trig, fns ] of this._triggers) {
			if(trigger === trig) {
				hadMatch = true;
				/**
				 * "state" handlers won't reduce, but could theoretically use
				 * this._state directly, if needed
				 */
				if(this.config.isReducer === true && trigger !== "state") {
					let next;
					for(let fn of fns) {
						next = fn(args, { trigger, node: this });
					}

					const oldState = this._state;
					this._state = next;

					this.invoke("state", { current: this._state, previous: oldState });
				} else {
					for(let fn of fns) {
						fn(args, { trigger, node: this });
					}
				}
			}
		}

		if(hadMatch === false && this._config.allowRPC === true) {
			if(typeof trigger === "string" && typeof this[ trigger ] === "function") {
				this[ trigger ](...args);

				hadMatch = true;
			}
		}

		/**
		 * ? Post hooks
		 * Treat these like Effects
		 */
		for(let fn of this._triggers.get("**")) {
			fn(args, { trigger, node: this });
		}

		return hadMatch;
	}

	/**
	 * If in batch mode, add trigger to queue; else,
	 * handle the invocation immediately
	 */
	invoke(trigger, ...args) {
		/**
		 * Short-circuit the invocation if the trigger has not been loaded
		 */
		if(!this._triggers.has(trigger)) {
			return false;
		}

		if(this._config.isBatchProcessing === true) {
			this._config.queue.add([ trigger, args ]);

			return true;
		} else {
			return this._handleInvocation(trigger, ...args);
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
			const [ trigger, args ] = queue[ i ];
			const result = this._handleInvocation(trigger, ...args);

			results.push(result);
		}

		this._config.queue = new Set(queue.slice(runSize));

		return results;
	}

	async asyncInvoke(trigger, ...args) {
		return await Promise.resolve(this.invoke(trigger, ...args));
	}
	async asyncProcess(qty = this._config.maxBatchSize) {
		return await Promise.resolve(this.process(qty));
	}

	static Create(obj = {}) {
		return new Node(obj);
	}
	static Factor(qty = 1, fnOrObj) {
		let nodes = [];
		for(let i = 0; i < qty; i++) {
			let node = Node.Create(typeof fnOrObj === "function" ? fnOrObj(i) : fnOrObj);

			nodes.push(node);
		}

		if(qty === 1) {
			return nodes[ 0 ];
		}

		return nodes;
	}
};

export default Node;