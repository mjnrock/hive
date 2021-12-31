import { ThrowError, ErrorTypes } from "./Errors";
import Tag from "./Tag";

export class TagUint16 extends Tag {
	static MinValue = 0;
	static MaxValue = 65535;

	static Type = Tag.Types.Uint16;
	static Validator = input => {
		if(typeof input === "number") {
			if(input >= TagUint16.MinValue && input <= TagUint16.MaxValue) {
				return true;
			}

			ThrowError(ErrorTypes.OutOfRange, input, this);
		}
		
		ThrowError(ErrorTypes.NotANumber, input, this);
	};

	constructor(alias, data, opts = {}) {
		super(alias,TagUint16.Type, data, {
			...opts,
			validate: TagUint16.Validator,
		});
	}
}

export default TagUint16;