import { ThrowError, ErrorTypes } from "./Errors";
import Tag from "./Tag";

export class TagChar extends Tag {

	static Type = Tag.Types.Char;
	static Validator = input => {
		if(typeof input === "string" && input.length === 1) {
			return true;
		}
		
		ThrowError(ErrorTypes.InvalidInput, input, this);
	};

	constructor(alias, data, opts = {}) {
		super(alias,TagChar.Type, data, {
			...opts,
			validate: TagChar.Validator,
		});
	}
}

export default TagChar;