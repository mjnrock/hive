import { WebSocketServer } from "ws";
import Node from "./../../core/Node";

export class Server extends Node {
	static Namespace = "Websocket.Server";
	static EnumTriggers = {
		CLOSE: "close",
		ERROR: "error",
		MESSAGE: "message",
		MESSAGE_ERROR: "message_error",
		OPEN: "open",
		PING: "ping",
		PONG: "pong",
		UNEXPECTED_RESPONSE: "unexpected_response",
		UPGRADE: "upgrade",
	};

	constructor(wss) {
		super({
			state: {
				server: wss,
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
		this.state.server.on
	}
}