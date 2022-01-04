import Console from "./util/Console";

import Controller from "./event/Controller";
import Router from "./event/Router";

Console.NewContext();

const controller1 = new Controller({
	state: {
		cats: 2,
	},
	handlers: {
		test: (...args) => console.log(...args),
	},
	hooks: {
		pre: (...args) => console.log("PRE:", ...args),
		post: (...args) => console.log("POST:", ...args),
		reducer: (result, state) => {
			return {
				...state,
				people: 3,
			};
		},
	}
});

const fnn = () => true;
controller1.addHandler("a", trigger => console.log(trigger.toString()));
controller1.addHandler(4, trigger => console.log(trigger.toString()));
controller1.addHandler(fnn, trigger => console.log(trigger.toString()));

const router = new Router({
	routes: [
		[
			trigger => true,
			controller1,
		],
	],
});

router.route("test", 1, 2, 3);
router.route("test2", 4, 5, 6);
router.route(4);
router.route(fnn);

console.log(controller1.state)
console.log(router.hasTrigger(4))
console.log(router.hasTrigger(5))
console.log(router.hasTrigger("a"))
console.log(router.hasTrigger("A"))