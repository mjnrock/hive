import Component from "./core/ecs/Component";

export class WebSocketClient extends Component {
	static System;

	constructor(parent, { connection, middleware = {}, config = {}, ...opts } = {}) {
		super(parent, { config, ...opts });

		this.connection = connection;
		this.middleware = {
			pack: null,
			unpack: null,
			...middleware,
		};
	}

	static Has(comp) {
		return comp instanceof WebSocketClient
			|| (
				"connection" in comp
				&& "middleware" in comp
			);
	}
	
	dispatch(action, ...args) {
		WebSocketClient.System.$.invoke(action, this, ...args);

		if(this.config.dispatchToParent === true) {
			this.parent.invoke(action, this, ...args);
		}
	}
	
	useNodeBuffer() {
		this.connection.binaryType = "nodebuffer";
	}
	useArrayBuffer() {
		this.connection.binaryType = "arraybuffer";
	}
	useFragments() {
		this.connection.binaryType = "fragments";
	}

	isConnecting() {
		return this.connection.readyState === 0;
	}
	isConnected() {
		return this.connection.readyState === 1;
	}
	isClosing() {
		return this.connection.readyState === 2;
	}
	isClosed() {
		return this.connection.readyState === 3;
	}

	static Create(fnOrObj = {}) {
		let args;
		if(typeof fnOrObj === "function") {
			args = fnOrObj();
		} else {
			args = fnOrObj
		}

		return new this(args);
	}
};

export default WebSocketClient;