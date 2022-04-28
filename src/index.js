import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import FactoryWebSocket from "./lib/components/FactoryWebSocket";
import EntityWebSocket from "./lib/components/EntityWebSocket";

FactoryWebSocket.Instance = new FactoryWebSocket([ 
	[
		[ `test`, [
			(...args) => console.log(true, true, true, ...args),
		]],
	], {
		state: {},
	},
]);

//TODO There is a tremendous amount to unpack and cleanup here -- figure out the next ECS suite paradigm
const testEntity = new EntityWebSocket({
	WebSocket: {
		args: [ {
			connection: 1234,
			middleware: {
				pack: 432,
				unpack: 8907,
			},
		} ],
		tags: [ `cat` ],
	},
});
console.log(testEntity.websocket.$(`test`, 1, 2, 3));
console.log(testEntity.find("websocket"));
console.log(testEntity.find("cat", true));

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById("root"),
);
