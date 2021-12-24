export const Eventable = node => ({
	/**
	 * This will execute directly *after* Eventable(node) has been evaluated
	 * 	but before any other entries have been be evaluated
	 */
	$pre(node, overlay) {
		node._events = {};
	},
	/**
	 * This will after *all* other overlay entries have been processed
	 */
	$post(node, overlay) {},
	
	// state: {},
	// nodes: {},
	events: [
		"*",		// Pre-event hook -- all handlers will execute before event handlers
		"**",		// Post-event hook -- all handlers will execute after event handlers
		"@",		// Filter hook -- Any return value *except* TRUE will immediately return
		"update",	// Invoke state change -- Add reducers here to sequentially update state if setup as reducer (config.isReducer)
		"state",	// Informed of state change -- Add handlers to perform work *after* state has updated -- invoking an "update" event will also invoke a "state" event, afterward
	],
	// subscriptions: [],
	// meta: {},
	config: {
		isReducer: false,
	},
	actions: {
		toggleReducer(bool) {
			if(typeof bool === "boolean") {
				node.meta.config.isReducer = bool;
			} else {
				node.meta.config.isReducer = !node.meta.config.isReducer;
			}

			return node.meta.config.isReducer;
		},

		invoke(event, ...args) {
			if(!(node.events[ event ] instanceof Set)) {
				delete node.events[ event ];

				return node;
			}
			
			for(let filter of node.events[ "@" ]) {
				const result = filter(node, "@")(...args);

				if(result !== true) {
					return node;
				}
			}

			for(let handler of node.events[ "*" ]) {
				handler(node, "*")(...args);
			}
			
			if(event === "update" && node.meta.config.isReducer) {
				let state;
				for(let handler of node.events[ event ]) {
					state = handler(node, event)(...args);
				}
				
				const oldState = node.state;
				node.state = state;
				
				node.actions.invoke("state", state, oldState);
			} else {
				for(let handler of node.events[ event ]) {
					handler(node, event)(...args);
				}
			}

			for(let handler of node.events[ "**" ]) {
				handler(node, "**")(...args);
			}

			return node;
		},

		addHandler(event, ...fns) {
			if(!(node.events[ event ] instanceof Set)) {
				node.events[ event ] = new Set();
			}

			for(let fn of fns) {
				if(typeof fn === "function") {
					node.events[ event ].add(fn);
				}
			}

			return node;
		},
		removeHandler(event, ...fns) {
			if(!(node.events[ event ] instanceof Set)) {
				return node;
			}

			for(let fn of fns) {
				node.events[ event ].delete(fn);
			}

			return node;
		},
	},
});

export default Eventable;