import Context from "./Context";
console.clear();

const ctx = new Context();

console.log(ctx);

console.log(Context);
console.log(Context.Uint8(-45, {
	hooks: {
		"*": () => 254654654,
		"=": input => input,
		"**": () => console.log("ALLLLOOOOO"),
	},
}));