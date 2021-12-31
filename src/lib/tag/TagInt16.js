import { ThrowError, ErrorTypes } from "./Errors";
import Tag from "./Tag";

export class TagInt16 extends Tag {
	static MinValue = -32768;
	static MaxValue = 32767;

	static Type = Tag.Types.Int16;
	static Validator = input => {
		if(typeof input === "number") {
			if(input >= TagInt16.MinValue && input <= TagInt16.MaxValue) {
				return true;
			}

			ThrowError(ErrorTypes.OutOfRange, input, this);
		}
		
		ThrowError(ErrorTypes.NotANumber, input, this);
	};

	constructor(alias, data, opts = {}) {
		super(alias,TagInt16.Type, data, {
			...opts,
			validate: TagInt16.Validator,
		});
	}
}

export default TagInt16;