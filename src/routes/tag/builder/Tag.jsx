import React, { useEffect, useState } from "react";
import { Segment, Icon, Menu, Table } from "semantic-ui-react";

import $Util from "./../../../lib/util/package";
import $Tag from "./../../../lib/tag/Tag";
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

export function Tag({ tag } = {}) {
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

	return (
		<Segment basic={true}>
			<Table celled color={ colors[ state.tag.type ] }>
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
							let ret;
							if(typeof value === "object") {
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
			</Table>
		</Segment>
	);
}
