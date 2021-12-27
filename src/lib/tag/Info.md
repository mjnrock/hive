# Context Primitives

## Types
* `byte`
* `empty`
* `null`
* `bool`
* `any`
* `uint8`
* `uint16`
* `uint32`
* `uint64`
* `int8`
* `int16`
* `int32`
* `int64`
* `float32`
* `float64`
* `char`
* `string`
* `json`
* `uuid`
* `date`
* `time`
* `datetime`
* `array`
* `object`
* `list`
* `compound`
* `ref`
* `func`

All `Context` descriptions below are written in javascript object notation.  If a value does not contain quotes, it is meant either as a *key word* or as a constraint *type*.  All `$` references can be thought of as a `this` equivalent for `Context` querying/notation.

## Key Words
|Key Word|Description|
|-|-|
|`@Primitive`|An `enum` for `Context` types|
|`@Context`|A `Context` instance|
|`@{type}`|A `type`-specific value-instance (e.g. `@uint8` -> 8)|

## Common Attributes
All attributes below are **required** for *all* tags.  Individual `Context` descriptions below show only those attributes *specific* to that `Context`.
```
{
	id: @uuid,
	type: @Primitive,
	alias: @string | @string[],
	data,					// data is dependent on the Context type
	meta: {
		...
	}
}
```

These attributes below are **optional** for *all* tags.
```
{
	namespace: @string,
	meta: {
		config: @object,
	},
}
```

---

## Empty [ `empty` ]
An empty tag, equivalent to `undefined` in javascript.
```
{
	data: @empty,
}
```

## Null [ `null` ]
A null tag, equivalent to `null` in javascript.
```
{
	data: @null,
}
```

## Any [ `any` ]
An unconstraint value.
```
{
	data: @buffer,
	meta: {
		size: @uint32,
	},
}
```

---

## Byte [ `byte` ]
A fixed-`size` buffer
```
{
	data: @buffer,
	meta: {
		size: @uint32,
	},
}
```

---

## Bool [ `bool` ]
A boolean value of `true` or `false`.
```
{
	data: @bool,
}
```

---

## **Numbers**
The *Numbers* category has a constraints within it to help deal with numbers, in general.
**Required**
**Optional**
```
{
	meta: {
		[?] min: @float32
		[?] max: @float32
	}
}
```

---

## Uint8 [ `uint8` ]
A 1-byte, unsigned integer.
|||
|-|-|
|Min|0|
|Max|255|

```
{
	data: @uint8,
}
```

## Uint16 [ `uint16` ]
|||
|-|-|
|Min|0|
|Max|65,535|

A 2-byte, unsigned integer.
```
{
	data: @uint16,
}
```

## Uint32 [ `uint32` ]
|||
|-|-|
|Min|0|
|Max|4,294,967,295|

A 4-byte, unsigned integer.
```
{
	data: @uint32,
}
```

## Uint64 [ `uint64` ]
|||
|-|-|
|Min|0|
|Max|18,446,744,073,709,551,615|

An 8-byte, unsigned integer.
```
{
	data: @uint64,
}
```

---

## Int8 [ `int8` ]
|||
|-|-|
|Min|-128|
|Max|127|

A 1-byte, unsigned integer.
```
{
	data: @int8,
}
```

## Int16 [ `int16` ]
|||
|-|-|
|Min|-32,768|
|Max|32,767|

A 2-byte, unsigned integer.
```
{
	data: @int16,
}
```

## Int32 [ `int32` ]
|||
|-|-|
|Min|-2,147,483,648|
|Max|2,147,483,647|

A 4-byte, unsigned integer.
```
{
	data: @int32,
}
```

## Int64 [ `int64` ]
|||
|-|-|
|Min|-9,223,372,036,854,775,808|
|Max|9,223,372,036,854,775,807|

An 8-byte, unsigned integer.
```
{
	data: @int64,
}
```

---

## Float32 [ `float32` ]
|||
|-|-|
|Min|-3.40282347E+38|
|Max|3.40282347E+38|

A 4-byte, floating-point number.
```
{
	data: @float32,
	meta: {
		[?] currency: @string		// Currency symbol
	}
}
```

## Float64 [ `float64` ]
|||
|-|-|
|Min|-1.7976931348623157E+308|
|Max|1.7976931348623157E+308|

An 8-byte, floating-point number.
```
{
	data: @float64,
	meta: {
		[?] currency: @string		// Currency symbol
	}
}
```

---

## Char [ `char` ]
A 1-byte, unsigned integer code representing its corresponding character in **utf-8** format
```
{
	data: @uint8,
}
```

## String [ `string` ]
A n-byte, unsigned integer array of codes representing their corresponding characters in **utf-8** format.  If `$.meta.size` exists, then that size represents the *max length* of the string (i.e. max element count).
```
{
	data: [ ...@uint8 ],
	meta: {
		[?] size: @uint64,
	}
}
```

## JSON [ `json` ]
A n-byte, unsigned integer array of codes representing their corresponding characters in **utf-8** format for a serialized *valid json* string.  If `$.meta.size` exists, then that size represents the *max length* of the string (i.e. max element count).
```
{
	data: [ ...@uint8 ],
	meta: {
		[?] size: @uint64,
	}
}
```

## UUID [ `uuid` ]
A n-byte, unsigned integer array of codes representing their corresponding characters in **utf-8** format for a uuid.
```
{
	data: [ ...@uint8 ],
	meta: {
		size: 36,
	}
}
```
`$.meta.size` : All valid UUIDs must be 36-characters (including dashes)

---

## Date [ `date` ]
A numeric representation of a date, expressed as the number of elapsed milliseconds since *1/1/1970*.
```
{
	data: @uint64,
	meta: {
		[?] offset: @string
	},
}
```
`$.meta.offset` : This should be a string represenation of the offset (e.g. `+04:00`)

## Time [ `time` ]
A time segmentation of hours, minutes, seconds, and milliseconds constrained to the valid times in a day.
```
{
	data: [ @uint8, @uint8, @uint8, @uint32 ],
}
```
|index|type|desc|min|max|
|-|-|-|-|-|
|0|`uint8`|Hours|0|23|
|1|`uint8`|Minutes|0|59|
|2|`uint8`|Seconds|0|59|
|3|`uint32`|Milliseconds|0|4,294,967,295|

## Datetime [ `datetime` ]
A direct combination of `date` and `time` into a single element.
```
{
	data: [ @uint64, @uint8, @uint8, @uint8, @uint32],
	meta: {
		[?] offset: @string
	},
}
```
|index|type|desc|min|max|
|-|-|-|-|-|
|0|`uint64`|Date|0|18,446,744,073,709,552,000|
|1|`uint8`|Hours|0|23|
|2|`uint8`|Minutes|0|59|
|3|`uint8`|Seconds|0|59|
|4|`uint32`|Milliseconds|0|4,294,967,295|

`$.meta.offset` : This should be a string represenation of the offset (e.g. `+04:00`)

---

## Array [ `array` ]
An equivalent `Context` for the `array` in javascript.
```
{
	data: @array,
}
```

## Object [ `object` ]
An equivalent `Context` for the `object` in javascript.
```
{
	data: @object,
}
```

---

## List [ `list` ]
A collection of items, whose type is dependent on `$.meta.items`
```
{
	data: [ ...@Context ],
	meta: {
		items: @Primitive | [ ...@Primitive ],
	},
}
```

### List Example
This shows an example `list` with **two (2)** `uint8` children.
```
{
	id: "596aafbe-1d0f-4347-a402-ed6b478bc361",
	type: "list",
	alias: "Range",
	data: [
		{
			id: "1fe59843-d689-4e45-ba45-7bbd3ea97318",
			type: "uint8",
			alias: "Min",
			data: 0,
		},
		{
			id: "79b3583b-53b8-4bbc-a2bc-40d1ccd5e149",
			type: "uint8",
			alias: "Max",
			data: 255,
		},
	],
	meta: {
		items: "uint8",
	},
}
```
**`$.meta.items`** : This *dictates* what types of children are allowed.  This can be a single item (e.g. `"uint8"`), or an array of multiple items (e.g. `[ "uint8", "string" ]`.  For an unspecified type, use the `any` type.

## Compound [ `compound` ]
A collection of key-`Context` pairs, that can optionally nest.
```
{
	data: [ ...@Context ],
	meta: {
		alias: [ ...@string ]
	},
}
```
**`$.meta.alias`** : This should be an *ordered list* of aliases in a bijection with `$.data` entries, to act a text-alias for that entry.

### Compound Example
This shows an example `compound` with **three (3)** children.
```
{
	id: "596aafbe-1d0f-4347-a402-ed6b478bc361",
	type: "compound",
	alias: "Container",
	data: [
		{
			id: "1fe59843-d689-4e45-ba45-7bbd3ea97318",
			type: "uint8",
			alias: "Child 1",
			data: 0,
		},
		{
			id: "79b3583b-53b8-4bbc-a2bc-40d1ccd5e149",
			type: "string",
			alias: "Child 2",
			data: "test",
		},
		{
			id: "d1e90e86-60b9-413c-a13b-842fd0cbb3e6",
			type: "string",
			alias: "Child 3",
			data: "other text",
		},
	],
	meta: {
		alias: [
			null,
			[ "c2", "child-2" ],
			"child3",
		],
	},
}
```
For the example above, you could access the `Context` with `alias='Child 3'` by invoking the `alias` (`$.Container.child3`), by using the `alias` (`$.Container["Child 3"]`), or with the `id` (`$.Container["d1e90e86-60b9-413c-a13b-842fd0cbb3e6"]`).

---

## Reference [ `ref` ]
A reference to another `Context` by storing the `id` of the "foreign key".
```
{
	data: @uuid
}
```

## Function [ `func` ]
A generic function, with optional syntax flag.
```
{
	data: @function,
	meta: {
		syntax: "js"
	},
}
```
`$.meta.syntax` : This should give a value representing the syntax language (e.g. **js = JavaScript**)

---

# Context Complexes
The complexes are multi-type, disjunctive sets.  A complex can be any one of its member-children.

## Types
* `number`
* `text`

---

## Number [ `number` ]
Anything immediately related to a *number*, such as: integers and decimal numbers.
 * `uint8`
 * `uint16`
 * `uint32`
 * `uint64`
 * `int8`
 * `int16`
 * `int32`
 * `int64`
 * `float32`
 * `float64`
```
{
	data: @number,
	meta: {
		[?] currency: @regex | @function		// Currency symbol
		[?] validate: @regex | @function		// Value-enforcement constraint
		[?] min: @float32
		[?] max: @float32
	},
}
```

## Text [ `text` ]
A higher-order *text* type that can encompasses anything immediately related to typography.

 * `char`
 * `string`
 * `number`
 * 
**Note:** The presence of the `number` type, illustrating the nestability of complexes.
```
{
	data: @type,
	meta: {
		[?] validate: @regex | @function		// Value-enforcement constraint
		[?] size: @int32
	},
}
```
`$.meta.syntax` : This should give a value representing the syntax language (e.g. **js = JavaScript**)

---