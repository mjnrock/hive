// import { ThrowError, ErrorTypes } from "./Errors";
import { validate } from "uuid";
import Tag from "./Tag";

export class TagCompound extends Tag {

	static Type = Tag.Types.Compound;
	static Validator = input => {
		if(input instanceof Tag) {
			return true;
		}
		
		// ThrowError(ErrorTypes.InvalidInput, input, this);
		return false;
	};

	constructor(alias, data, opts = {}) {
		super(alias, TagCompound.Type, data, opts);
	}

	get data() {
		return super.data;
	}
	set data(input = []) {
		if(Array.isArray(input)) {
			let newData = input.reduce((a, v) => {
				if(TagCompound.Validator(v) === true) {
					if(typeof this.validate === "function") {
						if(this.validate(v) === true) {
							return [ ...a, v ];
						} else {
							return a;
						}
					}
					
					return [ ...a, v ];
				}
				
				return a;
			}, []);
			
			this._data = newData;
		}
	}

	addTag(tag) {
		this._data.push(tag);

		return this;
	}
	addTags(tags = []) {
		this._data = [
			...this.data,
			...tags,
		];

		return this;
	}

	removeTag(tag) {
		this._data = this._data.filter(t => tag.id !== t.id || (validate(t) && tag.id === t));
		
		return this;
	}
	removeTags(tags = []) {
		tags.forEach(tag => this.removeTag(tag));

		return this;
	}

	hasTag(input) {
		if(input instanceof Tag) {
			for(let tag of this.data) {
				if(tag === input) {
					return true;
				}
			}

			return false;
		} else if(validate(input)) {
			for(let tag of this.data) {
				if(tag.id === input) {
					return true;
				}
			}
		}

		return false;
	}
	getTagById(id) {
		for(let tag of this.data) {
			if(tag.id === id) {
				return tag;
			}
		}

		return false;
	}
	setTagDataById(id, data) {
		for(let tag of this.data) {
			if(tag.id === id) {
				tag.data = data;

				return tag;
			}
		}

		return false;
	}
	mergeTagDataById(id, data, isArray = false) {
		for(let tag of this.data) {
			if(tag.id === id) {
				if(isArray === true) {
					tag.data = [
						...tag.data,
						...data,
					];
				} else {
					tag.data = {
						...tag.data,
						...data,
					};
				}

				return tag;
			}
		}

		return false;
	}

	swapTags(tag1, tag2) {
		let i1, i2;

		this.data.forEach((tag, i) => {
			if(tag === tag1) {
				i1 = i;
			} else if(tag === tag2) {
				i2 = i;
			} else if(tag.id === tag1) {
				i1 = i;
			} else if(tag.id === tag2) {
				i2 = i;
			}
		});

		if(i1 != null && i2 != null) {
			[ this.data[ i1 ], this.data[ i2 ] ] = [ this.data[ i2 ], this.data[ i1 ] ];
			
			return true;
		}

		return false;
	}

	/**
	 * This function will make the copy of the tag, if found, into a child of << this.data >>
	 */
	duplicateTagById(id) {
		let tag = this.getTagById(id);

		//TODO	Flesh out Tag.Copy(tag) to account for types
		// return this.addTag(Tag.Copy(tag));
	}
}

export default TagCompound;