import React, { useEffect, useState } from "react";
import { Segment, Message, Grid, Header, List } from "semantic-ui-react";

import $Util from "../../../lib/util/package";
import $Tag from "../../../lib/tag/Tag";
import $TagUint8 from "../../../lib/tag/TagUint8";

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

export function TagListView({ tag } = {}) {
	const [state, setState] = useState(tag);

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
			
			newTag._data.push(new $TagUint8(num, {}));

			setState({
				tag: newTag,
			});
		}
	};

	if(!state.tag) {
		return null;
	}

	console.log(`hover:bg-${ colors[ state.tag.type ] }XXX-700`)

	if(state.tag.type === $Tag.Types.Compound) {
		return (
			<List.Item>
				<div className="pa2 mb2 b ba br2 b--black-10">
					<Grid columns={ 2 }>
						<Grid.Column
							width={ 1 }
							style={{
								fontWeight: `bold`,
							}}
							textAlign="right"
						>
							{ tag.alias }
						</Grid.Column>

						<Grid.Column width={ 15 }>
							<div style={{
								color: lookup(state.tag.type),
								fontFamily: `monospace`,
								textAlign: `left`,
							}}>
								{ tag.type }
							</div>
							<br />
							{
								Object.values(state.tag._data).map((tag, i) => <TagListView key={ i } tag={ tag } />)
							}
						</Grid.Column>
					</Grid>
				</div>
			</List.Item>
		);
	} else {
		//NOTE:	There appears to be the ability to deeply nest colors, by translating the "." to "-"
		let css = `pa2 mb2 b ba br2 b--black-10 hover:bg-tagsss-blargs-700 hover:text-white`;
		// let css = `pa2 mb2 b ba br2 b--black-10 hover:bg-` + colors[ state.tag.type ] + `XXX-700`;

		return (
			<List.Item>
				<div className={ css }>
					<Grid>
						<Grid.Column
							style={{
								fontWeight: `bold`,
							}}
							textAlign="right"
						>
							{ tag.alias }
						</Grid.Column>

						<Grid.Column
							style={{
								color: lookup(state.tag.type),
								fontFamily: `monospace`,
							}}
							textAlign="left"
							verticalAlign="middle"
						>
							{ tag.type }
						</Grid.Column>
					</Grid>
				</div>
			</List.Item>
		);
	}
}

{/* <Segment raised style={{
	marginBottom: 12,
}}>
	<Grid columns={ 2 } padded>
		<Grid.Column width={ 1 }>
			{
				typeof state.tag._data === "object" ?
				Object.entries(state.tag._data || {}).map(([ key, value ], i) => {
					if(value == null) {
						return null;
					}

					let results = [];
					if(value instanceof $Tag) {
						results.push(
							<TagList key={ i } tag={ value } />
						);
					} else if(typeof value === "object") {
						results = JSON.stringify(value);
					} else {
						results = value;
					}

					return (
						<>
							<Grid.Row>
								<Header as="h5">{ key }</Header>
							</Grid.Row>

							<Grid.Row>
								{ results }
							</Grid.Row>
						</>
					);
				})
				:
				(
					<Message style={{
						color: lookup(state.tag.type),
						fontFamily: `monospace`,
						fontWeight: `bold`,
					}}>
						{ state.tag._data }
					</Message>
				)
			}
		</Grid.Column>
	</Grid>
</Segment> */}

export default TagListView;