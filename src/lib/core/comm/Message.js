import { v4 as uuid } from "uuid";
export class Message {
	constructor(data, tags = [], { id, config = {} } = {}) {
		this.id = id || uuid();

		this.data = data;
		this.tags = tags instanceof Set ? tags : new Set(Array.isArray(tags) ? tags : [ tags ]);

		this.config = {
			isLocked: true,
			...config,
		};

		return new Proxy(this, {
			get: (target, prop) => {
				return Reflect.get(target, prop);
			},
			set: (target, prop, value) => {
				if(target.config.isLocked === true) {
					return true;
				}

				return Reflect.set(target, prop, value);
			},
			deleteProperty: (target, prop) => {
				if(target.config.isLocked === true) {
					return true;
				}

				return Reflect.deleteProperty(target, prop);
			},
		})
	}

	copy(clone = false) {
		if(clone === true) {
			return Message.Factory(1, this.data, this.tags, { id: this.id });
		}

		return Message.Factory(1, this.data, this.tags);
	}

	toObject() {
		return {
			...this,
		};
	}
	toJSON() {
		return JSON.stringify(this.toObject());
	}

	static FromObject(obj = {}) {
		return Message.Copy(obj, true);
	}
	static FromJSON(json) {
		return Message.FromObject(JSON.parse(json));
	}

	static Copy(msg, clone = false) {
		if(clone === true) {
			return Message.Factory(1, msg.data, msg.tags, { id: msg.id, config: msg.config });
		}

		return Message.Factory(1, msg.data, msg.tags, { config: msg.config });
	}
	static Factory(qty = 1, ...args) {
		let ret = [];
		for(let i = 0; i <= qty; i++) {
			ret.push(new Message(...args));
		}

		if(qty === 1) {
			return ret[ 0 ];
		}

		return ret;
	}
};

export default Message;