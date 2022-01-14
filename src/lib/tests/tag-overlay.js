import Console from "../util/Console";
import Dice from "../util/Dice";

import Node from "../node/Node";
import OverlayTag from "../overlays/Tag";

import Tags from "./../tag/package";

Console.NewContext();

// const [ node ] = Node.Factory(1, [ OverlayTag ]);

// Console.section("Initial State");
// console.log(node.state);

// Console.section("Event");
// node.actions.invoke("ADD_TAG", Tags.Types.Uint8, "cats", Dice.random(0, 255));
// node.actions.invoke("ADD_TAG", Tags.Types.Uint8, "cats", Dice.random(0, 255));
// node.actions.invoke("ADD_TAG", Tags.Types.Uint8, "cats", Dice.random(0, 255));
// console.log(node.state);

const tagComp = Tags.Create(Tags.Types.Compound, "comp", [
	[ Tags.Types.String, "str", `cat` ],
	[ Tags.Types.Compound, "comp2", [
		[ Tags.Types.String, "str2", `cats` ],
	]],
]);

const { $ } = tagComp;
let id = $`comp2`.id;
let id2 = $`comp2.str2`.id;
console.log(id, `${ id }`);
console.log(id2, `${ id2 }`);
// console.log($().alias);
console.log($`comp2.str2`.alias);
console.log($`${ id }.${ id2 }`.alias);
// console.log($`0`.alias);
// console.log($`1`.alias);
// console.log($`2`);
// console.log(tagComp[ 0 ].alias);


// console.log(tagComp.$());
// console.log(tagComp.$`str`.meta);
// console.log(tagComp.$`comp2.str2`.data);