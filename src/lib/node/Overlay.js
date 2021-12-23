export function Overlay(node, overlay) {
	let overlayer = overlay(node);
	for(let [ key, attribute ] of Object.entries(overlayer)) {
		/**
		 * Allow for <Overlay> to have dynamic outputs, by evaluating the
		 * 	function stored at overlay[ key ]
		 */
		if(typeof attribute === "function") {
			attribute = attribute(key, node, overlayer);
		}

		if(key === "state") {
			if(Array.isArray(node.state) || typeof node.state !== "object") {
				node.state = {
					$value: node.state,
				};
			}

			/**
			 * For <Overlay> state to be an object
			 */
			node.state = {
				...node.state,
				...attribute,
			};
		} else if(key === "meta") {
			node.meta = {
				...node.meta,
				...attribute,
			};
		} else if(key === "config") {
			node.meta.config = {
				...node.meta.config,
				...attribute,
			};
		} else if(key === "actions") {
			node.actions = {
				...node.actions,
				...attribute,
			};
		} else if(key === "events") {
			if(Array.isArray(attribute)) {
				for(let event of attribute) {
					if(!(node.events[ event ] instanceof Set)) {
						node.events[ event ] = new Set();
					}
				}
			} else if(typeof attribute === "object") {
				for(let [ event, handlers ] of Object.entries(attribute)) {
					if(!(node.events[ event ] instanceof Set)) {
						if(Array.isArray(handlers)) {
							node._events[ event ] = new Set([ ...handlers ]);
						} else if(typeof handlers === "function") {
							node._events[ event ] = new Set([ handlers ]);
						}
					} else {
						if(Array.isArray(handlers)) {
							for(let handler of handlers) {
								if(typeof handler === "function") {
									node.events[ event ].add(handler);
								}
							}
						} else if(typeof handlers === "function") {
							node.events[ event ].add(handlers);
						}
					}
				}
			}
		} else if(key === "subscriptions") {
			node.subscriptions = new Set([
				...node.subscriptions,
				...attribute,
			]);
		}
	}
};

export default Overlay;