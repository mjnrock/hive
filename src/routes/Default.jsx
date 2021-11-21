import React from "react";

import { Context } from "./../App";

import Form from "./../lib/form/Form";
import Section from "../lib/form/Section";
import Element from "../lib/form/Element";
import RenderForm from "./form/viewer/Form";
import BuilderForm from "./form/builder/Form";

import FormTest from "./../data/FormTest";
console.log(Form.FromSchema(FormTest))

export function Default() {
	return (
		<div style={{ fontFamily: "monospace" }}>
			{/* <RenderForm form={ Form.FromSchema(FormTest) } /> */}
			<BuilderForm form={ Form.FromSchema(FormTest) } />
		</div>
	);
}

export default Default;