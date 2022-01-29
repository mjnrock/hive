import React, { useContext, useEffect, useState } from "react";

// import TagBuilder from "./tag/builder/Default";

import { Context } from "../App";

export function useNode(node) {
	const [ state, setState ] = useState(node.state);

	useEffect(() => {
		const handler = () => (newState) => {
			return newState;
		};

		if(!node.meta.config.isReducer) {
			node.meta.config.isReducer = true;
		}

		node.triggers = {
			state: [
				() => (newState, oldState) => {
					setState(newState);		// Trigger the React update
				},
			],
		};
		node.actions.addHandler(handler);

		return () => {
			node.actions.removeHandler(handler);
		};
	}, [ node ]);

	return {
		state,
		setState: newState => node.actions.invoke("update", newState),
		dispatch: node.actions.invoke.bind(node),
		node,
	};
};

/**
 * This is functionally identical to << useNode >> except that this
 * version utilizes the << Subscribable >> overlay and its returning
 * << setState >> method will invoke << .broadcast >> instead of an
 * "update" handler.  As such, this version ALWAYS expects its receiving
 * payload to be the @newState.
 */
export function useNodeBroadcast(node) {
	const [ state, setState ] = useState(node.state);

	useEffect(() => {
		const handler = function(emitter, newState) {
			node.actions.invoke("update", newState);
		};

		if(!node.meta.config.isReducer) {
			node.meta.config.isReducer = true;
		}

		node.triggers = {
			state: [
				() => (newState, oldState) => {
					setState(newState);
				},
			],
		};
		node.actions.addSubscriber(handler);

		return () => {
			node.actions.removeSusbcriber(handler);
		};
	}, [ node ]);

	return {
		state,
		setState: node.actions.broadcast.bind(node),
		broadcast: newState => node.actions.broadcast.call(node, newState),
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

export function useContextNodeBroadcast(context, prop = "node") {
	const ctx = useContext(context);

	let nested = prop.split("."),
		node = ctx;

	for (let p of nested) {
		node = node[ p ];
	}

	return useNodeBroadcast(node);
};

export function Default() {
	// const { node } = useContext(Context);
	// const { state, setState } = useNode(node);
	// const { state, setState } = useNodeBroadcast(node);
	const { state, setState } = useContextNode(Context, "node");
	// const { state, setState } = useContextNodeBroadcast(Context, "node");

	
	useEffect(() => {
		setState({
			cats: 2,
		});
	}, []);

	return (
		<>
			<div>
				{
					JSON.stringify(state)
				}
			</div>
		</>
	);
}

export default Default;