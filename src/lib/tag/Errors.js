export const ErrorTypes = {
	OutOfRange: [
		(input, tag) => {
			console.log(input, tag)
			return `The value of (${ input }) is out of range for tag type (${ tag.type })`;
		},
	],
	NotANumber: [
		(input, tag) => `(${ input }) is not a number`,
	],
	InvalidInput: [
		(input, tag) => `(${ input }) is not valid for tag`,
	],
};


//TODO Add a global debugging variable to modify/route behavior of ThrowError circumstantially
export function ThrowError([ message ], ...args) {
	throw new Error(message(...args));
}