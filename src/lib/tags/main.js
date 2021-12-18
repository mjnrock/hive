import Tag from "./Tag";
console.clear();

// const tag = new Tag();

// console.log(tag);

console.log(Tag);
console.log(Tag.Uint8(-45, {
	hooks: {
		"*": () => 254654654,
		"=": input => input,
		"**": () => console.log("ALLLLOOOOO"),
	},
}));