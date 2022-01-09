export const Eventable = target => ({
	/**
	 * This will execute directly *after* Eventable(node) has been evaluated
	 * 	but before any other entries have been be evaluated
	 */
	$pre(node, overlay) {
		node._triggers = new Map();
	},
	/**
	 * This will after *all* other overlay entries have been processed
	 */
	$post(node, overlay) {},
	
	// state: {},
	// nodes: {},
	triggers: [
		"*",		// Pre-trigger hook -- all handlers will execute before trigger handlers
		"**",		// Post-trigger hook -- all handlers will execute after trigger handlers
		"@",		// Filter hook -- Any return value *except* TRUE will immediately return (i.e. qty > 1 --> conjunctive)
		"update",	// Invoke state change -- Add reducers here to sequentially update state if setup as reducer (config.isReducer)
		"state",	// Informed of state change -- Add handlers to perform work *after* state has updated -- invoking an "update" trigger will also invoke a "state" trigger, afterward
	],
	// subscriptions: [],
	// meta: {},
	config: {
		isReducer: false,
	},
	actions: {
		toggleReducer(bool) {
			if(typeof bool === "boolean") {
				target.meta.config.isReducer = bool;
			} else {
				target.meta.config.isReducer = !target.meta.config.isReducer;
			}

			return target.meta.config.isReducer;
		},

		invoke(trigger, ...args) {
			if(!(target.triggers.get(trigger) instanceof Set)) {
				target.triggers.delete(trigger);

				return target;
			}
			
			for(let filter of target.triggers.get("@")) {
				const result = filter(target, "@")(...args);

				if(result !== true) {
					return target;
				}
			}

			for(let handler of target.triggers.get("*")) {
				handler(target, "*")(...args);
			}
			
			if(trigger === "update" && target.meta.config.isReducer) {
				let state;
				for(let handler of target.triggers.get(trigger)) {
					state = handler(target, trigger)(...args);
				}
				
				const oldState = target.state;
				target.state = state;
				
				target.actions.invoke("state", state, oldState);
			} else {
				for(let handler of target.triggers.get(trigger)) {
					handler(target, trigger)(...args);
				}
			}

			for(let handler of target.triggers.get("**")) {
				handler(target, "**")(...args);
			}

			return target;
		},
		async asyncInvoke(trigger, ...args) {
			return await target.actions.invoke(trigger, ...args);
		},

		addHandler(trigger, ...fns) {
			if(!(target.triggers.get(trigger) instanceof Set)) {
				target.triggers.set(trigger, new Set());
			}

			for(let fn of fns) {
				if(typeof fn === "function") {
					target.triggers.get(trigger).add(fn);
				}
			}

			return target;
		},
		addHandlers(addHandlerArgs = []) {
			for(let [ trigger, ...fns ] of addHandlerArgs) {
				target.addHandler(trigger, ...fns);
			}

			return target;
		},
		removeHandler(trigger, ...fns) {
			if(!(target.triggers.get(trigger) instanceof Set)) {
				return target;
			}

			for(let fn of fns) {
				target.triggers.get(trigger).delete(fn);
			}

			return target;
		},
		removeHandlers(removeHandlerArgs = []) {
			for(let [ trigger, ...fns ] of removeHandlerArgs) {
				target.removeHandler(trigger, ...fns);
			}

			return target;
		},
	},
});

export default Eventable;