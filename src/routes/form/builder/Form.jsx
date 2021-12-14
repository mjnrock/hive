import React, { useState } from "react";
import { Form as SUIForm, Input, TextArea } from "semantic-ui-react";

import Section from "./Section";

export function Form(props = {}) {
	const [ form, setForm ] = useState(props.form);

	return (
		<div className="ba br2">
			<Input loading icon="user" iconPosition="left" placeholder="Search..." />

			<div className="flex flex-column ma2">
				<div className="f7 b">Form Title</div>
				{/* <input className="h2 pa2 b ba br2" type="text" /> */}
				<Input type="text" />
			</div>

			<div className="flex flex-column ma2">
				<div className="f7 b">Form Description</div>
				<SUIForm>
					<TextArea className="no-resize" />
				</SUIForm>
			</div>

			<div className="ma2">
				{
					form.sections.map((section, i) => {
						return (
							<Section
								key={ i }
								section={ section }
							/>
						);
					})
				}
			</div>
		</div>
	);
};

export default Form;