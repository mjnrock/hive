import React from "react";
import { Header, List } from "semantic-ui-react";

import { Context } from "../../../App";
import { ThrowError, ErrorTypes as ErrorType } from "../../../lib/tag/Errors";

import Tags from "../../../lib/tag/package";
import { Tag } from "./TagGridView";
import { TagList } from "./TagListView";

export function Default() {
	const uint2 = new Tags.Uint8(65, {
		meta: {
			testEntry: true,
		},
	});
	const str2 = new Tags.String(`This is a string for testing`, {});
	const comp2 = new Tags.Compound([
		uint2,
		str2,
	], {});

	const uint = new Tags.Uint8(100, {
		meta: {
			testEntry: true,
		},
	});
	const str = new Tags.String(`This is a test string`, {});
	const comp = new Tags.Compound([
		uint,
		comp2,
		str,
	], {});

	return (
		<>
			<Header as="h2" textAlign="center">Table View</Header>
			<Tag tag={ comp } />

			<Header as="h2" textAlign="center">List View</Header>
			<List>
				<TagList tag={ comp } />
			</List>
		</>
	);
}

export default Default;