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

export default {
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
};