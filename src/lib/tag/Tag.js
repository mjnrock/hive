import { validate, v4 as uuid } from "uuid";
import { capitalizeFirstLetter } from "../util/helper";
import tagTypes from "./tagType";

export class Tag {
	constructor(alias, type, data, { meta = {}, id, validate, namespace } = {}) {
		this.id = id || uuid();
		this.alias = alias;
		this.type = type;
		this.meta = {
			validate,
			namespace,
			...meta,
		};
		this.data = data;
	}

	get type() {
		return this._type;
	}
	set type(type) {
		if(Object.values(Tag.Types).includes(type)) {
			this._type = type;
		}
	}

	get id() {
		return this._id;
	}
	set id(id) {
		if(validate(id)) {
			this._id = id;
		}
	}

	get meta() {
		return this._meta;
	}
	set meta(meta) {
		if(!Array.isArray(meta) && typeof meta === "object") {
			this._meta = meta;
		} else {
			this._meta = {};
		}
	}

	get data() {
		return this._data;
	}
	set data(data) {
		if(typeof this.meta.validate === "function") {
			if(this.meta.validate.call(this, data) === true) {
				this._data = data;
			}
		} else {
			this._data = data;			
		}
	}

	toObject() {
		const obj = {
			type: this._type,
			data: this._data,
			alias: this._alias,
			meta: this._meta,
		};

		if(Array.isArray(obj.data)) {
			for(let i = 0; i < obj.data.length; i++) {
				let current = obj.data[ i ];

				if(current instanceof Tag) {
					obj.data[ i ] = current.toObject();
				}
			}
		} else if(typeof obj.data === "object") {
			for(let [ key, value ] of Object.entries(obj.data)) {
				if(value instanceof Tag) {
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
		const ctx = new Tag(obj.type, obj.data, { meta: obj.meta, alias: obj.meta.alias, id: obj.meta.id });

		if(ctx._type === Tag.Types.Compound  && Array.isArray(ctx._data)) {
			for(let i = 0; i < ctx._data.length; i++) {
				let current = ctx._data[ i ];

				ctx._data[ i ] = Tag.FromObject(current);
			}
		} else if(typeof ctx._data === "object") {
			ctx._data = Tag.FromObject(ctx._data);
		}

		return ctx;
	}
	static FromJson(json) {
		let obj = JSON.parse(json);

		return Tag.FromObject(obj);
	}

	static Create(...args) {
		return new Tag(...args	);
	}
	static Factory(qty, args = []) {
		let ctxs = [];
		for(let i = 0; i < qty; i++) {
			ctxs.push(new Tag(...args));
		}

		return ctxs;
	}
}

Tag.Types = (() => {
	let typeObj = {};

	for(let type of tagTypes) {
		if(typeof type === "string") {
			let key = capitalizeFirstLetter(type);

			typeObj[ key ] = type;
		} else if(Array.isArray(type)) {
			//TODO Recurse through array/object entries
		}
	}

	return typeObj;
})();

export default Tag;