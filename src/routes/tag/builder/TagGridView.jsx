import React, { Fragment, useEffect, useState } from "react";
import { Segment, Message, Grid, Header } from "semantic-ui-react";

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

export function TagGridView({ tag } = {}) {
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
			
			newTag._data.push(new $TagUint8(`Uint-${ num }`, num, {}));

			setState({
				tag: newTag,
			});
		}
	};

	if(!state.tag) {
		return null;
	}

	return (
		<Segment raised style={{
			marginBottom: 12,
		}}>
			<Grid columns="equal" padded>
				{
					Object.entries(state.tag || {}).map(([ key, value ], i) => {
						if(value == null || (key === "data" || key === "_data") || !Object.keys(JSON.parse(JSON.stringify(value))).length) {
							return null;
						}

						let result;
						if(typeof value === "object") {
							result = JSON.stringify(value);
						} else {
							result = value;
						}

						const css = {
							_type: {
								color: lookup(state.tag.type),
							},
						};

						return (
							<Grid.Column key={ key }>
								<Grid.Row>
									<Header as="h5">{ key }</Header>
								</Grid.Row>

								<Grid.Row style={{
									paddingTop: 4,
									fontFamily: `monospace`,
								}}>
									<div style={ css[ key ] || {} }>{ result }</div>
								</Grid.Row>
							</Grid.Column>
						);
					})
				}
			</Grid>
			
			<Grid columns={ 1 } padded>
				<Grid.Column>
					{
						typeof state.tag._data === "object" ?
						Object.entries(state.tag._data || {}).map(([ key, value ], i) => {
							if(value == null) {
								return null;
							}

							let results = [];
							if(value instanceof $Tag) {
								results.push(
									<TagGridView key={ key } tag={ value } />
								);
							} else if(typeof value === "object") {
								results = JSON.stringify(value);
							} else {
								results = value;
							}

							return (
								<Grid.Row key={ key }>
									{ results }
								</Grid.Row>
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
		</Segment>
	);
}


{/* <Table celled color={ colors[ state.tag.type ] }>
	<Table.Header style={{
		fontFamily: "Lato",
	}}>
		<Table.Row>
			<Table.HeaderCell>Name</Table.HeaderCell>
			<Table.HeaderCell>Value</Table.HeaderCell>
		</Table.Row>
	</Table.Header>

	<Table.Body style={{
		fontFamily: "monospace",
	}}>
		{
			Object.entries(state.tag || {}).map(([ key, value ]) => {
				if(value == null) {
					return null;
				}

				let ret;
				if(typeof value === "object") {
					if(!Object.keys(JSON.parse(JSON.stringify(value))).length) {
						return null;
					}

					if(key === "data" || key === "_data") {
						let results = [];
						Object.values(value).forEach((entry, i) => {
							if(entry instanceof $Tag) {
								results.push(
									<Tag key={ i } tag={ entry } />
								);
							}
						});
							
						ret = results;
					} else {
						ret = JSON.stringify(value);
					}
				} else {
					ret = value;
				}

				return (
					<Table.Row key={ key }>
						<Table.Cell style={{
							fontStyle: "italic",
							fontFamily: "Lato",
							textAlign: "center",
						}}>{ key }</Table.Cell>
						<Table.Cell style={{
							backgroundColor: (key === "type" || key === "_type") ? lookup(state.tag.type) : null,
							color: (key === "type" || key === "_type") ? "white" : `#333`,
						}}>{ ret }</Table.Cell>
					</Table.Row>
				);
			})
		}
	</Table.Body>

	<Table.Footer>
		<Table.Row>
			<Table.HeaderCell colSpan="3">
				<Menu floated="right" pagination>
					<Menu.Item as="a" icon onClick={ e => handleEvent(e) }>
						<Icon name="plus" />
					</Menu.Item>
				</Menu>
			</Table.HeaderCell>
		</Table.Row>
	</Table.Footer>
</Table> */}

export default TagGridView;