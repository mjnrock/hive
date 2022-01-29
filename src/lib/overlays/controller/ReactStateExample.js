import Node from "../../node/Node";

export const ReactContext = target => ({
	state: () => {},
	triggers: {
		PERFORM_UPDATE: () => (newState = {}) => {
			target.actions.invoke("update", newState);
		},
	},
});

export default ReactContext;