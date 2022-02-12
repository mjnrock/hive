import { WebSocketServer } from "ws";
import Signal from "../../core/Signal";
import Node from "./../../core/Node";

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
		this.state.server.on(Server.EnumTriggers.LISTENING, () => {
			this.invoke(this.state.namespace(Server.EnumTriggers.LISTENING), Signal.Create({
				emitter: this,
				data: client,
			}));
		});

		this.state.server.on(Server.EnumTriggers.CONNECTION, (client) => {
			this.invoke(this.state.namespace(Server.EnumTriggers.CONNECTION), Signal.Create({
				emitter: this,
				data: client,
			}));

			client.on()
		});
	}
}