import React from "react";


import { Context } from "../../../App";
import { ThrowError, ErrorTypes as ErrorType } from "../../../lib/tag/Errors";

import Tags from "../../../lib/tag/package";

export function Default() {
	const tag = new Tags.Uint8(100, {});
	const tag2 = new Tags.String(`This is a test string`, {});
	const ctag = new Tags.Compound([
		tag,
		tag2,
	], {});

	return (
		<div style={{ fontFamily: "monospace" }}>
			<div className="f3 ma2 pa1 b black-80">Test Context</div>
			<pre className="ma2 pa1 ba br2 b--black-10 bg-black-10 shadow-4 black-80">
			{
				JSON.stringify(tag, null, 2)
			}
			</pre>
			<pre className="ma2 pa1 ba br2 b--black-10 bg-black-10 shadow-4 black-80">
			{
				JSON.stringify(tag2, null, 2)
			}
			</pre>
			<pre className="ma2 pa1 ba br2 b--black-10 bg-black-10 shadow-4 black-80">
			{
				JSON.stringify(ctag, null, 2)
			}
			</pre>
		</div>
	);
}

export default Default;