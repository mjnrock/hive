import Section from "./Section";

export class Form {
	constructor(sections = [], { meta = {} } = {}) {
		this.meta = meta;
		this.sections = sections;
	}

	get sections() {
		return this._sections;
	}
	set sections(inputs = []) {
		const sections = [];
		for(let input of inputs) {
			if(input instanceof Section) {
				sections.push(input);
			}
		}

		this._sections = sections;
	}

	static Conforms(obj) {
		return "sections" in obj;
	}
	static FromSchema(obj = {}) {
		if("sections" in obj) {
			const sections = [];
			for(let section of obj.sections) {
				if(Section.Conforms(section)) {
					sections.push(Section.FromSchema(section));
				}
			}

			return new Form(sections, { meta: obj.meta });
		}

		return new Form();
	}
};

export default Form;