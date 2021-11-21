import Element from "./Element";

export class Section {
	constructor(elements = [], { meta = {} } = {}) {
		this.meta = meta;
		this.elements = elements;
	}

	get elements() {
		return this._elements;
	}
	set elements(inputs = []) {
		const elements = [];
		for(let input of inputs) {
			if(input instanceof Section) {
				elements.push(input);
			} else if(input instanceof Element) {
				elements.push(input);
			}
		}

		this._elements = elements;
	}

	static Conforms(obj) {
		return "elements" in obj;
	}
	static FromSchema(obj = {}) {
		if("elements" in obj) {
			const elements = [];
			for(let element of obj.elements) {
				// if(Element.Conforms(element)) {
				// 	elements.push(Element.FromSchema(element));
				// }

				elements.push(new Element(element));
			}

			return new Section(elements, { meta: obj.meta });
		}

		return new Section();
	}
};

export default Section;