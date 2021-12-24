import Node from "./Node";
import Eventable from "../overlays/Eventable";
import Subscribable from "../overlays/Subscribable";
import Collection from "../overlays/Collection";
import Router from "../overlays/Router";

import Proposition from "../util/logic/Proposition";
import Console from "../util/Console";

Console.NewContext();

const [ router ] = Node.Factory(1, [ Router ]);
const [ collection ] = Node.Factory(1, [ Collection ]);
const [ node, node2 ] = Node.Factory(2, {
	events: {
		receive: [
			(node, event) => (emitter, data) => console.log(event, emitter.id, data),
		],
		update: [
			(node, event) => (data) => ({ now: data }),
		],
		state: [
			(node, event) => (state, previous) => console.log(event, state, previous),
		],
	},
	// overlays: [],
});

// router.actions.addRoute(() => true, (emitter, ...args) => console.log(...args));
// router.actions.attach(node, node2);

// node.actions.broadcast("test", 1, 2, 3);
// router.actions.invoke("receive", node, "other", [ "a", "b" ]);
// router.actions.route("different", [ "z", "x" ]);

collection.actions.addEntry(1, 2, 3, 4, 5);

// for(let entry of collection) {
// 	console.log(entry)
// }

let propValueGTE3 = new Proposition(v => v >= 3);
let propValueLT5 = new Proposition(v => v < 5);
let propCompound = Proposition.AND(
	propValueGTE3,
	propValueLT5,
);
let results = collection.actions.where(propCompound);
console.log(results);