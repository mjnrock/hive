import Tags from "./../tag/package";

export const merger = {
	state(node, attribute) {
		if(attribute instanceof Tags.Tag) {
			node.state = attribute;
		} else {
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
		}
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
	triggers(node, newTriggers) {
		node.triggers = newTriggers;	// .triggers is an UPSERT trap for ._triggers
	},
	subscriptions(node, attribute) {
		node.subscriptions = new Set([
			...node.subscriptions,
			...attribute,
		]);
	},
	overlays(node, overlays) {
		node.apply(overlays);
	},
};

export function hook(key, node, layer) {
	if(`$${ key }` in layer) {
		if(typeof layer[ `$${ key }` ] === "function") {
			layer[ `$${ key }` ](node, layer);
		}

		delete layer[ `$${ key }` ];
	}
}

export function Overlay(node, overlay, customMerger = false) {
	customMerger = customMerger || merger;
	/**
	 * Evaluate the overlay function to to get
	 * 	working template object
	 */
	let layer = overlay(node);
	hook("pre", node, layer);

	for(let [ key, attribute ] of Object.entries(layer)) {
		if(key[ 0 ] !== "$") {
			/**
			 * Allow for <Overlay> to have dynamic outputs, by evaluating the
			 * 	function stored at overlay[ key ]
			 */
			if(typeof attribute === "function") {
				attribute = attribute(key, node, layer);
			}
	
			/**
			 * Perform key-specific functions on the node
			 * 	for a given overlay attribute
			 */
			if(key in customMerger) {
				customMerger[ key ](node, attribute);
			} else {
				node[ key ] = attribute;
			}
		}
	}

	hook("iterator", node, layer);
	hook("post", node, layer);
};

export default Overlay;