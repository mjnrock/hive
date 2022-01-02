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

export function TagContainer({ tag } = {}) {
	const [config, setConfig] = useState({
		currentType: $Tag.Types.Bool,
	});
	const [state, setState] = useState({
		tag,
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

	if(state.tag.type === $Tag.Types.Compound) {
		return (
			<div className="flex p-2 mb-2 border rounded bg-black-10">
				<div>
					<div className="font-bold mr-6">
						{ state.tag.alias }
					</div>

					<div className={ `text-left font-mono mr-6 bg-tags-${ colors[ state.tag.type ] }-700 text-white pl-1 pr-1 border rounded text-center text-sm` }>
						{ state.tag.type }
					</div>
				</div>

				<div className="mb-4 w-full">
					{
						Object.values(state.tag.data).map((tag, i) => <TagContainer key={ i } tag={ tag } />)
					}

					<button
						className="font-mono text-sm p-2 border drop-shadow rounded border-blue-400 text-blue-400 bg-white hover:text-white hover:bg-blue-400"
						onClick={ handleEvent }
					>Add Tag</button>
				</div>
			</div>
		);
	} else {
		return (
			<div className={ `flex p-2 mb-2 border rounded bg-black-10 hover:bg-tags-${ colors[ state.tag.type ] }-700 hover:text-white` }>
				<div className="font-bold mr-6">
					{ state.tag.alias }
				</div>

				<div className={ `text-left font-mono mr-6 font-normal bg-black-50 bg-tags-${ colors[ state.tag.type ] }-700 text-white pl-1 pr-1 border rounded border-white text-center text-sm` }>
					{ state.tag.type }
				</div>

				<div className="font-mono bg-gray-200 text-gray-700 pl-2 pr-2">
					{ state.tag.data }
				</div>
			</div>
		);
	}
}
export default TagContainer;