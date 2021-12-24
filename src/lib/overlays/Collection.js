import Proposition from "../util/logic/Proposition";

//TODO Have all Overlays go into a named-scope for each respective attribute (e.g. @node.state.Collection.entries)
//TODO Create a "smart selector" on Node for overlays so that overlay name doesn't have to be explicitly used (e.g. @node.state.$$.entries)

/**
 * This is a base-level class for when a Node is to be used
 * 	as an optionally-typed recordset repository for some data
 */
export const Collection = node => ({
	$iterator(node, overlay) {
		node[ Symbol.iterator ] = function() {
			var index = -1;
			var data = Object.values(node.state.entries);
	
			return {
				next: () => ({ value: data[ ++index ], done: !(index in data) })
			};
		}
	},

	state: {
		schema: null,
		entries: [],
	},
	// nodes: {},
	events: [
		"addEntry",
		"removeEntry",
	],
	// subscriptions: [],
	// meta: {},
	config: {
		isReadOnly: false,
	},
	actions: {
		setSchema(schema) {
			node.state.schema = schema;

			return node;
		},

		addEntry(...entries) {
			for(let entry of entries) {
				//TODO	Convert from pseudocode
				// if(node.state.schema.Conforms(entry)) {
				// 	node.state.entries.push(entry);
				// }
				node.state.entries.push(entry);
			}

			return node;
		},
		removeEntry(...entries) {
			node.state.entries = node.state.entries.filter(record => !entries.includes(record));

			return node;
		},
		removeEntryByIndex(...indexes) {
			for(let index of indexes) {
				delete node.state.entries[ index ];
			}

			return node;
		},

		head(rows = 1) {
			try {
				return node.state.entries.slice(0, rows);
			} catch(e) {
				return false;
			}
		},
		tail(rows = 1) {
			try {
				return node.state.entries.slice(node.state.entries.length - rows, node.state.entries.length);
			} catch(e) {
				return false;
			}
		},
		at(index = 0) {
			try {
				return node.state.entries[ index ];
			} catch(e) {
				return false;
			}
		},
		bt(start, end) {
			try {
				return node.state.entries.slice(start, end);
			} catch(e) {
				return false;
			}
		},
		/**
		 * @resultFlag:	0 - Entry, 1 - Index, 2 - [ Entry, Index ]
		 */
		where(condition, resultFlag = 0) {
			let results = [];
			for(let i = 0; i < node.state.entries.length; i++) {
				let entry = node.state.entries[ i ];

				if(condition instanceof Proposition ? condition.test(entry) : condition(entry)) {
					if(resultFlag === 0) {
						results.push(entry);
					} else if(resultFlag === 1) {
						results.push(i);
					} else if(resultFlag === 2) {
						results.push([ i, entry ]);
					}
				}
			}

			return results;
		},
	},
});

export default Collection;