import Node from "./../node/Node";

import React, { useEffect, useState } from "react";

//! Figure out the paradigm here for subscriptions, nodes, and overlays
export function useNode(initNode) {
	const [ node, setNode ] = useState(initNode instanceof Node ? initNode : Node.Factory(1, [
		ReactContext,
	]));

	useEffect(() => {
		// Subscribe and initialize stuff

		return () => {
			// Unsubscribe and cleanup stuff
		};
	}, []);

	return {
		// Final return object
	};
};

export const ReactContext = target => ({
	$pre(node, overlay) {},
	$post(node, overlay) {},
	
	state: () => React.createContext({}),
	nodes: {},
	triggers: {
		update: [
			(node, trigger) => (type, ...data) => {
				
			},
		],
	},
	subscriptions: [],
	meta: {},
	config: {
		isReducer: true,
	},
	actions: {
		dispatch(type, ...data) {
			target.actions.invoke("update", type, ...data);
		},
	},
});

// Update in a React app per below,
// .triggers is an UPSERT trigger on the Node
// React.triggers = {
// 	// Additional handlers
// };

//! This is probably pretty useful, but it needs to be done properly -- these are the result of about 15 seconds of rewording, but the logic is gonna be a bit different
/**
 * A wrapper for << useNetwork >> for cases where the network resides within
 *  a React Context.  @prop can be used with dot notation to grab a nested value.
 */
// export function useContextNode(context, prop = "network", channel) {
// 	const ctx = useContext(context);

// 	let nested = prop.split("."),
// 		node = ctx;

// 	for (let p of nested) {
// 		node = node[ p ];
// 	}

// 	return useNode(node);
// };

// export default {
// 	useNetwork,
// 	useContextNetwork,
// };

export default ReactContext;