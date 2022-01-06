import { ThrowError, ErrorTypes } from "./Errors";
import Tag from "./Tag";

export class TagUint32 extends Tag {
	static MinValue = 0;
	static MaxValue = 4294967295;

	static Type = Tag.Types.Uint32;
	static Validator = input => {
		if(typeof input === "number") {
			if(input >= TagUint32.MinValue && input <= TagUint32.MaxValue) {
				return true;
			}

			// ThrowError(ErrorTypes.OutOfRange, input, this);
		}
		
		// ThrowError(ErrorTypes.NotANumber, input, this);
	};

	constructor(alias, data, opts = {}) {
		super(alias,TagUint32.Type, data, {
			...opts,
			validate: TagUint32.Validator,
		});
	}
}

export default TagUint32;