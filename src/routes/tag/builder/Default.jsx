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

function renderTabs(tab, rootTag) {
	const tabs = {
		Schema: tag => (
			<TagContainer tag={ tag } />
		),
		Entry: tag => (
			<div>
				Tab Entry
			</div>
		),
		Records: tag => (
			<div>
				Tab Records
			</div>
		),
	};

	return tabs[ tab ](rootTag);
}

export function Default() {
	const [ search, setSearch ] = useState("");
	const [ currentTab, setCurrentTab ] = useState("Schema");
	const [ rootTag, setRootTag ] = useState(comp);

	return (
		<div className="flex flex-col grow">
			<div className="m-6 mb-0 w-full">
				<input className="border p-2 m-2 rounded text-gray-700 w-full" type="text" value={ search } placeholder="Command Pane (Ctlr + K)" onChange={ e => setSearch(e.target.value) }/>
			</div>
			
			<div className="m-6 p-2">
				<div className="flex grow text-center">
					{
						[ `Schema`, `Entry`, `Records` ].map(key => {
							return (
								<div
									className={ `flex-auto cursor-pointer hover:font-bold hover:border-b-2 hover:border-b-blue-200 pt-3 pb-3 ` + (currentTab === key ? `font-bold border-b-2 border-b-blue-400` : ``) }
									onClick={ e => setCurrentTab(key) }
								>
									{ key }
								</div>
							);
						})
					}
				</div>

				<div className="p-4">
					{
						renderTabs(currentTab, rootTag)
					}
				</div>
			</div>
		</div>
	);
}

export default Default;