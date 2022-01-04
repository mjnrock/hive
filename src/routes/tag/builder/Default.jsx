import React, { useState } from "react";
import { SearchIcon } from "@heroicons/react/outline";

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
				<div className="container inline-flex flex-col mt-1 grow">
					<div className="flex flex-row mb-2 ml-4 text-gray-700 bg-gray-100 shadow grow shadow-gray-300">{
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
					
					<div className="flex flex-row text-gray-700 whitespace-nowrap">
						<div className="h-full pt-2 mr-2 font-mono text-sm font-bold text-gray-300">{ 1 }</div>
						<div className="flex flex-row flex-auto mb-1 border rounded shadow shadow-gray-200">{
							records.map((tag, i) => {
								if(tag.type === Tags.Types.Compound) {
									return (
										<div className="flex-auto mx-3 my-1" key={ tag.id }>
											{
												renderTabs("Records", tag)
											}
										</div>
									);
								}
								
								return (
									<div className="flex-auto" key={ tag.id }>
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

export function TagBuilderDefault() {
	const [ search, setSearch ] = useState("");
	const [ currentTab, setCurrentTab ] = useState("Schema");
	const [ rootTag, setRootTag ] = useState(comp);

	return (
		<div className="flex flex-col grow">
			<div className="relative m-6 group">
				<SearchIcon width="20" height="20" className="absolute left-3 top-1/2 -mt-2.5 text-gray-400 pointer-events-none group-focus-within:text-blue-500" />
				<input className="w-full py-2 pl-10 text-sm leading-6 text-gray-900 placeholder-gray-400 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ring-1 ring-gray-200" type="text" value={ search } placeholder="Command Pane (Ctlr + K)" onChange={ e => setSearch(e.target.value) }/>
			</div>
			
			<div className="p-2 m-6">
				<div className="flex text-center grow">
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

export default TagBuilderDefault;