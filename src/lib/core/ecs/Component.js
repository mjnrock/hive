import System from "./System";

export class Component {
	static System;

	constructor({ ...opts } = {}) {
		//TODO Establish a paradigm for Components
	}

	/**
	 * Allow for inheritence to assign a System locally -- invoke in progeny constructor
	 */
	static Assign(system) {
		if(!(this.System instanceof System)) {
			this.System = system;
		}

		return this;
	}
}

export default Component;