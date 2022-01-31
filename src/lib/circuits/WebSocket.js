import Node from "../node/Node";

import Router from "../overlays/Router";
// import WebSocket from "../overlays/WebSocket";

/**
 * Create a Node-object to specify the Nodes that should
 * be used in the circuit connectivity operations.  If no
 * Node is provided for a given slot, one will be created.
 */
export const Schema = (obj = {}) => ({
	Server: {
		Router: Node.Create([ Router ]),
		// WebSocket: Node.Create([ WebSocket ]),
	},
	Client: {
		Router: Node.Create([ Router ]),
		// WebSocket: Node.Create([ WebSocket ]),
	},

	...obj,
});

//NOTE The Router should utilize subscriptions and broadcast: router.actions.addSubscriber(Client.WebSocket), client.actions.broadcast(...args)

/**
 * !	A circuit should create/destroy the connections between different kinds of Nodes
 * !	setting up and cleaning up everything the Nodes need to communicate in some specific way
 * 
 * It should accept a Schema as an input parameter that will create an UPSERT-like invocation
 * to the circuit, and create a new Node when no override parameter-node is passed.
 */