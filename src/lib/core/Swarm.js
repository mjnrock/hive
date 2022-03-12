import HiveBase from "./HiveBase";
import Signal from "./Signal";
import Node from "./Node";

export const frozenKeys = [
	`id`,
	`connexions`,
	`qualifier`,
];

export class Swarm extends HiveBase {
	static DefaultQualifier = () => true;

	constructor(qualifier, { members = [], ...opts } = {}) {
		super({ ...opts });
		
		// This is used to deteremine whether a Node is allowed to join the Swarm -- true allows a connection, false denies it
		if(typeof qualifier === "function") {
			this.qualifier = qualifier;
		} else {
			this.qualifier = Swarm.DefaultQualifier;	// Abstracted to provide a reference, if needed
		}
		
		this.connexions = new Set();
		this.connect(members);

		return new Proxy(this, {
			get(target, prop) {
				return Reflect.get(target, prop);
			},
			set(target, prop, value) {
				if(frozenKeys.includes(prop)) {
					return target;
				}

				return Reflect.set(target, prop, value);
			},
			deleteProperty(target, prop) {
				if(frozenKeys.includes(prop)) {
					return false;
				}

				return Reflect.deleteProperty(target, prop);
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

		if(node instanceof Node && this.qualifier(node) === true) {
			this.connexions.add(node);

			// Return a "broadcast" function, that when invoked, invokes .receive on ALL members of the Swarm (thus is optionally captured)
			return (...args) => this.emit.call(this, ...args);
		}

		return false;
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
					member.receive(Signal.Create({ type: trigger, data: args, emitter: requester, meta:{ pylon: this.id } }));
				}
			}

			return true;
		}

		return false;
	}
};

export default Swarm;