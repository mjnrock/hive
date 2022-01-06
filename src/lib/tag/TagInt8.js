import { ThrowError, ErrorTypes } from "./Errors";
import Tag from "./Tag";

export class TagInt8 extends Tag {
	static MinValue = -128;
	static MaxValue = 127;

	static Type = Tag.Types.Int8;
	static Validator = input => {
		if(typeof input === "number") {
			if(input >= TagInt8.MinValue && input <= TagInt8.MaxValue) {
				return true;
			}

			// ThrowError(ErrorTypes.OutOfRange, input, this);
		}
		
		// ThrowError(ErrorTypes.NotANumber, input, this);
	};

	constructor(alias, data, opts = {}) {
		super(alias,TagInt8.Type, data, {
			...opts,
			validate: TagInt8.Validator,
		});
	}
}

export default TagInt8;