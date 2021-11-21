export class Element {
	constructor(data) {
		this.data = data;
	}

	static Conforms(obj) {
		return "data" in obj;
	}
	static FromSchema(obj = {}) {
		return new Element(obj);
	}
};

export default Element;