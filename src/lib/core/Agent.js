import { v4 as uuid } from "uuid";

export class Agent {	
	constructor({ state = {}, triggers = [], config, namespace, id, globals = {} } = {}) {
		this.id = id || uuid();

		this.state = state;
		this.triggers = new Map(triggers);

		this.config = {
			isReducer: true,	// Make ALL triggers return a state -- to exclude a trigger from state, create a * handler that returns true on those triggers
			allowRPC: true,		// If no trigger handlers exist AND an internal method is named equal to the trigger, pass ...args to that method

			queue: new Set(),
			isBatchProcessing: false,
			maxBatchSize: 1000,

			notifyTrigger: "@update",
			dispatchTrigger: "@dispatch",

			namespace,

			//? These will be added to all @payloads
			globals: {
				...globals,
			},

			...config,
		};
	}

	deconstructor() {}


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


	/**
	 * @trigger can be anything, not limited to strings
	 */
	addTrigger(trigger, ...handler) {
		let handlers = this.triggers.get(trigger) || new Set();
		
		for(let fn of handler) {
			if(typeof fn === "function") {
				handlers.add(fn);
			}
		}

		this.triggers.set(trigger, handlers);

		return this;
	}
	addTriggers(addTriggerArgs = []) {
		if(typeof addTriggerArgs === "object") {
			if(Array.isArray(addTriggerArgs)) {
				for(let args of addTriggerArgs) {
					this.addTrigger(...args);
				}
			} else {
				for(let [ key, fn ] of Object.entries(addTriggerArgs)) {
					this.addTrigger(key, fn);
				}
			}
		}

		return this;
	}
	removeTrigger(trigger, ...handler) {
		let handlers = this.triggers.get(trigger);
		
		for(let fn of handler) {
			if(handlers instanceof Set) {
				return handlers.delete(fn);
			}
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

	hasTrigger(trigger) {
		return this.triggers.has(trigger);
	}


	/**
	 * 
	 */
	__generatePayload({ id, trigger, args } = {}) {
		return [
			args,
			{
				namespace: this.config.namespace,
				trigger: trigger,
				target: this,
				state: this.state,
				invoke: this.invoke,
				_id: id,
				
				...this.config.globals,
			}
		];
	}

	/**
	 * This should NOT be used externally.
	 * 
	 * A handling abstract to more easily deal with
	 * batching vs immediate invocations
	 */
	__handleInvocation(trigger, ...args) {
		// Prevent directly invoking specialty hooks
		if(typeof trigger === "string" && trigger[ 0 ] === "$") {
			return false;
		}
		
		// Many contingent handlers receive the same payload, so abstract it here
		let payload = this.__generatePayload({ id: uuid(), trigger, args });		
		/**
		 * ? Params hooks
		 * These will change the data/@arguments contained in the @payload.  Use these
		 * if you want to dynamically alter: @trigger, @args, or @payload.
		 * 
		 * NOTE: "Spoofing" is intentionally allowed -- apply necessary business logic
		 * NOTE: This does NOT spread the payload -- it takes and returns a direct payload
		 */
		for(let fn of (this.triggers.get("$params") || [])) {
			payload = fn(payload);
		}
		
		const handlers = this.triggers.get(trigger);
		if(trigger === this.config.notifyTrigger) {
			for(let handler of handlers) {
				handler(...payload);
			}
			
			return true;
		} else if(handlers.size === 0) {
			// Verify that the RPC has a landing method
			if(this.config.allowRPC === true && typeof trigger === "string" && typeof this[ trigger ] === "function") {
				this[ trigger ](...args);
				
				return true;
			}
			
			return false;
		}

		/**
		 * ? Pre hooks
		 * These act as filters iff one returns << true >> and will cease execution immediately (i.e. no handlers or effects will be processed)
		 */
		for(let fn of (this.triggers.get("$pre") || [])) {
			let result = fn(...payload);

			if(result === true) {
				return false;
			}
		}

		let invocationType;
		if(this.config.isReducer === true) {
			invocationType = this.config.notifyTrigger;

			let next = this.state;
			for(let handler of handlers) {
				const last = next;

				next = handler(payload[ 0 ], {
					state: next,
					...payload[ 1 ],
				});

				if(next === void 0) {
					next = last;
				}
			}

			
			const oldState = this.state;
			this.state = next;
			
			if(Object.keys(this.state).length && oldState !== this.state) {
				this.invoke(invocationType, { current: next, previous: oldState });
			}
		} else {
			invocationType = this.config.dispatchTrigger;

			for(let handler of handlers) {
				handler(...payload);
			}
			
			this.invoke(invocationType, { current: this.state });
		}

		/**
		 * ? Post hooks
		 * Treat these like Effects
		 */
		for(let fn of (this.triggers.get("$post") || [])) {
			fn(invocationType, ...payload);
		}

		return true;
	}

	/**
	 * If in batch mode, add trigger to queue; else,
	 * handle the invocation immediately.
	 * 
	 * This is overloaded by either passing a Signal
	 * directly, or by passing the trigger type and
	 * data args and a Signal will be created
	 */
	invoke(trigger, ...args) {
		/**
		 * Short-circuit the invocation if the trigger has not been loaded
		 */
		if(!this.triggers.has(trigger)) {
			return false;
		}

		if(this.config.isBatchProcessing === true) {
			this.config.queue.add([ trigger, ...args ]);

			return true;
		} else {
			return this.__handleInvocation(trigger, ...args);
		}
	}

	/**
	 * Process @qty amount of queued triggers
	 */
	process(qty = this.config.maxBatchSize) {
		if(this.config.isBatchProcessing !== true) {
			return [];
		}

		const queue = [ ...this.config.queue ];
		const results = [];
		const runSize = Math.min(qty, this.config.maxBatchSize);

		for(let i = 0; i < runSize; i++) {
			const [ trigger, ...args ] = queue[ i ];
			const result = this.__handleInvocation(trigger, ...args);

			results.push(result);
		}

		this.config.queue = new Set(queue.slice(runSize));

		return results;
	}

	async asyncInvoke(trigger, ...args) {
		return await Promise.resolve(this.invoke(trigger, ...args));
	}
	async asyncProcess(qty = this.config.maxBatchSize) {
		return await Promise.resolve(this.process(qty));
	}

	static Create(obj = {}) {
		return new this(obj);
	}
	static Factory(qty = 1, fnOrObj) {
		// Single-parameter override for .Spawning one (1) this
		if(typeof qty === "function" || typeof qty === "object") {
			fnOrObj = qty;
			qty = 1;
		}

		let hbases = [];
		for(let i = 0; i < qty; i++) {
			let hbase = this.Create(typeof fnOrObj === "function" ? fnOrObj(i, qty) : fnOrObj);

			hbases.push(hbase);
		}

		if(qty === 1) {
			return hbases[ 0 ];
		}

		return hbases;
	}
};

export default Agent;