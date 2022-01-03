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

const colors = {
	[ Tags.Types.Bool ]: "violet",

	[ Tags.Types.Uint8 ]: "teal",
	[ Tags.Types.Uint16 ]: "teal",
	[ Tags.Types.Uint32 ]: "teal",

	[ Tags.Types.Int8 ]: "blue",
	[ Tags.Types.Int16 ]: "blue",
	[ Tags.Types.Int32 ]: "blue",

	[ Tags.Types.String ]: "green",
	[ Tags.Types.Char ]: "green",

	[ Tags.Types.List ]: "black",
	[ Tags.Types.Compound ]: "grey",
};

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
		Records: (rootTag) => {
			//TODO Allow for recursive tag selection with nested dot selection
			//TODO This is setup for a 1-record tag.data paradigm -- convert to multi row and use column-based approach for css reasons
			if(rootTag.type !== Tags.Types.Compound) {
				return null;
			}

			const records = rootTag.data;

			return (
				<div className="inline-flex flex-col grow mt-1 container">
					<div className="ml-4 flex flex-row grow mb-2 text-gray-700 bg-gray-100 shadow-gray-300 shadow">{
						records.map(tag => (
							<div className={ `flex-1 p-1 pl-2 tracking-widest font-sansserif` } key={ tag.alias }>
								{ tag.alias }
								<br />

								<div className={ `text-neutral-100 text-tags-${ colors[ tag.type ] }-700 font-mono text-xs` }>
									{ tag.type }
								</div>								
							</div>
						))
					}</div>
					
					<div className="flex flex-row whitespace-nowrap text-gray-700">
						<div className="mr-2 pt-2 font-bold font-mono text-sm h-full text-gray-300">{ 1 }</div>
						<div className="flex-auto flex flex-row mb-1 border rounded shadow-gray-200 shadow">{
							records.map((tag, i) => {
								if(tag.type === Tags.Types.Compound) {
									return (
										<div className="mx-3 my-1 flex-auto">
											{
												renderTabs("Records", tag)
											}
										</div>
									);
								}
								
								return (
									<div className="flex-auto">
										<div className={ `p-1 pl-2` } key={ i }>{ tag.data.toString() }</div>
									</div>
								);
							})
						}</div>
					</div>
				</div>
			);
		},
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
				<input className="border p-2 m-2 rounded text-gray-700 container" type="text" value={ search } placeholder="Command Pane (Ctlr + K)" onChange={ e => setSearch(e.target.value) }/>
			</div>
			
			<div className="m-6 p-2">
				<div className="flex grow text-center">
					{
						[ `Schema`, `Entry`, `Records` ].map(key => {
							return (
								<div
									className={ `flex-auto cursor-pointer hover:font-bold hover:border-b-2 hover:border-b-blue-200 pt-3 pb-3 ` + (currentTab === key ? `font-bold border-b-2 border-b-blue-400` : ``) }
									onClick={ e => setCurrentTab(key) }
									key={ key }
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