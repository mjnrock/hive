import { v4 as uuid } from "uuid";

export class Message {
	constructor({ data, emitter, tags = [], meta = {} } = {}) {
		this.id = uuid();
		this.data = data;
		this.emitter = emitter;
		this.timestamp = Date.now();

		this.tags = new Set(tags);
		this.meta = meta;

		/**
		 * Freeze the Message without freezing the entries
		 * ! Currently, doing this will prevent .clone from working
		 */
		// return new Proxy(this, {
		// 	get(target, prop) {
		// 		return Reflect.get(target, prop);
		// 	},
		// 	set(target, prop, value) {
		// 		return target;
		// 	},
		// });
	}

	/**
	 * This will create an exact clone of the @msg,
	 * whereas new Message(msg) would copy the @data
	 * and @emitter, but generate a new @id and @timestamp
	 */
	clone(msg) {
		if(Message.Conforms(msg)) {
			this.id = msg.id;
			this.data = msg.data;
			this.emitter = msg.emitter;
			this.timestamp = msg.timestamp;
			
			this.tags = msg.tags;
			this.meta = msg.meta;
		}

		return this;
	}

	static Conforms(obj) {
		if(obj instanceof Message) {
			return true;
		} else if(typeof obj === "object") {
			return "id" in obj
				&& "data" in obj
				&& "emitter" in obj
				&& "timestamp" in obj;
		}

		return false;
	}

	static Copy(msg, isClone = false) {
		if(!Message.Conforms(msg)) {
			return false;
		}
			
		if(isClone === true) {
			return Message.Create().clone(msg);
		}

		return Message.Create(msg);
	}
	static Create({ data, emitter } = {}) {
		return new Message({ data, emitter });
	}
};

export default Message;