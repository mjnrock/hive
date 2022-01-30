import React, { useEffect, useState } from "react";
import { seedArray } from "../lib/util/helper";
import { useContextNode } from "../lib/react/package";

import { Context } from "../App";

export function TestComponent() {
	// const { node } = useContext(Context);
	// const { state, update } = useNode(node);
	const { state, update } = useContextNode(Context, "root.node");
	
	useEffect(() => {
		const int = setInterval(() => {
			update({
				cats: Math.random(),
			});
		}, 1000);

		return () => {
			console.log(int)
			clearInterval(int);
		}
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
export function TestComponent2() {
	// const { node } = useContext(Context);
	// const { state, update } = useNode(node);
	const { update } = useContextNode(Context, "root.node");

	return (
		<>
			<div>
				{
					Date.now().toString()
				}
			</div>
		</>
	);
}

export function Default() {
	const [ comps, setComps ] = useState(1);
	
	return (
		<>
			<button className="p-4 m-2 border" onClick={ e => setComps(comps + 1)}>Inc</button>
			<button className="p-4 m-2 border" onClick={ e => setComps(comps - 1)}>Dec</button>
			{
				seedArray(comps, (i) => <TestComponent key={ i } />)
			}
			{
				seedArray(comps, (i) => <TestComponent2 key={ i } />)
			}
		</>
	);
}

export default Default;