import Console from "../util/Console";
import Dice from "../util/Dice";

import Node from "../node/Node";
import OverlayTag from "../overlays/Tag";

import Tags from "./../tag/package";

Console.NewContext();

const [ node, node2 ] = Node.Factory(2, [ OverlayTag ]);

Console.section("Initial State");
console.log(node.state);

Console.section("Event");
node.actions.invoke("ADD_TAG", Tags.Types.Uint8, "cats", Dice.random(0, 255));
node.actions.invoke("ADD_TAG", Tags.Types.Uint8, "cats", Dice.random(0, 255));
node.actions.invoke("ADD_TAG", Tags.Types.Uint8, "cats", Dice.random(0, 255));
console.log(node.state);