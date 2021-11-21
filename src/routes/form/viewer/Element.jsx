import React, { useState } from "react";

export function Element(props = {}) {
	const [ element, setElement ] = useState(props.element);

	function bubble(e) {
		if(typeof props.handler === "function") {
			props.handler(e, element);
		}
	}
	
	return (
		<div className="b ba br2 ma1" onClick={ bubble }>
			{
				JSON.stringify(element.data, null, 2)
			}
		</div>
	);
};

export default Element;