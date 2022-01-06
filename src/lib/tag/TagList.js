import { ThrowError, ErrorTypes } from "./Errors";
import Tag from "./Tag";

export class TagList extends Tag {

	static Type = Tag.Types.List;
	static Validator = input => {
		if(Array.isArray(input) || input instanceof Set || input instanceof Map) {
			return true;
		}
		
		// ThrowError(ErrorTypes.InvalidInput, input, this);
	};

	constructor(alias, data, opts = {}) {
		super(alias,TagList.Type, data, {
			...opts,
			validate: TagList.Validator,
		});
	}

	//TODO 	Rework for List
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

export default TagList;