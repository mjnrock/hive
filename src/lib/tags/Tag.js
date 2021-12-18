import { v4 as uuid } from "uuid";

/*
HOOKS: {
	"*": Pre,			(input, current) => { return newInput }
	"**": Post,			(current) => {}
	"=": Assignment,	(input) => { return newCurrent }
	"#": New,			(input) => { return newToCurrent }
	"@": Validate,		(input) => { return T|F }
}
*/

//TODO Everything here is templatized for starters -- 64bit stuff or higher isn't valid code, but rather references atm
export const primitivesObj = {
	EMPTY: {},
	COMPOUND: {},

	BOOL: {
		"=": input => !!input,
	},

	UINT8: {
		"=": input => Math.max(0, Math.min(255, parseFloat(input))),
	},
	UINT16: {
		"=": input => Math.max(0, Math.min(65535, parseFloat(input))),
	},
	UINT32: {
		"=": input => Math.max(0, Math.min(4294967295, parseFloat(input))),
	},
	UINT64: {
		"=": input => Math.max(0, Math.min(18446744073709551615, parseFloat(input))),
	},

	INT8: {
		"=": input => Math.max(-255, Math.min(255, parseFloat(input))),
	},
	INT16: {
		"=": input => Math.max(-32768, Math.min(32767, parseFloat(input))),
	},
	INT32: {
		"=": input => Math.max(-2147483648, Math.min(2147483647, parseFloat(input))),
	},
	INT64: {
		"=": input => Math.max(-9223372036854775808, Math.min(9223372036854775807, parseFloat(input))),
	},

	FLOAT: {
		"=": input => Math.max(-3.40282347E+38, Math.min(3.40282347E+38, parseFloat(input))),
	},
	DOUBLE: {
		"=": input => Math.max(-1.7976931348623157E+308, Math.min(1.7976931348623157E+308, parseFloat(input))),
	},
	NUMERIC: {
		"=": input => parseFloat(input),
	},
	
	CHAR: {
		"=": input => input.toString().charAt(0),
		"@": input => typeof input === "string" || typeof input === "number",
	},
	STRING: {
		"=": input => input.toString(),
		"@": input => typeof input === "string" || typeof input === "number",
	},
	JSON: {
		"=": input => typeof input === "object" ? input.toJson() : input.toString(),
		"@": input => typeof input === "string" || typeof input === "object",
	},
	
	ENUM: {
		"@": input => Array.isArray(input),
	},
	ARRAY: {
		"@": input => Array.isArray(input),
	},
	OBJECT: {
		"@": input => typeof input === "object",
	},
	FUNCTION: {
		"@": input => typeof input === "function",
	},
	CLASS: {
		"@": input => typeof input === "object",
	},
	
	SCHEMA: {},
	NAMESPACE: {},
	DATASET: {},
	COLLECTION: {},
};

export const primitives = [
	"EMPTY",
	"COMPOUND",

	"BOOL",
	"INT8",
	"INT16",
	"INT32",
	"INT64",
	"FLOAT",
	"DOUBLE",
	"NUMERIC",
	"CHAR",
	"STRING",
	"JSON",
	
	"ENUM",
	"ARRAY",
	"OBJECT",
	"FUNCTION",
	"CLASS",
	
	"SCHEMA",
	"NAMESPACE",
	"DATASET",
	"COLLECTION",
];

function seed() {
	const obj = {};

	for(let i = 0; i < primitives.length; i++) {
		const primitive = primitives[ i ];

		obj[ primitive ] = i;
	}

	return obj;
}
export class Tag {
	static EnumType = {
		...seed(),

		fromValue(value) {
			for(let key in Tag.EnumType) {
				if(Tag.EnumType[ key ] === value) {
					return key;
				}
			}
		},
	};

	constructor(type, data, { meta = {}, name, id = uuid(), hooks = {} } = {}) {
		this.type = type;
		this._data = data;
		this.meta = {
			id,
			name: name || id,
			hooks,
			...meta,
		};
	}

	get data() {
		return this._data;
	}
	set data(input) {
		if(typeof this.meta.hooks[ "*" ] === "function") {
			let result = this.meta.hooks[ "*" ](input, this.data, [ this ]);

			if(result !== void 0) {
				input = result;		// Reshape @input if the pre hook returns something
			}
		}
		
		if(typeof this.meta.hooks[ "@" ] === "function") {
			let result = this.meta.hooks[ "@" ](input, this.data, [ this ]);

			if(result !== true) {
				return;		// Exit if there is a validator and it didn't return TRUE
			}
		}
		
		let newData = input;
		if(typeof this.meta.hooks[ "=" ] === "function") {
			newData = this.meta.hooks[ "=" ](input, this.data, [ this ]);
		} else if(typeof this.meta.hooks[ "#" ] === "function") {
			newData = this.meta.hooks[ "#" ](input, this.data, [ this ]);

			if(typeof this.data === "object" && typeof newData === "object") {
				newData = {
					...this.data,
					...newData,
				};
			}
		}

		if(newData !== void 0 && newData !== this.data) {
			this._data = newData;
		}
		
		if(typeof this.meta.hooks[ "**" ] === "function") {
			this.meta.hooks[ "**" ](this.data, [ this ]);
		}
	}

	static FromSchema(obj = {}) {
		if("type" in obj && ("data" in obj || "_data" in obj)) {
			return new Tag(obj.type, obj._data !== void 0 ? obj._data : obj.data, { meta: obj.meta });
		}

		return new Tag(Tag.EnumType.EMPTY);
	}
};

primitives.forEach(name => {
	let fnName = name.charAt(0) + name.slice(1).toLowerCase();

	Tag[ `${ fnName }` ] = (data, obj = {}) => new Tag(Tag.EnumType[ name ], data, { ...obj });
});

export default Tag;