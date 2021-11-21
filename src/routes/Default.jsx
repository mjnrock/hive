import React from "react";

import { Context } from "./../App";

import Form from "./../lib/form/Form";
import Section from "../lib/form/Section";
import Element from "../lib/form/Element";
import RenderForm from "./form/viewer/Form";

const FormTest = {
	sections: [
		{
			elements: [
				`This is some data`,
				`This is some data, too`,
			],
			meta: {
				id: 12345,
				name: `Test Section`
			},
		}
	],
	meta: {
		id: 12345,
		name: `Test Form`
	},
};
console.log(Form.FromSchema(FormTest))

export function Default() {
	return (
		<div style={{ fontFamily: "monospace" }}>
			<RenderForm
				form={ Form.FromSchema(FormTest) }
				// form={
				// 	new Form([
				// 		new Section([
				// 			new Element(`This is some data`),
				// 			new Element(`This is some data, too`),
				// 		], {
				// 			meta: {
				// 				id: 12345,
				// 				name: `Test Section`
				// 			},
				// 		})
				// 	], {
				// 		meta: {
				// 			id: 12345,
				// 			name: `Test Form`
				// 		},
				// 	})
				// }
			/>
		</div>
	);
}

export default Default;