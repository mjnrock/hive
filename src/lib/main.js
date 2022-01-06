//TODO Convert the Router and Controller to Overlays
//TODO Make a "TagCompound System" Controller to perform all relevant commands on a TagCompound (and to recursively call itself when appropriate)

import Console from "./util/Console";

import Controller from "./event/Controller";
import Router from "./event/Router";

import Tags from "./tag/package";
import Tag from "./tag/Tag";
import TagCompound from "./tag/TagCompound";
import Dice from "./util/Dice";

Console.NewContext();

const uint2 = new Tags.Uint8(`Uint-1`, 65, {
	meta: {
		testEntry: true,
	},
});
const str2 = new Tags.String(`Str-1`, `This is a string for testing`, {});
const comp2 = new Tags.Compound(`Comp-1`, [
	uint2,
	str2,
], {});

const controller1 = new Controller({
	state: comp2,
	handlers: {
		test: (...args) => console.log(...args),
	},
	hooks: {
		// pre: (...args) => console.log("PRE:", ...args),
		// post: (...args) => console.log("POST:", ...args),
		reducer: (result, state) => {
			state.addTag(Tags.Uint8.Create(Math.random().toString(), Dice.random(0, 255)));

			return state;
		},
	}
});

const router = new Router({
	routes: [
		[
			trigger => true,
			controller1,
		],
	],
});

console.log(controller1.state)

router.route("test", 1, 2, 3);
router.route("test2", 1, 2, 3);
router.route("test", 1, 2, 3);

Console.hr();
console.log(controller1.state)




/**
 * 		TESTS
 */


// const fnn = () => true;
// controller1.addHandler("a", trigger => console.log(trigger.toString()));
// controller1.addHandler(4, trigger => console.log(trigger.toString()));
// controller1.addHandler(fnn, trigger => console.log(trigger.toString()));

// router.route("test", 1, 2, 3);
// router.route("test2", 4, 5, 6);
// router.route(4);
// router.route(fnn);

// console.log(controller1.state)
// console.log(router.hasTrigger(4))
// console.log(router.hasTrigger(5))
// console.log(router.hasTrigger("a"))
// console.log(router.hasTrigger("A"))