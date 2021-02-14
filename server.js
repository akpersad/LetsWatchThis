const port = process.env.PORT || 5000;
const express = require("express");
const path = require("path");
const mysql = require("mysql");
const netflixDB = require("./expressFiles/netflixDB");
const dbDetails = require("./serverApp/config/db.config");
const db = require("./serverApp/models");

const Role = db.role;
const app = express();
const pool = mysql.createPool(dbDetails);
const initial = () => {
	Role.create({
		id: 1,
		name: "user"
	});

	Role.create({
		id: 2,
		name: "moderator"
	});

	Role.create({
		id: 3,
		name: "admin"
	});
};

require("./serverApp/routes/auth.routes")(app);
require("./serverApp/routes/user.routes")(app);

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

db.sequelize.sync({ force: true }).then(() => {
	console.log("Drop and Resync Db");
	initial();
});
