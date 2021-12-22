export const Eventable = node => ({
	// state: {},
	// nodes: {},
	// events: {},
	// subscriptions: [],
	// meta: {},
	// config: {},
	actions: {
		invoke(event, ...args) {
			if(!(node.events[ event ] instanceof Set)) {
				delete node.events[ event ];
				
				return node;
			}
			
			for(let handler of node.events[ event ]) {
				handler(node, event)(...args);
			}
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