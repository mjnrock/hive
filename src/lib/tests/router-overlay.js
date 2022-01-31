import Console from "../util/Console";

import Node from "../node/Node";
import Router from "../overlays/Router";

Console.NewContext();

const [ router ] = Node.Factory(1, [ Router ]);	// Shorthand @opts when using only Overlays
const [ node, node2, node3 ] = Node.Factory(3, {
	triggers: {
		route: [
			({ target, trigger }) => (emitter, ...args) => console.log(`Node.route :: `, ...args),
		],
		receive: [
			({ target, trigger }) => (emitter, data) => console.log(trigger, emitter.id, data),
		],
		update: [
			({ target, trigger }) => (data) => ({ now: data }),
		],
		state: [
			({ target, trigger }) => (state, previous) => console.log(trigger, state, previous),
		],
	},
	// overlays: [],
});

router.actions.toggleMultiMatch(true);
// console.log(router);

router.triggers = {
	route: [
		({ target, trigger }) => (...args) => console.log(`Router.route :: `, ...args),
	],
	receive: [
		({ target, trigger }) => (emitter, data) => console.log(`Router.receiveAb :: `, trigger, emitter.id, data),
		({ target, trigger }) => (emitter, data) => console.log(`Router.receive :: `, trigger, emitter.id, data),
		({ target, trigger }) => (emitter, data) => console.log(`Router.receiveBe :: `, trigger, emitter.id, data),
	],
};

router.actions.addRoute(() => true, node);

router.actions.route("test", 1, 2, 3);

node2.actions.broadcast("shouldn't hear", 23, 5)
router.actions.addRoute(() => true, (emitter, ...args) => console.log(`Router.route2 :: `, ...args));
node2.actions.addSubscriber(router);
// router.actions.subscribeTo(node2);

node2.actions.addHandler("receive", () => (emitter, ...args) => console.log(`Node2.receiveAf :: `, ...args));
router.actions.addHandler("receive", () => (emitter, ...args) => console.log(`Router.receiveAf :: `, ...args));
// console.log(router.triggers)

node2.actions.broadcast("should hear", 888)

router.actions.broadcast("shouldn't hear", 5, 6, 7)
node2.actions.subscribeTo(router);
router.actions.broadcast("should hear", 999)