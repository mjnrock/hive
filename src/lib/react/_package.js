import { useContext, useEffect, useState } from "react";

export function useNode(node) {
	const [ state, setState ] = useState(node.state);

	useEffect(() => {
		const handler = () => (newState, oldState) => {
			setState(newState);		// Trigger the React update
		};

		if(!node.meta.config.isReducer) {
			node.meta.config.isReducer = true;
		}
		
		/**
		 * Listening to "state" ensures that all reducers have
		 * been executed before it triggers the React rerender
		 */
		node.actions.addHandler("state", handler);

		return () => {
			// Clean up the @handler from @node
			node.actions.removeHandler("state", handler);
		};
	}, [ node ]);

	return {
		state,
		update: (...args) => node.actions.invoke("update", ...args),	// Convenience dispatching function for "update" specifically
		dispatch: node.actions.invoke.bind(node),
		
		node,
	};
};

export function useContextNode(context, prop = "node") {
	const ctx = useContext(context);

	let nested = prop.split("."),
		node = ctx;

	for (let p of nested) {
		node = node[ p ];
	}

	return useNode(node);
};

export default {
	useNode,
	useContextNode,
};