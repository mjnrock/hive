import Node from "./Node";
import Eventable from "./../event/Eventable";
import Subscribable from "./../subscription/Subscribable";

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
	],
});

console.log(node.state)

// node.actions.addSubscriber(node2, true);

// node2.actions.broadcast(Date.now());
// node.actions.broadcast(Date.now());
node.actions.toggleReducer(true);
node.actions.invoke("update", Date.now());

console.log(node.state)
console.log(node.$)

node.actions.toggleReducer(false);
node.actions.invoke("update", Date.now());

console.log(node.state)
console.log(node.$)

// Node.Registry.forEach(n => console.log(n.id));