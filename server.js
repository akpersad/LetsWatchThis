const port = process.env.PORT || 5000;
const express = require("express");
const path = require("path");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const dbDetails = require("./serverApp/config/db.config");
const netflixDB = require("./serverApp/models/netflixDB.model");
const registrationCt = require("./serverApp/controllers/reg.controller");

const app = express();
const pool = mysql.createPool(dbDetails);
const salt = bcrypt.genSaltSync(10);

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "dist")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// An api endpoint that returns a short list of items
app.get("/api/getList", (req, res) => {
	const list = ["item1", "item2", "item3"];
	res.json(list);
	console.log("Sent list of items");
});

app.get("/api/shows", (req, res) => {
	const queryStatement = netflixDB.createQuery(req);
	pool.query(queryStatement, (err, rows) => {
		if (err) {
			res.send(err);
		} else {
			res.send(rows);
		}
	});
});

app.get("/api/test", (req, res) => {
	const hash = bcrypt.hashSync("Andrew Is Cool", salt);
	console.log("🚀 ~ file: server.js ~ line 64 ~ app.listen ~ hash", hash);

	bcrypt.compare("Andrew Is Cool", hash).then(resp => {
		console.log("🚀 ~ file: server.js ~ line 66 ~ bcrypt.compare ~ resp", resp);
		res.send(resp);
	});
});

app.post("/api/registration", (req, res) => {
	const credentialsCombo = {
		username: req.body.username,
		password: bcrypt.hashSync(req.body.password, salt)
	};
	const queryStatement = registrationCt.createQuery(credentialsCombo);
	pool.query(queryStatement, (err, rows) => {
		if (err) {
			res.send(err);
		} else {
			res.send(rows);
		}
	});
});

app.post("/api/checkpassword", (req, res) => {
	registrationCt.checkPassword(pool, req.body).then(response => {
		res.send({ response });
	});
});

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
	res.sendFile(path.join(`${__dirname}/dist/index.html`));
});

app.listen(port, function() {
	console.log(`App is listening on port ${port}`);
});

// https://bezkoder.com/node-js-jwt-authentication-mysql/
// db.sequelize.sync({ force: true }).then(() => {
// 	console.log("Drop and Resync Db");
// 	initial();
// });
