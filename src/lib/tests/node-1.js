import Nexus from "./../core/Nexus";
import Node from "./../core/Node";
import Console from "../util/Console";
import Signal from "../core/Signal";

Console.NewContext();

const node = new Node({
	state: {
		cat: 2,
	},
});

// console.log(Nexus.$)
console.log(Nexus.$._state)
console.log(Nexus.$.state)
console.log(node.state)