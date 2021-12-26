import { v4 as uuid } from "uuid";
import { capitalizeFirstLetter } from "../util/helper";
import contextTypes from "./contextType";

export class Context {
	constructor(type, data, { meta = {}, name, id = uuid() } = {}) {
		this.type = type;
		this.data = data;
		this.meta = {
			id,
			...meta,
		};

		if(name) {
			this.meta.name = name;
		}
	}

	toObject() {
		const obj = {
			type: this.type,
			data: this.data,
			meta: this.meta,
		};

		if(Array.isArray(obj.data)) {
			for(let i = 0; i < obj.data.length; i++) {
				let current = obj.data[ i ];

				if(current instanceof Context) {
					obj.data[ i ] = current.toObject();
				}
			}
		} else if(typeof obj.data === "object") {
			for(let [ key, value ] of Object.entries(obj.data)) {
				if(value instanceof Context) {
					obj.data[ key ] = value.toObject();
				}
			}
		}

		return obj;
	}
	toJson() {
		return JSON.stringify(this.toObject());
	}

	static FromObject(obj) {
		const ctx = new Context(obj.type, obj.data, { meta: obj.meta, id: obj.meta.id });

		if(ctx.type === Context.Types.Compound  && Array.isArray(ctx.data)) {
			for(let i = 0; i < ctx.data.length; i++) {
				let current = ctx.data[ i ];

				ctx.data[ i ] = Context.FromObject(current);
			}
		} else if(typeof ctx.data === "object") {
			ctx.data = Context.FromObject(ctx.data);
		}

		return ctx;

		return new Context(obj.type, obj.data, { meta: obj.meta, id: obj.meta.id });
	}
	static FromJson(json) {
		let obj = JSON.parse(json);

		return Context.FromObject(obj);
	}

	static Create(...args) {
		return new Context(...args	);
	}
	static Factory(qty, args = []) {
		let ctxs = [];
		for(let i = 0; i < qty; i++) {
			ctxs.push(new Context(...args));
		}

		return ctxs;
	}
}

Context.Types = (() => {
	let typeObj = {};

	for(let type of contextTypes) {
		if(typeof type === "string") {
			let key = capitalizeFirstLetter(type);

			typeObj[ key ] = type;
		} else if(Array.isArray(type)) {
			//TODO Recurse through array/object entries
		}
	}

	return typeObj;
})();

export default Context;