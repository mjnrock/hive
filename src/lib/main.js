//TODO Convert the Router and Controller to Overlays
//TODO Make a "TagCompound System" Controller to perform all relevant commands on a TagCompound (and to recursively call itself when appropriate)

import Console from "./util/Console";

import Node from "./node/Node";
import Router from "./overlays/Router";

import TagControllerFactory from "./controllers/Tag";


Console.NewContext();

Console.log(TagControllerFactory(5).map(v => v.state.id));

Console.hr(20, "*");

const [ router ] = Node.Factory(1, [ Router ]);	// Shorthand @opts when using only Overlays
const [ node, node2 ] = Node.Factory(2, {
	triggers: {
		route: [
			(node, event) => (emitter, ...args) => console.log(`Node.route :: `, ...args),
		],
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

router.actions.toggleMultiMatch(true);
// console.log(router);

router.actions.addRoute(() => true, node);
router.actions.addRoute(() => true, (emitter, ...args) => console.log(`Router..handler :: `, ...args));

router.actions.route("test", 1, 2, 3);