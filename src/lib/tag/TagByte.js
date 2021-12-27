import Tag from "./Tag";

export class TagByte extends Tag {
	static Type = Tag.Types.Byte;
	static Validator = input => input instanceof Buffer;

	constructor(data, opts = {}) {
		super(TagByte.Type, data, {
			...opts,
			validate: TagByte.Validator,
		});
	}
}

export default TagByte;