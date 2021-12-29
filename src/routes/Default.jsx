import React from "react";
import { Header } from "semantic-ui-react";

import { Context } from "./../App";

import TagViewer from "./tag/viewer/Default";
import TagBuilder from "./tag/builder/Default";

export function Default() {
	return (
		<div>
			<Header as={ "h1" } textAlign="center">Builder</Header>
			<TagBuilder />

			{/* <Header as={ "h1" } textAlign="center">Viewer</Header>
			<TagViewer /> */}
		</div>
	);
}

export default Default;