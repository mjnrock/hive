import Node from "../swarm/Node";
import Console from "./../util/Console";

Console.NewContext();

const node = new Node();
const node2 = new Node();
// console.log(node);

// node.addTrigger("test", ([ a, b, c ], { trigger, node }) => {
// 	console.log(a, b, c);
// });

// node.invoke("test", 1, 2, 3);

// const cats = {
// 	meows: "yes",
// };
// node.addTrigger(cats, ([ a, b ], { trigger, node }) => {
// 	console.log(a, b);
// });

// node.invoke(cats, "meew", "cheese");

node.tags = [[ "cat" ]];
console.log(node.tags);
console.log(node2.tags);