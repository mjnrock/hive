import { v4 as uuid } from "uuid";

export class HiveBase {
	constructor(id, tags = []) {
		this.id = id || uuid();
		this.tags = new Set(...tags);
	}

	deconstructor() {}

	alterTags(add = [], remove = []) {
		// Override for @add with form: add = [ add_0, add_1 ] = [ add, remove ]
		if(Array.isArray(add) && Array.isArray(add[ 0 ]) && Array.isArray(add[ 1 ])) {
			remove = add[ 1 ];
			add = add[ 0 ];
		}

		if(Array.isArray(add)) {
			for(let a of add) {
				this.tags.add(a);
			}
		}
		if(Array.isArray(remove)) {
			for(let r of remove) {
				this.tags.delete(r);
			}
		}

		return this;
	}
};

export default HiveBase;