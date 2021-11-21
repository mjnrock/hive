import Tag from "../Tag";

export default {
	Schema: {
		IsCompound(tag) {
			if(typeof tag === "object" && tag.type === Tag.EnumType.COMPOUND) {
				return true;
			}
	
			return false;
		},
		IsString(tag) {
			if(typeof tag === "object" && tag.type === Tag.EnumType.STRING) {
				return true;
			}
	
			return false;
		},
	},

	IsCompound(tag) {
		if(tag instanceof Tag) {
			if(tag.type === Tag.EnumType.COMPOUND) {
				return true;
			}
		}

		return false;
	},
	IsString(tag) {
		if(tag instanceof Tag) {
			if(tag.type === Tag.EnumType.STRING) {
				return true;
			}
		}

		return false;
	},
};