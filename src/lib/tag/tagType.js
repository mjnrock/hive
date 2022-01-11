export const types = [
	//	Primitives
	"byte",
	
	"empty",
	"null",
	"bool",
	"any",

	"uint8",
	"uint16",
	"uint32",
	"uint64",
	"int8",
	"int16",
	"int32",
	"int64",
	"float32",
	"float64",

	"char",
	"string",
	"enum",
	"uuid",

	"date",
	"time",
	"datetime",
	
	"array",
	"compound",	

	"ref",
	"function",

	//	Composites
	[
		{
			number: [
				"uint8",
				"uint16",
				"uint32",
				"uint64",
				"int8",
				"int16",
				"int32",
				"int64",
				"float32",
				"float64",
			],
		},
		{
			text: [
				"char",
				"string",
				"number",
			],
		},
		{
			CustomTypeA() {
				//TODO Figure out what these should return
			},
			CustomTypeB() {},
			customTypes: [
				"CustomTypeA",
				"CustomTypeB",
			],
		},
	]
];

export default types;