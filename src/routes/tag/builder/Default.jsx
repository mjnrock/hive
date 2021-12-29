import React from "react";


import { Context } from "../../../App";
import { ThrowError, ErrorTypes as ErrorType } from "../../../lib/tag/Errors";

import Tags from "../../../lib/tag/package";
import { Tag } from "./Tag";

export function Default() {
	const uint = new Tags.Uint8(100, {
		meta: {
			testEntry: true,
		},
	});
	const str = new Tags.String(`This is a test string`, {});
	const comp = new Tags.Compound([
		uint,
		str,
	], {});

	return (
		<Tag tag={ comp } />
	);
}

export default Default;