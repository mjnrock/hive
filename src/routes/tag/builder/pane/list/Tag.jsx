import React from "react";

export function Tag({ tag } = {}) {
	return (
		<div className="flex mb-2 select-none">			
			<div className="ml-1">
				<span className="font-bold">{ tag.alias }</span>&nbsp;<span className="text-xs font-mono">{ tag.type }</span>
			</div>
		</div>
	);
}
export default Tag;