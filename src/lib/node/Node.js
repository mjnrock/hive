import { v4 as uuid } from "uuid";
import Overlay from "./Overlay";

export class Node {
	static Registry = new Map();

	constructor({ id = uuid(), state = {}, nodes = [], events = {}, subscribers = [], meta = {}, actions = {}, config = {}, name, overlays = [] } = {}) {
		this.id = id;
		this.state = state;
		this.actions = actions;

		this.meta = {
			name: name || this.id,
			...meta,
		};
		this.meta.config = {
			...(this.meta.config || {}),
			...config,
		};

		this.nodes = nodes;
		this.events = events;
		this.subscriptions = new Set(...subscribers);
		
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
		for(let overlay of overlays) {
			if(typeof overlay === "function") {
				Overlay(this, overlay);
			} else if(Array.isArray(overlay)) {
				let [ ol, fns ] = overlay;

				Overlay(this, ol);

				if(typeof fns === "function") {
					fns(this);
				} else if(Array.isArray(fns)) {
					for(let fn of fns) {
						fn(this);
					}
				}
			}
		}

		Node.Registry.set(this.id, this);
	}

	deconstructor() {
		return Node.Registry.delete(this.id);
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
	set actions(newActions = []) {
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

		for(let i = 0; i < qty; i++) {
			nodes.push(new Node(opts));
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