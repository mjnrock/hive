import React, { useEffect, useState } from "react";

import $Util from "../../../lib/util/package";
import $Tag from "../../../lib/tag/Tag";
import $TagUint8 from "../../../lib/tag/TagUint8";
import $TagString from "../../../lib/tag/TagString";

const colors = {
	[ $Tag.Types.Bool ]: "violet",

	[ $Tag.Types.Uint8 ]: "teal",
	[ $Tag.Types.Uint16 ]: "teal",
	[ $Tag.Types.Uint32 ]: "teal",

	[ $Tag.Types.Int8 ]: "blue",
	[ $Tag.Types.Int16 ]: "blue",
	[ $Tag.Types.Int32 ]: "blue",

	[ $Tag.Types.String ]: "green",
	[ $Tag.Types.Char ]: "green",

	[ $Tag.Types.List ]: "black",
	[ $Tag.Types.Compound ]: "grey",
};
const lookup = type => {
	const map = {
		red: "#B03060",
		orange: "#FE9A76",
		yellow: "#FFD700",
		olive: "#32CD32",
		green: "#016936",
		teal: "#008080",
		blue: "#0E6EB8",
		violet: "#EE82EE",
		purple: "#B413EC",
		pink: "#FF1493",
		brown: "#A52A2A",
		grey: "#A0A0A0",
		black: "#000000",
	};

	return map[ colors[ type] ];
};

/**
 * bg-tags-green-700
 * bg-tags-teal-700
 * bg-tags-grey-700
 * text-tags-green-700
 * text-tags-teal-700
 * text-tags-grey-700
 * hover:bg-tags-green-700
 * hover:bg-tags-teal-700
 * hover:bg-tags-grey-700
 */

export function TagContainer({ tag, css, onDoubleClick } = {}) {
	const [state, setState] = useState({
		tag,
		activeTag: null,
		activeTagAlias: "",
	});

	useEffect(() => {
		let newState = {
			tag,
		};

		setState(newState);
	}, [tag]);

	const handleEvent = e => {
		if(state.tag.type === $Tag.Types.Compound) {
			let num = $Util.Dice.random($TagUint8.MinValue, $TagUint8.MaxValue);
			let newTag = state.tag;
			
			if(Math.random() > 0.5) {
				newTag.data.push(new $TagUint8(`Uint8-${ Date.now().toString().slice(0, 5) }`, num, {}));
			} else {
				let arr = $Util.Helper.arrayRange(v => {
					return String.fromCharCode($Util.Dice.random(65, 90))
				}, 6);

				newTag.data.push(new $TagString(`Str-${ Date.now().toString().slice(0, 5) }`, arr.join(""), {}));
			}

			setState({
				tag: newTag,
			});
		}
	};

	if(!state.tag) {
		return null;
	}

	let children = null;
	if(state.tag.type === $Tag.Types.Compound) {
		children = (
			<div className="flex flex-col p-2 mb-2 border border-gray-300 rounded">
				<div className="flex flex-row mb-4">
					<div className={ `text-left font-mono mr-6 bg-tags-${ colors[ state.tag.type ] }-700 text-white pl-1 pr-1 border rounded text-center text-sm` }>
						{ state.tag.type }
					</div>
					
					<div className="mr-6 font-bold">
						{ state.tag.alias }
					</div>
				</div>

				<div className="mb-2 ml-8">
					{
						Object.values(state.tag.data).map((tag, i) => (
							//TODO:	This isn't in the right place, nor does it work fully, but it's a working POC of the double-click edit
							<div className="flex flex-row">
								{
									state.activeTag && (state.activeTag.id === tag.id) ? (
										<div className="relative m-6 group">
											<div className={ `absolute left-3 top-1/2 -mt-2.5 text-left font-mono mr-6 bg-tags-${ colors[ state.tag.type ] }-700 text-white pl-1 pr-1 border rounded text-center text-sm` }>
												{ state.tag.type }
											</div>
											
											<input className="w-full py-2 pl-[100px] text-sm leading-6 text-gray-900 placeholder-gray-400 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ring-1 ring-gray-200" type="text" value={ state.activeTagAlias } placeholder="Command Pane (Ctlr + K)" onKeyPress={ e => {
												if(e.key === "Enter") {
													setState({ ...state, activeTag: null, activeTagAlias: null });
												}
											}} onChange={ e => {
												tag.alias = e.target.value;

												setState({ ...state, activeTagAlias: tag.alias });
											}}/>
										</div>
									) : (
										<TagContainer css="w-full" key={ i } tag={ tag } onDoubleClick={ e => setState({ ...state, activeTag: tag, activeTagAlias: tag.alias }) } />
									)
								}
							</div>
						))
					}

					<button
						className="p-2 font-mono text-sm text-blue-400 bg-white border border-blue-400 rounded drop-shadow hover:text-white hover:bg-blue-400"
						onClick={ handleEvent }
					>Add Tag</button>
				</div>
			</div>
		);
	} else {
		children = (
			<div className={ `flex p-2 mb-2 border rounded bg-gray-100 hover:bg-tags-${ colors[ state.tag.type ] }-700 hover:text-white` }>
				<div className={ `text-left font-mono mr-6 font-normal bg-black-50 bg-tags-${ colors[ state.tag.type ] }-700 text-white pl-1 pr-1 border rounded border-white text-center text-sm` }>
					{ state.tag.type }
				</div>

				<div className="mr-6 font-bold">
					{ state.tag.alias }
				</div>
			</div>
		);
	}

	return (
		<div className={ `mb-4 ${ css }` } onDoubleClick={ onDoubleClick }>
			{
				children
			}
		</div>
	)
}
export default TagContainer;