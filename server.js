const port = process.env.PORT || 5000;
const express = require("express");
const path = require("path");
const mysql = require("mysql");
const netflixDB = require("./expressFiles/netflixDB");

const app = express();
const dbDetails = {
	host: process.env.MYSQL_HOST,
	user: process.env.MYSQL_USER,
	password: process.env.MYSQL_PWD,
	database: process.env.MYSQL_DB
};
const pool = mysql.createPool(dbDetails);

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "dist")));

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

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
	res.sendFile(path.join(`${__dirname}/dist/index.html`));
});

app.listen(port, function() {
	console.log(`App is listening on port ${port}`);
});
