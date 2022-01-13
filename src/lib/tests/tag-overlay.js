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
console.log($());
console.log($`str`.data);


// console.log(tagComp.$());
// console.log(tagComp.$`str`.meta);
// console.log(tagComp.$`comp2.str2`.data);