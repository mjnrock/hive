import Node from "../node/Node";

/**
 * Any <Node> that acts as a @handler will receive a
 * 	"route" trigger invocation whenever << Router.route >>
 * 	is called.  As such, the handler-Node should have a
 * 	"route" handler within its event base.
 */

export const fnDefaultRoute = () => true;

export const Router = target => ({
	// state: {
	// 	routes: [],
	// },
	// nodes: {},
	triggers: {
	},
	// subscriptions: [],
	// meta: {},
	config: {
	},
	actions: {
	},
});

export default Router;