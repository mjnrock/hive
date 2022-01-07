import Controller from "../event/Controller";

import Tags from "../tag/package";

export const overlay = {
	state: () => new Tags.Compound(),
	handlers: {
		ADD_TAG: ([ state ], type, alias, ...args) => {
			if(type instanceof Tags.Tag) {
				state.addTag(type);

				return type;
			} else {
				const clazz = Tags.getClass(type);
				const tag = new clazz(alias, ...args)
				
				if(tag instanceof Tags.Tag) {
					state.addTag(tag);
				}

				return tag;
			}
		},
		REMOVE_TAG: ([ state ], tag) => {
			if(tag instanceof Tags.Tag) {
				state.removeTag(tag);
			}
		},
		GET_TAG: ([ state ], id) => {
			return state.getTagById(id);
		},
		SET_TAG_DATA: ([ state ], id, data, isArray) => {
			return state.setTagDataById(id, data, isArray);
		},
		SWAP_TAGS: ([ state ], tag1, tag2) => {
			return state.swapTags(tag1, tag2);
		},
	},
	hooks: {
		// pre: (...args) => console.log("PRE:", ...args),
		// post: (...args) => console.log("POST:", ...args),
		// reducer: (result, state) => {
		// 	state.addTag(Tags.Uint8.Create(Math.random().toString(), Dice.random(0, 255)));

		// 	return state;
		// },
	}
};

export const evaluator = () => Object.fromEntries(Object.entries(overlay).map(([ key, value ]) => {
	if(typeof value === "function") {
		return [ key, value() ];
	}

	return [ key, value ];
}));

export const factory = (qty = 1) => {
	let results = [];
	
	for(let i = 0; i < qty; i++) {
		results.push(new Controller(evaluator()));
	}

	if(qty === 1) {
		return results[ 0 ];
	}

	return results;
};

export default factory;