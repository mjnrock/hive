import Node from "../node/Node";

import Eventable from "./Eventable";
import Subscribable from "./Subscribable";

export const Router = node => ({
	// state: {
	// 	routes: [],
	// },
	// nodes: {},
	events: {
		receive: [
			(node, event) => (emitter, ...args) => node.actions.route(...args),
		],
	},
	// subscriptions: [],
	// meta: {},
	config: {
		routes: [],
		isMultiMatch: false,
	},
	actions: {
		attach(...targets) {
			for(let target of targets) {
				target.actions.addSubscriber(node);
			}
		},
		detach(...targets) {
			for(let target of targets) {
				target.actions.removeSubscriber(node);
			}
		},
		addRoute(filter, handler) {
			node.meta.config.routes.push([ filter, handler ]);

			return node;
		},
		removeRoute(filter, handler) {
			node.meta.config.routes = node.meta.config.routes.filter(([ f, h ]) => !(f === filter && h === handler));

			return node;
		},
		route(...args) {
			for(let [ filter, handler ] of node.meta.config.routes) {
				let hasResult = false;

				let receiver = handler;				
				if(handler instanceof Node) {
					receiver = handler.actions.receive;
				}
				
				//TODO Introduce .type specificity for regexp/string matching
				/*if(typeof filter === "string") {
					if(true) {
						receiver(node, ...args);
						hasResult = true;
					}
				} else if(filter instanceof RegExp) {
					if(true) {
						receiver(node, ...args);
						hasResult = true;
					}
				}*/
				if(typeof filter === "function") {
					let result = filter(...args);

					if(result === true) {
						receiver(node, ...args);						
						hasResult = true;
					}
				}

				if(hasResult === true && node.meta.config.isMultiMatch === false) {
					return node;
				}
			}

			return node;
		},
	},
});

export default Router;