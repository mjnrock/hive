import Brood from "./Brood";
import Message from "./Message";
import Node from "./Node";

/**
 * Pylons are flyweight relays to which Nodes can .connect
 * in order to .emit to all other connexions on the Pylon
 */
export class Pylon extends Brood {
	constructor(members = []) {
		super();

		this.connexions = new Set();

		this.connect(members);

		return new Proxy(this, {
			get(target, prop) {
				return Reflect.get(target, prop);
			},
			set(target, prop, value) {
				if(prop === "id" || prop === "connexions") {
					return target;
				}

				return Reflect.set(target, prop, value);
			},
		});
	}

	deconstructor() {}

	connect(node) {
		if(Array.isArray(node)) {
			for(let n of node) {
				this.connect(n);
			}

			return this;
		}

		if(node instanceof Node) {
			this.connexions.add(node);
		}

		return (...args) => this.emit.call(this, ...args);
	}
	disconnect(node) {
		if(Array.isArray(node)) {
			let results = []
			for(let n of node) {
				results.push(this.disconnect(n));
			}

			return results;
		}

		return this.connexions.delete(node);
	}
	has(node) {
		return this.connexions.has(node);
	}

	emit(requester, trigger, ...args) {
		if(this.connexions.has(requester)) {
			for(let member of this.connexions) {
				if(member !== requester) {
					member.receive(trigger, Message.Create({ data: args, emitter: requester, meta:{ pylon: this.id } }));
				}
			}

			return true;
		}

		return false;
	}
};


