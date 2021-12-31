import { ThrowError, ErrorTypes } from "./Errors";
import Tag from "./Tag";

export class TagInt32 extends Tag {
	static MinValue = -2147483648;
	static MaxValue = 2147483647;

	static Type = Tag.Types.Int32;
	static Validator = input => {
		if(typeof input === "number") {
			if(input >= TagInt32.MinValue && input <= TagInt32.MaxValue) {
				return true;
			}

			ThrowError(ErrorTypes.OutOfRange, input, this);
		}
		
		ThrowError(ErrorTypes.NotANumber, input, this);
	};

	constructor(alias, data, opts = {}) {
		super(alias,TagInt32.Type, data, {
			...opts,
			validate: TagInt32.Validator,
		});
	}
}

export default TagInt32;