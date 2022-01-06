import { ThrowError, ErrorTypes } from "./Errors";
import Tag from "./Tag";

export class TagUint8 extends Tag {
	static MinValue = 0;
	static MaxValue = 255;

	static Type = Tag.Types.Uint8;
	static Validator = input => {
		if(typeof input === "number") {
			if(input >= TagUint8.MinValue && input <= TagUint8.MaxValue) {
				return true;
			}

			// ThrowError(ErrorTypes.OutOfRange, input, this);
		}
		
		// ThrowError(ErrorTypes.NotANumber, input, this);
	};

	constructor(alias, data, opts = {}) {
		super(alias,TagUint8.Type, data, {
			...opts,
			validate: TagUint8.Validator,
		});
	}
}

export default TagUint8;