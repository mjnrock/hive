import React from "react";

import Tags from "../../../lib/tag/package";
import TagContainer from "./TagContainer";

export function Default() {
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

	return (
		<div
			className="p-2 text-gray-700"
		>
			<TagContainer tag={ comp } />
		</div>
	);
}

export default Default;