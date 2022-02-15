import { WebSocketServer } from "ws";
import Node from "./../../../../src/lib/core/Node";

export class Server extends Node {
	static Namespace = trigger => `Websocket.Server:${ trigger }`;
	static EnumTriggers = {
		CLOSE: "close",
		CONNECTION: "connection",
		ERROR: "error",
		HEADERS: "headers",
		LISTENING: "listening",
	};

	constructor(wss, { namespace = Server.Namespace } = {}) {
		super({
			state: {
				server: wss,
			},
			config: {
				namespace,
			},
		});
	}

	create({ port, opts = {} } = {}) {
		this.state = {
			server: new WebSocketServer({
				port,
				...opts,
			}),
		};
	}

	bindEvents() {
		this.state.server.on(Server.EnumTriggers.LISTENING, () => this.invoke(this.config.namespace(Server.EnumTriggers.LISTENING)));

		this.state.server.on(Server.EnumTriggers.CONNECTION, (client) => {
			this.invoke(this.config.namespace(Server.EnumTriggers.CONNECTION), client);

			client.on()
		});
	}
}