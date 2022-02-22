import { validate } from "uuid";

import HiveBase from "./HiveBase";
import Node from "./Node";

/**
 * Since Nexus is a singleton, be aware of the scoped execution that many of the static
 * methods invoke, usually with Nexus.$ (i.e. many static methods work directly on the current
 * .Instance instead of performing work abstractly)
 */
export class Nexus extends Node {
	static Instance;	// Lazy-loaded singleton reference for Nexus

	constructor({ registry = [], id, tags = [] } = {}) {
		super(id, tags);

		this.registry = new Map(registry);
		
		if(!(Nexus.Instance instanceof Nexus)) {
			Nexus.Instance = this;
			Node.$ = this;
		}
	}

	// Smart accessor that will create a singleton instance if one does not exist
	static get $() {
		if(!(Nexus.Instance instanceof Nexus)) {
			const nexus = new Nexus();

			Nexus.Instance = nexus;
			Node.$ = nexus;
		}

		return Nexus.Instance;
	}
	static $get(nodeOrId) {
		if(nodeOrId instanceof Node) {
			return Nexus.$.registry.get(nodeOrId.id);
		}
		
		return Nexus.$.registry.get(nodeOrId);
	}

	deconstructor() {}

	static Spawn(qty = 1, fnOrObj) {
		// Single-parameter override for .Spawning one (1) Node
		if(typeof qty === "function" || qty === fnOrObj) {
			fnOrObj = qty;
			qty = 1;
		}

		// Create @qty amount of Nodes
		let results = Node.Factory(qty, fnOrObj);

		if(!Array.isArray(results)) {
			results = [ results ];
		}

		// Register each @node with the Nexus Registry
		for(let node of results) {
			Nexus.$.registry.set(node.id, [ node ]);
		}

		return results;
	}
	static Despawn(nodesOrIds = []) {
		if(!Array.isArray(nodesOrIds)) {
			nodesOrIds = [ nodesOrIds ];
		}

		const results = [];
		for(let nodeOrId of nodesOrIds) {
			let node = nodeOrId;
			// If a uuid was passed, get the node
			if(validate(node)) {
				node = Nexus.$get(node);
			}
			
			let wasDeleted = false;
			if(node instanceof Node) {
				// Attempt to remove @node from the Nexus Registry
				wasDeleted = Nexus.$.registry.delete(node.id);

				// If @node was removed from Nexus Registry, invoke the deconstructor on @node for cleanup
				if(wasDeleted === true) {
					node.deconstructor();
				}
			}

			results.push(wasDeleted);
		}

		// If a single value was passed to @nodesOrIds (as a single-element array or as a single parameter), return single-value result
		// ? Mainly an override to allow .Despawn to be called on a single node|id parameter and return a result consistent with that
		if(results.length === 1) {
			return results[ 0 ];
		}

		return results;
	}
};

export default Nexus;