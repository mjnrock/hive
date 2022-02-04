import { v4 as uuid } from "uuid";

export class Message {
	constructor({ data, emitter, ...meta } = {}) {
		this.id = uuid();
		this.data = data;
		this.emitter = emitter;
		this.timestamp = Date.now();
		this.meta = {
			...meta,
		};
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
				&& "timestamp" in obj
				&& "meta" in obj;
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