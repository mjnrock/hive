import Brood from "./Brood";

/**
 * A Pod is a meta-node that allows for a group of
 * Nodes to synchronize with each other via a
 * higher-order control structure (i.e. a stateful group)
 */
export class Pod extends Brood {
	constructor() {
		super();
	}

	deconstructor() {}
};

export default Pod;