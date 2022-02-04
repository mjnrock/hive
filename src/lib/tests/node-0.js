import Node from "../swarm/Node";
import Console from "./../util/Console";

Console.NewContext();

const node = new Node();
// console.log(node);

node.addTrigger("test", ([ a, b, c ], { trigger, node }) => {
	console.log(a, b, c);
});

node.exec("test", 1, 2, 3);

const cats = {
	meows: "yes",
};
node.addTrigger(cats, ([ a, b ], { trigger, node }) => {
	console.log(a, b);
});

node.exec(cats, "meew", "cheese");