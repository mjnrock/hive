# Organization
A **Model** is a `Context` that is used in the schematization of data.  It describes the type-specific structure of the `Context` with all the information necessary in order to use as a template.

This is in relation to a **Record**, which is an *instantiation* of a **Model**.  In a record, the actual data is stored, along with any additional information that was added to the `Context`.

# Context
A ```Context``` is a typed state space.

Consider the implementation example below of a `Person`.

## Model

##### Schematic
A minimal representation of a `Person` **Model**, organizaed as a key-value-pair
```
	Person {
		FirstName: string,
		LastName: string,
		Age: uint8,
		Pets: {
			Cats: uint8,
			Dogs: uint8
		},
		Friends: Person[]
	}
```
##### Hierarchy Table
A hierarchy table describing the schematic of a `Person` **Model**, organized as a relational table
|PID|ID|Name|Type|
|---|---|---|---|
|-|0|Person|`compound`|
|0|1|FirstName|`string`|
|0|2|LastName|`string`|
|0|3|Age|`uint8`|
|0|4|Pets|`compound`|
|4|5|Cats|`uint8`|
|4|6|Dogs|`uint8`|
|0|7|Friends|`array`|
|7|8|@|`ref`|
|8|9|@|`Person`|

## Record

##### Context Literal
A `JavaScript` representation of the `Person` **Record**, organized into object notation
```
Person {
	type: "compound",
	data: {
		FirstName: {
			type: "string",
			data: "Kiszka",
		},
		LastName: {
			type: "string",
			data: "Buddha",
			nestedAttribute: {
				customAttribute: 420,
			},
			catfish: 69,
		},
		Age: {
			type: "uint8",
			data: 5,
		},
		Pets: {
			type: "compound",
			data: {
				Cats: {
					type: "uint8",
					data: 5,
				},
				Dogs: {
					type: "uint8",
					data: 5,
				},
			},
		},
		Friends: {
			type: "array",
			data: [
				{
					type: "ref",
					//	Reference the @id for connection
					data: @id
					meta: {
						type: "Person",
					},
				},
				{
					type: "ref",
					//	Reference the @id for connection
					data: @id
					meta: {
						type: "Person",
					},
				},
			],
			meta: {
				subtype: "ref",
				//	Enforce an "array type" constraint via a Validator hook
				hooks: {
					parser: "js",
					"@": input => input.type === EnumDataType.REF,
				},
			},
		},
	},
}
```
##### Hierarchy Table
A hierarchy table describing the `Person` **Record**, organized to describe all of the data present in the object-notation version, except presented as a relational table
|PID|ID|Name|Type|Data|Meta|
|---|---|---|---|---|---|
|-|0|Person|`compound`|-|-|
|0|1|FirstName|`string`|Kiszka|-|
|0|2|LastName|`string`|Buddha|{ state: [ [ "nestedAttribute.customAttribute", 420 ], [ "catfish", 69 ] ] }|
|0|3|Age|`uint8`|5|-|
|0|4|Pets|`compound`|-|-|
|4|5|Cats|`uint8`|5|-|
|4|6|Dogs|`uint8`|5|-|
|0|7|Friends|`array`|-|{ subtype: "ref", hooks: { parser: "js", "@": input => input.type === EnumDataType.REF, } }|
|7|8|-|`ref`|@id|{ type: "Person" }|
|7|9|-|`ref`|@id|{ type: "Person" }|

*State* is an abstraction of any `key` present in the `Context` that is not a reserved word below:

* `id`
* `data`
* `meta`

Any attributes found during translation will be put into `Context.meta.state`, and will be placed back into their appropriate position upon reconstitution, even if they were originally nested.