import React from "react";

import { Context } from "./../App";

import Tags from "./../lib/tags/package";

export function Default() {
	const tag = new Tags.Tag("byte", 1234, {
		hasMeta: true,
	});

	return (
		<div style={{ fontFamily: "monospace" }}>
			<div className="f1 tc">Tag Sandbox</div>
			<hr />

			<div className="f3 ma2 pa1 b black-80">Test Tag</div>
			<pre className="ma2 pa1 ba br2 b--black-10 bg-black-10 shadow-4 black-80">
			{
				JSON.stringify(tag, null, 2)	
			}
			</pre>
		</div>
	);
}

export default Default;