export class Tag {
	constructor(type, data, meta = {}) {
		this.type = type;
		this.data = data;
		this.meta = meta;
	}
};

export default Tag;