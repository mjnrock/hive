import React, { useState } from "react";

export function Element(props = {}) {
	const [ element, setElement ] = useState(props.element);
	
	return (
		<div className="ba br2 ma1">
			
		</div>
	);
};

export default Element;