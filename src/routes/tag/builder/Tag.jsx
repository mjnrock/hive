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
}

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
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell>Name</Table.HeaderCell>
						<Table.HeaderCell>Value</Table.HeaderCell>
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{
						Object.entries(state.tag || {}).map(([ key, value ]) => {
							if(key === "data" || key === "_data") {
								if(typeof value === "object") {
									let results = [];
									Object.values(value).forEach((entry, i) => {
										if(entry instanceof $Tag) {
											results.push(
												<Tag key={ i } tag={ entry } />
											);
										}
									});
										
									return (
										<Table.Row key={ key }>
											<Table.Cell>{ key }</Table.Cell>
											<Table.Cell>
												{
													results
												}
											</Table.Cell>
										</Table.Row>
									);
								}
							}

							return (
								<Table.Row key={ key }>
									<Table.Cell>{ key }</Table.Cell>
									<Table.Cell>{ JSON.stringify(value) }</Table.Cell>
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
