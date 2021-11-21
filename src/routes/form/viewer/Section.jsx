
import React, { useState } from "react";

import FormSection from "./../../../lib/form/Section";

import Meta from "./Meta";
import Element from "./Element";

export function Section(props = {}) {
	const [ section, setSection ] = useState(props.section);

	function bubble(e, element) {
		if(typeof props.handler === "function") {
			//TODO	Maintain a set for { section } for nested sections
			props.handler(e, { section, element });
		}
	}

	return (
		<div className="b ba br2 ma3 pa2" onClick={ bubble }>
			<Meta meta={ section.meta } level="section" />

			<ul>
				{
					section.elements.map((element, i) => {
						if(element instanceof FormSection) {
							return (
								<li key={ i }>
									<Section
										section={ element }	
										handler={ bubble }
									/>
								</li>
							);
						}

						return (
							<li key={ i }>
								<Element
									element={ element }

									handler={ bubble }
								/>
							</li>
						);
					})
				}
			</ul>
		</div>
	);
};

export default Section;