import React from "react";

export function Meta({ meta = {}, level = "element" } = {}) {
	const elements = [];

	if(meta.name) {
		if(level === "form") {
			elements.push(<h1 className="tc text-bold">{ meta.name }</h1>);
		} else if(level === "section") {
			elements.push(<h2 className="text-bold">{ meta.name }</h2>);
		} else if(level === "element") {

		}
	}

	if(meta.description) {
		elements.push(<textarea className="w-100 h3 no-resize ml2" defaultValue={ meta.description } readOnly={ true }/>);
	}

	return elements.map((e, i) => React.cloneElement(e, { key: i, ...e.props }));
};

export default Meta;