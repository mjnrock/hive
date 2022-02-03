// import { useContext, useState } from "react";
import { useEffect, useState } from "react";

export function useReducer({ state: i_state, reducers: i_reducers } = {}) {
	const [ state, setState ] = useState(i_state || {});
	const [ reducers, setReducers ] = useState(i_reducers || []);
	const dispatch = (type, ...args) => {
		let next;
		for(let reducer of reducers) {
			next = reducer(type, ...args);
		}

		if(next !== void 0) {
			setState(next);
		}
	};

	useEffect(() => {
		setReducers(i_reducers);
	}, [ i_reducers ]);

	return {
		state,
		dispatch,
	};
};

//TODO Verify that this actuall updates the Context
// export function useContextReducer(context, { prop = "", reducers = [] } = {}) {
// 	const ctx = useContext(context);

// 	let nested = prop.split("."),
// 		tier = ctx;

// 	for (let p of nested) {
// 		tier = tier[ p ];
// 	}

// 	return useReducer({ state: tier, reducers });
// };

export default {
	useReducer,
	// useContextReducer,
};