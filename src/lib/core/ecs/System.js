import Node from "./../Node";

export class System extends Node {
	constructor({ id, tags = [] } = {}) {
		super({ id, tags });
	}
};

export default System;