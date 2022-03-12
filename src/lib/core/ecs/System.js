import Nexus from "../Nexus";
import Swarm from "../Swarm";

export class System extends Swarm {
	constructor(qualifier, { ...opts } = {}) {
		super(qualifier, { ...opts, parent: Nexus.$ });
	}
};

export default System;