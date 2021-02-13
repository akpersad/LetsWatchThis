const express = require("express");
const path = require("path");
const mysql = require("mysql");

const app = express();
const dbDetails = {
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PWD,
	database: process.env.MYSQL_DB
};

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "dist")));

const pool = mysql.createPool(dbDetails);
const con = mysql.createConnection(dbDetails);

// An api endpoint that returns a short list of items
app.get("/api/getList", (req, res) => {
	const list = ["item1", "item2", "item3"];
	res.json(list);
	console.log("Sent list of items");
});

app.get("/api/shows", (req, res) => {
	const limit = req.query.limit || 100;
	console.log("🚀 ~ file: server.js ~ line 28 ~ app.get ~ limit", limit);

	pool.query(`SELECT * FROM netflix_shows LIMIT ${limit}`, (err, rows) => {
		if (err) {
			res.send(err);
		} else {
			res.send(rows);
		}
	});
});

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
	res.sendFile(path.join(`${__dirname}/dist/index.html`));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log(`App is listening on port ${port}`);
