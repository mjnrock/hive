import React from "react";

import { Context } from "./../App";

import TagViewer from "./tag/viewer/Default";
import TagBuilder from "./tag/builder/Default";
import { Header } from "semantic-ui-react";

export function Default() {
	return (
		<div style={{ fontFamily: "monospace" }}>
			<Header as={ "h1" } textAlign="center">Builder</Header>
			<TagBuilder />

			{/* <Header as={ "h1" } textAlign="center">Viewer</Header>
			<TagViewer /> */}
		</div>
	);
}

export default Default;