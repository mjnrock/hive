
import React, { useState } from "react";

import Meta from "./Meta";
import Section from "./Section";

export function Form(props = {}) {
	const [ form, setForm ] = useState(props.form);

	/**
	 * << caller.element >> will be << undefined >> if
	 * 	the <Section> originated the invocation
	 */
	function handle(e, caller = {}) {
		console.log(caller);
	}

	return (
		<div className="b ba br2">
			<Meta meta={ form.meta } level="form" />

			{
				form.sections.map((section, i) => {
					return (
						<Section
							key={ i }
							section={ section }

							handler={ handle }
						/>
					);
				})
			}
		</div>
	);
};

export default Form;