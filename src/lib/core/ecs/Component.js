import HiveBase from "../HiveBase";

export class Component extends HiveBase {
	static System;

	constructor(parent, { config, ...opts } = {}) {
		super({ parent, ...opts });

		this.config = {
			dispatchToParent: false,
			...config,
		};
	}

	dispatch(action, ...args) {}
}

export default Component;