import express from "express";
import mongoose from "mongoose";

const APP = express();
const PORT = 3001;
const DATABASE = "sandbox";
const MONGO_URI = `mongodb://localhost/`;

mongoose.Promise = global.Promise;
mongoose.connect(MONGO_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true
});

// STUB
console.log(process.env.TEST_ENV_VAR);


//? Mongoose example code
const personSchema = new mongoose.Schema({
	firstName: {
		type: String,
	},
	lastName: {
		type: String,
	},
	age: {
		type: Number,
	},
});
const People = mongoose.model("people", personSchema);


/**
 * This is a newer way to do the work commonly seen with `bodyParser`
 */
APP.use(express.urlencoded({ extended: true }));
APP.use(express.json());
APP.use(express.raw());

/**
 * This activates CORS
 */
APP.use((req, res, next) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept",
	);
	
	next();
});

/**
 * This causes the `express` library to invoke a server on port=@PORT, with a console.log callback
 */
APP.listen(PORT, () => console.log(`DMT app listening on port ${PORT}!`));
