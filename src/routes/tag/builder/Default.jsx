import React, { useState } from "react";
import { ChevronRightIcon } from "@heroicons/react/outline";

import Tags from "./../../../lib/tag/package";
import ListPane from "./pane/list/package";
import TagContainer from "./TagContainer";

const uint2 = new Tags.Uint8(`Uint-1`, 65, {
	meta: {
		testEntry: true,
	},
});
const str2 = new Tags.String(`Str-1`, `This is a string for testing`, {});
const comp2 = new Tags.Compound(`Comp-1`, [
	uint2,
	str2,
], {});

const uint = new Tags.Uint8(`Uint-2`, 100, {
	meta: {
		testEntry: true,
	},
});
const str = new Tags.String(`Str-2`, `This is a test string`, {});
const comp = new Tags.Compound(`Comp-2`, [
	uint,
	comp2,
	str,
], {});

function recurseList(input) {
	if(Array.isArray(input)) {
		return recurseList(input);
	}

	return input
}

export function Default() {
	const [ search, setSearch ] = useState("");
	const [ tags, setTags ] = useState([ 1, 2, 3 ]);
	const [ rootTag, setRootTag ] = useState(comp);

	return (
		<div className="flex">
			<div className="w-1/6 p-4 bg-gray-200 text-gray-700">
				{
					<ListPane.TagCompound tag={ rootTag } />
				}
			</div>

			<div className="w-5/6">
				<input className="border p-2 m-2 rounded" type="text" value={ search } onChange={ e => setSearch(e.target.value) }/>

				<TagContainer tag={ rootTag } />
			</div>
		</div>
	);
}

export default Default;