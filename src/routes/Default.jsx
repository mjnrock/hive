import React, { useContext } from "react";
import { Flux } from "../App";

function TestComponent({ state, dispatch } = {}) {
	return (
		<div className="p-4 m-4 border">
			{
				JSON.stringify(state)
			}
			<button onClick={ e => dispatch("test", 1, 2, 3) }>Click Me</button>
			<button onClick={ e => dispatch("cat", 4, 5, 6) }>Click Me</button>
		</div>
	);
}

export function Default() {
	const { state, dispatch } = useContext(Flux);

	return (
		<div className="p-4 m-4 border">
			{
				JSON.stringify(state)
			}
			<TestComponent state={ state } dispatch={ dispatch } />
		</div>
	)
}

export default Default;