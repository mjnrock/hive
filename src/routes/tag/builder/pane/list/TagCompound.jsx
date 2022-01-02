import React, { useEffect, useState } from "react";
import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/solid";

import Tag from "./Tag";
import $Tag from "./../../../../../lib/tag/Tag";

export function TagCompound({ tag } = {}) {
	const [ isExpanded, setIsExpanded ] = useState(false);

	if(tag.type !== $Tag.Types.Compound) {
		return null;
	}

	return (
		<div className="flex-col">
			<div className="flex mb-2 hover:bg-gray-400 hover:text-white cursor-pointer select-none" onClick={ e => setIsExpanded(!isExpanded) }>
				{
					isExpanded ? (
						<ChevronDownIcon className="mt-1 h-4 w-4" />
					) : (
						<ChevronRightIcon className="mt-1 h-4 w-4" />
					)
				}
				
				<div className="ml-1 font-bold">
					{ tag.alias }
				</div>
			</div>

			{
				isExpanded ? (
					<div className="ml-4">
						{
							tag.data.map(t => {
								if(t.type === $Tag.Types.Compound) {
									return (
										<div className="flex flex-col">
											<TagCompound tag={ t } />
										</div>
									);
								}
		
								return (
									<div>
										<Tag tag={ t } />
									</div>
								);
							})
						}
					</div>
				) : null
			}
		</div>
	);
}
export default TagCompound;