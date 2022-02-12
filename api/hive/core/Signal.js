import { v4 as uuid } from "uuid";
import Node from "./Node";

export const frozenKeys = [
	`id`,
	`type`,
	`data`,
	`emitter`,
	`timestamp`,
	`id`,
	`tags`,
	`meta`,
	`isClone`,
];

export class Signal {
	constructor({ type, data, emitter, tags = [], meta = {} } = {}, { override = false, coerced = false, timestamp, id } = {}) {
		this.id = uuid();
		this.type = type;
		this.data = data;

		if(emitter instanceof Node) {
			this.emitter = emitter.id;
		} else {
			this.emitter = emitter;
		}

		this.timestamp = Date.now();

		this.tags = new Set(tags);
		this.meta = meta;
		
		this.meta.isCoerced = coerced;		// This is more or less a flag variable to identify times when the Signal was created by converting [ trigger, ...args ] into a Signal, instead of a native Signal being passed directly (e.g. identifying whether .data as an Array is meaningful or circumstantial)

		if(override === true) {
			this.id = id || this.id;
			this.timestamp = timestamp || this.timestamp;

			this.meta.isClone = true;
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
				&& "type" in obj
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
	static Create({ type, data, emitter } = {}, opts = {}) {
		return new Signal({ type, data, emitter }, opts);
	}
};

export default Signal;