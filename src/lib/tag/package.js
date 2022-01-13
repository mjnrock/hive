import Tag from "./Tag";
import TagByte from "./TagByte";
import TagUint8 from "./TagUint8";
import TagUint16 from "./TagUint16";
import TagUint32 from "./TagUint32";
import TagInt8 from "./TagInt8";
import TagInt16 from "./TagInt16";
import TagInt32 from "./TagInt32";
import TagChar from "./TagChar";
import TagString from "./TagString";
import TagList from "./TagList";
import TagCompound from "./TagCompound";

const obj = {
	Types: Tag.Types,

	Tag,
	Byte: TagByte,
	Int8: TagInt8,
	Int16: TagInt16,
	Int32: TagInt32,
	Uint8: TagUint8,
	Uint16: TagUint16,
	Uint32: TagUint32,
	Char: TagChar,
	String: TagString,
	List: TagList,
	Compound: TagCompound,
};


obj.getClass = type => {
	for(let [ key, value ] of Object.entries(obj)) {
		if(type.toUpperCase() === key.toUpperCase()) {
			return value;
		}
	}

	return Tag;
};
obj.Create = (type, alias, data, ...args) => {
	const clazz = obj.getClass(type);

	if(Array.isArray(data) && (type === Tag.Types.Compound || type === Tag.Types.Array)) {
		for(let i = 0; i < data.length; i++) {
			let entry = data[ i ];

			if(Array.isArray(entry)) {
				entry = obj.Create(...entry);
			}

			data[ i ] = entry;
		}
	}

	return new clazz(alias, data, ...args)
};

export const getClass = obj.getClass;
export const Create = obj.Create;

export default obj;