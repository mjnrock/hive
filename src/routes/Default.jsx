import React, { useEffect, useState } from "react";
import { useContextNode } from "../lib/react/package";

import { Context } from "../App";

export function TestComponent() {
	// const { node } = useContext(Context);
	// const { state, update } = useNode(node);
	const { state, update } = useContextNode(Context, "node");

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
export function TestComponent2() {
	// const { node } = useContext(Context);
	// const { state, update } = useNode(node);
	const { dispatch } = useContextNode(Context, "node");

	return (
		<>
			<button className="p-4 m-2 border" onClick={ e => dispatch("test", 12345) }>Do stuff</button>
			<div>
				{
					22
				}
			</div>
		</>
	);
}

export function TestDefault() {
	const [ size, setSize ] = useState(1);
	const [ comps, setComps ] = useState([]);

	useEffect(() => {
		if(size < comps.length) {
			setComps(comps.slice(0, size));
		} else {
			setComps([
				...comps,
				[
					<TestComponent />,
					<TestComponent2 />,
				]
			]);
		}
	}, [ size ]);
	
	return (
		<>
			<button className="p-4 m-2 border" onClick={ e => setSize(size + 1)}>Inc</button>
			<button className="p-4 m-2 border" onClick={ e => setSize(size - 1)}>Dec</button>
			{
				comps
			}
		</>
	);
}
export function Default() {	
	return (
		<>
			Default Routing Page
		</>
	);
}

//FIXME export default Default;
export default TestDefault;