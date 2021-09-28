import express from "express";
import expressWs from "express-ws";

console.clear();
console.warn("------------ NEW EXECUTION CONTEXT ------------");

const app = express();
const httpport = 3000;
const wsport = 3001;

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
});