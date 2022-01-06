export class Controller {
	/**
	 * By using a <Map> here, @trigger can effectively be anything: object, text, number, bool, etc.
	 * 	As such, the <Controller> can be used as a filter, as well, to invoke a specific method
	 * 	associated with that particular input.
	 * 
	 * NOTE: Because it's a <Map>, if using string keys, they are *case-sensitive/strict* (e.g. "EventName" !== "eventName", 0 !== "0", etc.)
	 */
	constructor({ handlers = {}, hooks = {}, state = {} } = {}) {
		if(Array.isArray(handlers)) {
			this.handlers = new Map(handlers.map((v, i) => [ i, v ]));	//? Here for things like "ports" or "circuit i/o" kind of stuff where the number-index is intrinsically meaningful
		} else if(typeof handlers === "object") {
			this.handlers = new Map(Object.entries(handlers));
		}

		this.hooks = {
			pre: false,
			post: false,
			reducer: false,
			...hooks,
		};
		this.state = state;		//?	Used largely with instances involving reducer hooks
	}

	/**
	 * @param {string|any} trigger 
	 * @param {fn} handler 
	 * @returns this
	 */
	addHandler(trigger, handler) {
		if(typeof handler === "function") {
			this.handlers.set(trigger, handler);
		}
		
		return this;
	}
	
	/**
	 * Input-object of << this.addHandler >> inputs as
	 * 	a key-value-pairing of { trigger : handler, ... }
	 * 
	 * NOTE: Because of the object, you cannot add triggers here
	 * 	that are note valid <Object> keys.
	 */
	addHandlers(handlerObj = {}) {
		for(let [ trigger, handler ] of Object.entries(handlerObj)) {
			if(typeof handler === "function") {
				this.handlers.set( trigger, handler);
			}
		}

		return this;
	}
	
	/**
	 * @param {string|any} trigger 
	 * @returns this
	 */
	removeHandler(trigger) {
		this.handlers.delete(trigger);

		return this;
	}
	/**
	 * @param {...(string|any)} ...trigger 
	 * @returns this
	 */
	removeHandlers(...triggers) {
		for(let eventType of triggers) {
			this.handlers.delete(eventType);
		}

		return this;
	}

	addHook(hookType, fn) {
		if(typeof handler === "function") {
			this.hooks[ hookType ] = fn;
		}

		return this;
	}
	addHooks(hookObj = {}) {
		if(typeof hookObj === "object") {
			this.hooks = {
				...this.hooks,
				...hookObj,
			};
		}

		return this;
	}

	/**
	 * @param {string|any} trigger 
	 * @param {...any} ...args
	 * @returns this
	 */
	invoke(trigger, ...args) {
		if(this.handlers.has(trigger)) {
			if(typeof this.hooks.pre === "function") {
				let filterResult = this.hooks.pre(trigger, args);

				if(filterResult === false) {
					return;
				}
			}

			const handler = this.handlers.get(trigger);
			const result = handler(trigger, ...args);

			if(typeof this.hooks.reducer === "function") {
				this.state = this.hooks.reducer(result, this.state);
			}

			if(typeof this.hooks.post === "function") {
				this.hooks.post(trigger, args);
			}

			return result;
		}
	}
	/**
	 * @param {string|any} trigger 
	 * @param {...any} ...args
	 * @returns this
	 */
	async asyncInvoke(trigger, ...args) {
		return await this.invoke(trigger, ...args);
	}
}

export default Controller;