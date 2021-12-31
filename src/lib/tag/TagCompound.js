import { ThrowError, ErrorTypes } from "./Errors";
import Tag from "./Tag";

export class TagCompound extends Tag {

	static Type = Tag.Types.Compound;
	static Validator = input => {
		if(Array.isArray(input)) {
			return true;
		}
		
		ThrowError(ErrorTypes.InvalidInput, input, this);
	};

	constructor(alias, data, opts = {}) {
		super(alias,TagCompound.Type, data, {
			...opts,
			validate: TagCompound.Validator,
		});
	}

	//TODO 	Rework for Compound
	set data(data) {
		let final = data.slice(0, Math.min(data.length, ~~this.meta.size || data.length));

		if(typeof this.meta.validate === "function") {
			if(this.meta.validate.call(this, data) === true) {
				this._data = final;
			}
		} else {
			this._data = final;			
		}
	}
}

export default TagCompound;