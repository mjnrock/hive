import { v4 as uuid } from "uuid";

export class Brood {
	constructor(id, tags = []) {
		this._id = id || uuid();
		this._tags = new Set(...tags);

		//TODO Register with Swarm
	}

	deconstructor() {
		//TODO Unregister with Swarm
	}

	get id() {
		return this._id;
	}

	get tags() {
		return this._tags;
	}
	set tags(tags = []) {
		let [ add, remove ] = tags;

		if(Array.isArray(add)) {
			for(let a of add) {
				this._tags.add(a);
			}
		}
		if(Array.isArray(remove)) {
			for(let r of remove) {
				this._tags.delete(r);
			}
		}

		return this;
	}
};

export default Brood;