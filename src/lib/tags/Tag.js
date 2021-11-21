export class Tag {
	static EnumType = {
		EMPTY: 0,
		COMPOUND: 1,
		STRING: 2,
		INT32: 3,

		fromValue(value) {
			for(let key in Tag.EnumType) {
				if(Tag.EnumType[ key ] === value) {
					return key;
				}
			}
		}
	};

	constructor(type, data, meta = {}) {
		this.type = type;
		this.data = data;
		this.meta = meta;
	}

	static FromSchema(obj = {}) {
		if("type" in obj && "data" in obj) {
			return new Tag(obj.type, obj.data, obj.meta);
		}

		return new Tag(Tag.EnumType.EMPTY);
	}
};

export default Tag;