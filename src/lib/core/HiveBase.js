import { validate, v4 as uuid } from "uuid";

export class HiveBase {
	static Instance;
	

	constructor({ id, tags = [], parent = null }) {
		this.parent = parent;
		this.id = id || uuid();
		this.tags = new Set(tags);
	}

	// Smart accessor that will create a singleton instance if one does not exist
	static get $() {
		if(!(this.Instance instanceof this)) {
			const hbase = new this();

			this.Instance = hbase;
		}

		return this.Instance;
	}

	deconstructor() {}
	alterTags(add = [], remove = []) {
		// Override for @add with form: add = [ add_0[], add_1[] ] = [ add, remove ]
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

	static GenerateUUID = () => uuid();
	static IsUUID = input => validate(input);
	static IsHiveBase = input => input instanceof HiveBase;
};

export default HiveBase;