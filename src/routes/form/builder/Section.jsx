
import React, { useState } from "react";

import FormSection from "./../../../lib/form/Section";

import Element from "./Element";

export function Section(props = {}) {
	const [ section, setSection ] = useState(props.section);

	return (
		<div className="pa2 mt2">
			<div className="flex mb2 pa1">
				<button className="pa1 br2 bg-light-green black-80">Mode: <span className="b">Edit</span></button>
				<button className="ml2 pa1 br2 bg-light-red white-80">Delete Section</button>
			</div>

			<table className="w-100">
				<thead className="tl b black-60">
					<tr>
						<th className="bb b--black-20 tc" style={{ width: 25 }}>#</th>
						<th className="bb b--black-20">Name</th>
						<th className="bb b--black-20">Type</th>
					</tr>
				</thead>

				<tbody className="tl">
					{
						section.elements.map((e, i) => {
							if(e instanceof FormSection) {							
								return (
									<tr key={ i } className={ `tc br b--black-20 ${ i % 2 === 0 ? "bg-black-10" : "bg-white-80" }` }>
										<td className="tc br b--black-20">{ i }</td>
										<td colSpan={ 2 }>
											<Section section={ e } />
										</td>
									</tr>
								);
							}

							return (
								<tr key={ i } className={ `tc br b--black-20 ${ i % 2 === 0 ? "bg-black-10" : "bg-white-80" }` }>
									<td className="tc br b--black-20">{ i }</td>
									<td className="pl2">{ i + 1 }</td>
									<td className="pl2">{ i + 1 }</td>
								</tr>
							);
						})
					}

					<tr>
						<td colSpan={ 3 }>
							<div className="flex w-100 mt2 pa1">
								<button className="pa1 br2 bg-light-blue black-80">Add Row</button>
							</div>
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

export default Section;