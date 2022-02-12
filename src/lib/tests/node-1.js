import Node from "./../core/Node";
import Console from "../util/Console";
import Signal from "../core/Signal";

Console.NewContext();

const node = new Node();

// node.addTrigger("test", (...args) => {
// 	console.log(args);
// });
// node.addTrigger(node.config.namespace("test"), (...args) => {
// 	console.log(args);
// });

// node.invoke("test", 1, 2, 3);
// node.invoke(Signal.Create({
// 	type: "test",
// 	data: 9,
// 	emitter: node,
// }));


node.invoke("state", {
	cats: 2,
});
console.log(node.state);
// node.invoke(node.config.namespace("state"), {
// 	cats: 4,
// });
// console.log(node.state);