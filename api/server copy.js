import { lookup } from "dns";
import { hostname } from "os";
import express from "express";
import expressWs from "express-ws";
import Agency from "@lespantsfancy/agency";
import WSS from "@lespantsfancy/agency/lib/modules/websocket/Server";
import QRCode from "@lespantsfancy/agency/lib/modules/qrcode/QRCode";
import MongoDB from "mongodb";

const uri = `mongodb://localhost:27017`;
let mongodb;
MongoDB.MongoClient.connect(uri, { poolSize: 10, useNewUrlParser: true, useUnifiedTopology: true }, (err, db) => mongodb = db);

console.clear();
console.warn("------------ NEW EXECUTION CONTEXT ------------");

const app = express();
const httpport = 3000;
const wsport = 3001;

const wss = WSS.QuickSetup(expressWs(app), {
	[ WSS.Signal.CONNECTION ]: (msg, { broadcast }) => {
		broadcast("bounce", Date.now());
	},
});

const mongonet = new Agency.Event.Network({}, {
	default: {
		player(msg, { upsert, find }) {
			// find(`players`, { timestamp: { $gt: 0 }}).then(a => console.log(a));

			upsert(`players`, {
				timestamp: 0,
			}, {
				timestamp: Date.now(),
			});
		},
		$globals: {
			mongo: (commands = [], database = "drug-wars") => {
				if(!Array.isArray(commands)) {
					commands = [ commands ];
				}

				return new Promise((resolve) => {
					let results = [];
					mongodb.connect(err => {
						const db = mongodb.db(database);

						for(let command of commands) {
							results.push(command(db, mongodb));
						}

						resolve(results);
					});
				});
			},
			upsert: (collection, filter, update, { isMany = false, database = "drug-wars", ...opts } = {}) => {
				return new Promise((resolve) => {
					mongodb.connect(err => {
						const db = mongodb.db(database);
						const coll = db.collection(collection);

						let fn = isMany ? "updateMany" : "updateOne";
						resolve(coll[ fn ](filter, {
							$set: update,
						}, {
							upsert: true,
							...opts,
						}));
					});
				});
			},
			find: (collection, query, { projection, database = "drug-wars" } = {}) => {
				return new Promise((resolve) => {
					mongodb.connect(err => {
						const db = mongodb.db(database);
						const coll = db.collection(collection);

						coll.find(query, projection).toArray((err, result) => {
							resolve(result);
						});
					});
				});
			}
		},
	},
});

const mainnet = new Agency.Event.Network({}, {
	default: {
		"*": (msg) => console.log(`[Pre]:`, msg.type, msg.data),
	},
});

wss.addListener(mainnet, { addToDefaultGlobal: "wss" });
mongonet.addListener(mainnet, { addToDefaultGlobal: "mongonet" });

/**
 * This is a newer way to do the work commonly seen with `bodyParser`
 */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());

/**
 * This activates CORS
 */
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    //? Whatever middleware work .next() is doing is ESSENTIAL to actually making this work
    return next();
});
    
/**
 * A basic middleware example
 */
app.use(function (req, res, next) {
    console.log("middleware");
    req.testing = "testing";

    return next();
});

/**
 * A basic routing example
 */
app.get("/", function(req, res, next){
    res.send('Hello World!')
    res.end();
});

/**
 * Start the server
 */
app.listen(wsport, () => {
    console.log(`WebSocket server is listening on port ${ wsport }!`);    
    
    lookup(hostname(), (err, ip) => {
		const url = `http://${ ip }:${ httpport }`;

        QRCode.Generator.toString(url, { type: "terminal" }).then(data => {
            console.log(`Link to:   ${ url }`);
            console.log(data);
        });
    });
});