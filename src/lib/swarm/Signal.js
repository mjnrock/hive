import { v4 as uuid } from "uuid";

export const frozenKeys = [
	`id`,
	`data`,
	`emitter`,
	`timestamp`,
	`id`,
	`tags`,
	`meta`,
	`isClone`,
];

export class Signal {
	constructor({ data, emitter, tags = [], meta = {} } = {}, { override = false, timestamp, id } = {}) {
		this.id = uuid();
		this.data = data;
		this.emitter = emitter;
		this.timestamp = Date.now();

		this.tags = new Set(tags);
		this.meta = meta;

		if(override === true) {
			this.id = id || this.id;
			this.timestamp = timestamp || this.timestamp;

			this.isClone = true;
		}

		/**
		 * Freeze the Signal without freezing the entries
		 */
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

	static Conforms(obj) {
		if(obj instanceof Signal) {
			return true;
		} else if(typeof obj === "object") {
			return "id" in obj
				&& "data" in obj
				&& "emitter" in obj
				&& "timestamp" in obj;
		}

		return false;
	}

	static Copy(msg, clone = false) {
		if(!Signal.Conforms(msg)) {
			return false;
		}

		if(clone === true) {
			return Signal.Create(msg, { override: true, id: msg.id, timestamp: msg.timestamp });
		}

		return Signal.Create(msg);
	}
	static Create({ data, emitter } = {}, opts = {}) {
		return new Signal({ data, emitter }, opts);
	}
};

export default Signal;