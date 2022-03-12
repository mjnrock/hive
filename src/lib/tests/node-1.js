import Nexus from "./../core/Nexus";
import Node from "./../core/Node";
import Console from "../util/Console";
import Signal from "../core/Signal";

Console.NewContext();

const node = Nexus.Spawn({
	state: {
		cat: 2,
	},
	tags: [
		"gatto",
	],
});

// console.log(Nexus.$)
// console.log(Nexus.$._state)
// console.log(Nexus.$.state)
// console.log(node.state)


// node.addTrigger("state2")
// node.addTriggers([[ "state3" ]])
// // node.addTriggers([[ "state3" ]])
// // node.toggle("isReducer")
// node.invoke("state2", { cat: 6 })
// node.invoke("state3", { cat: 55 })
// console.log(node.state)
// console.log(node._state)

console.log(node.tags)
console.log(Nexus.$match([
	"gatto"
], {
	map: node => node.id
}))