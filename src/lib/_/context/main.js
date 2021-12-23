import Context from "./Context";
console.clear();

// const ctx = new Context();

// console.log(ctx);

// console.log(Context);
// console.log(Context.Uint8(-45, {
// 	hooks: {
// 		"*": () => 254654654,
// 		"=": input => input,
// 		"**": () => console.log("ALLLLOOOOO"),
// 	},
// }));
console.log(Context.Compound([
	Context.Uint8(-45, {
		name: "Nomen",
		hooks: {
			"@": () => false,
			"*": () => 254654654,
			"=": input => input,
			"**": () => console.log("ALLLLOOOOO"),
		},
	}),
	Context.Int8(-45, {
		name: "Nomen2",
		hooks: {
			"*": () => 254654654,
		},
	})
], {
	hooks: {
		"@": () => true,
	},
}));