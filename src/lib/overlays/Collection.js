//TODO Have all Overlays go into a named-scope for each respective attribute (e.g. @node.state.Collection.entries)
//TODO Create a "smart selector" on Node for overlays so that overlay name doesn't have to be explicitly used (e.g. @node.state.$$.entries)
export const Collection = node => ({
	state: {
		schema: null,
		entries: [],
	},
	// nodes: {},
	events: [
		"entry",
		"removal",
		"update",
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
				return node.state.entries.slice(node.state.entries.length, -rows);
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
	},
});

export default Collection;