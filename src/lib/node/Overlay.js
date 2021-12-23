export const merger = {
	state(node, attribute) {
		/**
		 * Create an object-wrapper for state values if
		 * 	they are not natively an Object
		 */
		if(Array.isArray(node.state) || typeof node.state !== "object") {
			node.state = {
				$value: node.state,
			};
		}

		/**
		 * Do the same as above for @attribute
		 */
		if(Array.isArray(attribute) || typeof attribute !== "object") {
			attribute = {
				$value: attribute,
			};
		}

		/**
		 * Merge any existing state with @attribute
		 */
		node.state = {
			...node.state,
			...attribute,
		};
	},
	meta(node, attribute) {
		node.meta = {
			...node.meta,
			...attribute,
		};
	},
	config(node, attribute) {
		/**
		 * "config" performs 1st-class work, and thus is elevated
		 * 	as such in the overlaying, despite it being a subkey
		 */
		node.meta.config = {
			...node.meta.config,
			...attribute,
		};
	},
	actions(node, attribute) {
		node.actions = {
			...node.actions,
			...attribute,
		};
	},
	events(node, attribute) {
		if(Array.isArray(attribute)) {
			/**
			 * Example: @attribute = [ "type1", "type2", ... ]
			 * If a string list of events are provided, instantiate the space
			 */
			for(let event of attribute) {
				if(!(node.events[ event ] instanceof Set)) {
					node.events[ event ] = new Set();
				}
			}
		} else if(typeof attribute === "object") {
			/**
			 * If an object with handlers is passed, iterate through the entries
			 */
			for(let [ event, handlers ] of Object.entries(attribute)) {
				/**
				 * If handler space has not been initialized, do so
				 */
				if(!(node.events[ event ] instanceof Set)) {
					/**
					 * This differentiation allows for the handlers to either be an array
					 * 	of functions { event: [ fn1, fn2, ... ] } or simply a function { event: fn1 }
					 */
					if(Array.isArray(handlers)) {
						node._events[ event ] = new Set([ ...handlers ]);
					} else if(typeof handlers === "function") {
						node._events[ event ] = new Set([ handlers ]);
					}
				} else {
					/**
					 * If handler space has been initialized, do the equivalent
					 * 	assignments as above
					 */
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
	},
	subscriptions(node, attribute) {
		node.subscriptions = new Set([
			...node.subscriptions,
			...attribute,
		]);
	},
};

export function Overlay(node, overlay) {
	/**
	 * Evaluate the overlay function to to get
	 * 	working template object
	 */
	let overlayer = overlay(node);
	for(let [ key, attribute ] of Object.entries(overlayer)) {
		/**
		 * Allow for <Overlay> to have dynamic outputs, by evaluating the
		 * 	function stored at overlay[ key ]
		 */
		if(typeof attribute === "function") {
			attribute = attribute(key, node, overlayer);
		}

		/**
		 * Perform key-specific functions on the node
		 * 	for a given overlay attribute
		 */
		if(key in merger) {
			merger[ key ](node, attribute);
		}
	}
};

export default Overlay;