import Node from "../../node/Node";

import Tags from "../../tag/package";

/**
 * As the construction demonstrates, a Controller is a specific
 * Overlay that functions as an eventable state machine.  Thus,
 * the seed function for .state below will generate the default
 * state, while the triggers, when invoked, will act as paradigmatic
 * Redux reducers
 */
export const Tag = target => ({
	state: () => new Tags.Compound(),
	triggers: {
		ADD_TAG: () => (type, alias, ...args) => {
			if(type instanceof Tags.Tag) {
				target.state.addTag(type);

				return type;
			} else {
				const clazz = Tags.getClass(type);
				const tag = new clazz(alias, ...args)
				
				if(tag instanceof Tags.Tag) {
					target.state.addTag(tag);
				}

				return tag;
			}
		},
		REMOVE_TAG: () => (tag) => {
			if(tag instanceof Tags.Tag) {
				return target.state.removeTag(tag);
			}

			return false;
		},
		GET_TAG: () => (id) => {
			return target.state.getTagById(id);
		},
		SET_TAG_DATA: () => (id, data, isArray) => {
			return target.state.setTagDataById(id, data, isArray);
		},
		SWAP_TAGS: () => (tag1, tag2) => {
			return target.state.swapTags(tag1, tag2);
		},
	},
});

export default Tag;