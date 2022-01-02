import { ThrowError, ErrorTypes } from "./Errors";
import Tag from "./Tag";

export class TagString extends Tag {

	static Type = Tag.Types.String;
	static Validator = input => {
		if(typeof input === "string") {
			return true;
		}
		
		ThrowError(ErrorTypes.InvalidInput, input, this);
	};

	constructor(alias, data, opts = {}) {
		super(alias,TagString.Type, data, {
			...opts,
			validate: TagString.Validator,
		});
	}

	get data() {
		return super.data;
	}
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

export default TagString;