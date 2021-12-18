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
export const contextPrimitives = {
	EMPTY: {		
		"=": input => void 0,
	},
	NULL: {
		"=": input => null,
	},
	ANY: {
		"=": input => input,
		"@": input => true,
	},

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
		
	COMPOUND: {},
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

function seed() {
	const obj = {};

	for(let key in contextPrimitives) {
		obj[ key.toUpperCase() ] = key.toLowerCase();
	}

	return obj;
}
export class Context {
	static EnumType = {
		...seed(),

		fromValue(value) {
			for(let key in Context.EnumType) {
				if(Context.EnumType[ key ] === value) {
					return key;
				}
			}
		},
	};

	constructor(type, data, { meta = {}, id = uuid(), hooks = {} } = {}) {
		this.type = type;
		this.meta = {
			id,
			hooks,
			...meta,
		};

		const proxy = new Proxy(this, {
			get(target, prop) {
				return Reflect.get(target, prop);
			},
			set(target, prop, value) {
				if(prop === "data") {
					if(typeof target.meta.hooks[ "*" ] === "function") {
						let result = target.meta.hooks[ "*" ](value, target.data, [ target ]);
			
						if(result !== void 0) {
							value = result;		// Reshape @input if the pre hook returns something
						}
					}
					
					if(typeof target.meta.hooks[ "@" ] === "function") {
						let result = target.meta.hooks[ "@" ](value, target.data, [ target ]);
			
						if(result !== true) {
							return;		// Exit if there is a validator and it didn't return TRUE
						}
					}
					
					let newData = value;
					if(typeof target.meta.hooks[ "=" ] === "function") {
						newData = target.meta.hooks[ "=" ](value, target.data, [ target ]);
					} else if(typeof target.meta.hooks[ "#" ] === "function") {
						newData = target.meta.hooks[ "#" ](value, target.data, [ target ]);
			
						if(typeof target.data === "object" && typeof newData === "object") {
							newData = {
								...target.data,
								...newData,
							};
						}
					}

					let returnVal = Reflect.set(target, prop, newData);
		
					if(typeof target.meta.hooks[ "**" ] === "function") {
						target.meta.hooks[ "**" ](target.data, [ target ]);
					}
					
					return returnVal;
				}
				
				return Reflect.set(target, prop, value);
			},
		});

		proxy.data = data;

		return proxy;
	}

	static FromSchema(obj = {}) {
		if("type" in obj && ("data" in obj || "_data" in obj)) {
			return new Context(obj.type, obj._data !== void 0 ? obj._data : obj.data, { meta: obj.meta });
		}

		return new Context(Context.EnumType.EMPTY);
	}
};

Object.keys(contextPrimitives).forEach(name => {
	let fnName = name.charAt(0) + name.slice(1).toLowerCase();

	Context[ `${ fnName }` ] = (data, obj = {}) => {
		obj.hooks = {
			...(obj.hooks || {}),
			...contextPrimitives[ name ],
		};

		return new Context(Context.EnumType[ name.toUpperCase() ], data, { ...obj });
	};
});

export default Context;