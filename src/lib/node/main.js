import Node from "./Node";
import Eventable from "../overlays/Eventable";
import Subscribable from "../overlays/Subscribable";
import Collection from "../overlays/Collection";

const [ node, node2 ] = Node.Factory(2, {
	events: {
		// receive: (node, event) => (emitter, data) => console.log(event, emitter.id, data),
		receive: [
			// (node, event) => (emitter, data) => console.log(1111, event, emitter.id, data),
			// (node, event) => (emitter, data) => console.log(2222, event, emitter.id, data),
			// () => (emitter, data) => console.log(emitter.id, data),
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
		Collection,
	],
});

console.log(node)
// console.log(node.state)