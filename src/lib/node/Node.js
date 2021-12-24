import { v4 as uuid } from "uuid";
import Overlay from "./Overlay";
import Eventable from "../overlays/Eventable";
import Subscribable from "../overlays/Subscribable";

export class Node {
	static Registry = new Map();

	constructor({ id = uuid(), state = {}, nodes = [], events = {}, subscribers = [], meta = {}, actions = {}, config = {}, name, overlays = [] } = {}) {
		// Standard Attribute:	Assignment directives
		this.id = id;
		this.state = state;
		this.meta = {
			name: name || this.id,
			...meta,
		};
		this.meta.config = {
			...(this.meta.config || {}),
			...config,
		};

		this.apply([
			Eventable,
			Subscribable,
			...overlays
		]);

		// Dynamic Attributes:	Merge directives
		this.actions = actions;
		this.nodes = nodes;
		this.events = events;
		this.subscriptions = subscribers;
		
		Node.Registry.set(this.id, this);
	}

	/**
	 * Iterating (for..of) over a Node will iterate over Node.state
	 * 	If you need the actual Node[ ...keys ], use (for..in)
	 */
	[ Symbol.iterator ]() {
        var index = -1;
        var data = Object.entries(this.state);

        return {
            next: () => ({ value: data[ ++index ], done: !(index in data) })
        };
    }

	deconstructor() {
		return Node.Registry.delete(this.id);
	}

	has(overlay) {
		return this.meta.overlays.has(overlay);
	}

	/**
	 * Overlays will *merge* entries, if the merger object has a hook
	 * 	for that specific key; "assign" entries in cases where no key
	 * 	exists in the merger object; and "execute" the command hooks
	 * 	at their respective times (i.e. $pre, $post)
	 */
	apply(overlays = []) {		
		/**
		 * Allow overriding of how an overlay can be initialized:
		 * 	overlays: [
		 * 		Overlay1,				// ex. 1
		 * 		[ Overlay2, () => {} ],	// ex. 2
		 * 		[ Overlay3, [			// ex. 3
		 * 			() => {},
		 * 			() => {},
		 *		],
		 * 	]
		 */
		if(!(this.meta.overlays instanceof Set)) {
			this.meta.overlays = new Set();
			this.meta.overlays.add(this);
		}

		for(let overlay of overlays) {
			if(typeof overlay === "function") {
				if(!this.meta.overlays.has(overlay)) {
					Overlay(this, overlay);
					this.meta.overlays.add(overlay);
				}
			} else if(Array.isArray(overlay)) {
				if(!this.meta.overlays.has(ol)) {
					let [ ol, fns ] = overlay;

					Overlay(this, ol);
					this.meta.overlays.add(ol);

					if(typeof fns === "function") {
						fns(this);
					} else if(Array.isArray(fns)) {
						for(let fn of fns) {
							fn(this);
						}
					}
				}
			}
		}
	}

	get state() {
		return this._state;
	}
	set state(newState) {
		if(Array.isArray(newState) || typeof newState !== "object") {
			this._state = {
				$value: newState,
			};
		} else if(typeof newState === "object") {
			this._state = newState;
		} else {
			this._state = {};
		}
	}

	get actions() {
		return this._actions;
	}
	set actions(newActions = {}) {
		if(!this._actions) {
			this._actions = {};
		}

		if(Array.isArray(newActions)) {
			for(let fn of newActions) {
				this._actions[ fn.name ] = fn;
			}
		} else if(typeof newActions === "object") {
			this._actions = {
				...this._actions,
				...newActions,
			};
		}
	}

	get events() {
		return this._events;
	}
	set events(newEvents = []) {
		if(!this._events) {
			this._events = {};
		}

		if(Array.isArray(newEvents)) {
			for(let event of newEvents) {
				if(!(this._events[ event ] instanceof Set)) {
					this._events[ event ] = new Set();
				}
			}
		} else if(typeof newEvents === "object") {
			for(let [ event, handlers ] of Object.entries(newEvents)) {
				if(!(this._events[ event ] instanceof Set)) {
					if(Array.isArray(handlers)) {
						this._events[ event ] = new Set([ ...handlers ]);
					} else if(typeof handlers === "function") {
						this._events[ event ] = new Set([ handlers ]);
					}
				} else {
					if(Array.isArray(handlers)) {
						for(let handler of handlers) {
							if(typeof handler === "function") {
								this.events[ event ].add(handler);
							}
						}
					} else if(typeof handlers === "function") {
						this.events[ event ].add(handlers);
					}
				}
			}
		}
	}

	get subscriptions() {
		return this._subscriptions;
	}
	set subscriptions(newSubscribers = []) {
		if(!this._subscriptions) {
			this._subscriptions = new Set();
		}

		if(Array.isArray(newSubscribers) || newSubscribers instanceof Set) {
			for(let subscriber of newSubscribers) {
				if(subscriber instanceof Node || typeof subscriber === "function") {
					this._subscriptions.add(subscriber);
				}
			}
		}
	}

	get nodes() {
		return this._nodes;
	}
	set nodes(newNodes = []) {
		if(!this._nodes) {
			this._nodes = new Map();
		}

		if(Array.isArray(newNodes)) {
			for(let node of newNodes) {
				if(node instanceof Node) {
					this._nodes.set(node.id, node);
				}
			}
		} else if(typeof newNodes === "object") {
			for(let [ key, node ] of Object.entries(newNodes)) {
				if(node instanceof Node) {
					this._nodes.set(key, node);
				}
			}
		}
	}

	//TODO Change $ getter to remove all Namespaces from each attribute and return a merged object
	get $() {
		if("$value" in this.state) {
			return this.state.$value;
		}

		return this.state;
	}

	static Create(opts = {}) {
		return new Node(opts);
	}
	static Factory(qty, opts = {}) {
		let nodes = [];

		if(Array.isArray(opts)) {
			for(let i = 0; i < qty; i++) {
				nodes.push(new Node({ overlays: opts }));
			}
		} else {

			for(let i = 0; i < qty; i++) {
				nodes.push(new Node(opts));
			}
		}

		return nodes;
	}

	static Unregister(node) {
		if(node instanceof Node) {
			return node.deconstructor();
		}
	}
}

export default Node;