import Node from "./../node/Node";

export const Subscribable = node => ({
	// state: {},
	// nodes: {},
	events: [ "receive", "subscribe", "unsubscribe" ],
	// events: {
	// 	receive: new Set(),
	// 	subscribe: new Set(),
	// 	unsubscribe: new Set(),
	// },
	// subscriptions: new Set(),
	// meta: {},
	// config: {},
	actions: {
		addSubscriber(subscribers = [], twoWay = false) {
			if(!Array.isArray(subscribers)) {
				subscribers = [ subscribers ];
			}
			
			let newSubscribers = [];
			for(let subscriber of subscribers) {
				if(subscriber instanceof Node || typeof subscriber === "function") {
					node.subscriptions.add(subscriber);

					if(twoWay && subscriber instanceof Node) {
						subscriber.subscriptions.add(node);
					}

					newSubscribers.push(subscriber);
				}
			}
			
			if(newSubscribers.length) {
				node.actions.invoke("subscribe", newSubscribers);
			}

			return node;
		},
		removeSubscriber(subscribers = [], twoWay = false) {
			if(!Array.isArray(subscribers)) {
				subscribers = [ subscribers ];
			}
			
			let unsubscribers = [];
			for(let subscriber of subscribers) {
				let result = node.subscriptions.delete(subscriber);

				if(twoWay && subscriber instanceof Node) {
					subscriber.subscriptions.delete(node);
				}

				if(result) {
					unsubscribers.push(subscriber);
				}

				unsubscribers.push(subscriber);
			}

			if(unsubscribers.length) {
				node.actions.invoke("unsubscribe", unsubscribers);
			}

			return node;
		},
		receive(emitter, ...args) {
			node.actions.invoke("receive", emitter, ...args);

			return node;
		},
		broadcast(...args) {
			for(let subscriber of node.subscriptions) {
				if(subscriber instanceof Node) {
					subscriber.actions.receive(node, ...args);
				} else if(typeof subscriber === "function") {
					subscriber(node, ...args);
				}
			}

			return node;
		},
	},
});

export default Subscribable;