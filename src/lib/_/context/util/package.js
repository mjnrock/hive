import Context from "../Context";

export default {
	Schema: {
		IsCompound(tag) {
			if(typeof tag === "object" && tag.type === Context.EnumType.COMPOUND) {
				return true;
			}
	
			return false;
		},
		IsString(tag) {
			if(typeof tag === "object" && tag.type === Context.EnumType.STRING) {
				return true;
			}
	
			return false;
		},
	},

	IsCompound(tag) {
		if(tag instanceof Context) {
			if(tag.type === Context.EnumType.COMPOUND) {
				return true;
			}
		}

		return false;
	},
	IsString(tag) {
		if(tag instanceof Context) {
			if(tag.type === Context.EnumType.STRING) {
				return true;
			}
		}

		return false;
	},
};