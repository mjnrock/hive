import Node from "./Node";
import Eventable from "../overlays/Eventable";
import Subscribable from "../overlays/Subscribable";
import Collection from "../overlays/Collection";
import Router from "../overlays/Router";

const [ router ] = Node.Factory(1, {
	overlays: [
		Eventable,
		Subscribable,
		Router,
	],
});
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
	overlays: [
		Eventable,
		Subscribable,
	],
});

router.actions.addRoute(() => true, (emitter, ...args) => console.log(...args));
router.actions.attach(node, node2);

node.actions.broadcast("test", 1, 2, 3);
router.actions.invoke("receive", node, "other", [ "a", "b" ]);
router.actions.route("different", [ "z", "x" ]);

console.log(router);