const port = process.env.PORT || 5000;
const express = require("express");
const path = require("path");
const mysql = require("mysql");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const bodyParser = require("body-parser");
const dbDetails = require("./serverApp/config/db.config");
const netflixDB = require("./serverApp/models/netflixDB.model");
const registrationCt = require("./serverApp/controllers/reg.controller");
const profileModel = require("./serverApp/models/profile.model");

const corsOptions = {
	origin: "http://localhost:9000",
	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
const app = express();
const pool = mysql.createPool(dbDetails);
const salt = bcrypt.genSaltSync(10);

// Serve the static files from the React app
app.use(cors(corsOptions));
app.options("*", cors());
app.use(express.static(path.join(__dirname, "dist")));
app.use(bodyParser.json());
app.use(express.json());

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

app.get("/api/getshowstolike", (req, res) => {
	netflixDB.getShowToLike(pool, req).then(response => {
		res.json(response);
	});
});

app.post("/api/sendrating", (req, res) => {
	const queryInsert = `INSERT INTO user_likes (user_id, netflix_id, liked) VALUES ('${req.body.userId}', '${req.body.showId}', '${req.body.isLiked}')`;
	pool.query(queryInsert, (err, rows) => {
		if (err) {
			res.send({ err, isSuccess: false });
		} else {
			res.send({ isSuccess: true, rows });
		}
	});
});

app.post("/api/sendfriendrequest", (req, res) => {
	profileModel.sendFriendRequest(req, pool).then(response => {
		res.json(response);
	});
});

app.get("/api/getpendingrequests", (req, res) => {
	profileModel.getPendingRequets(req, pool).then(response => {
		res.json(response);
	});
});

app.post("/api/sendfrienddecision", (req, res) => {
	profileModel.sendFriendDecision(req, pool).then(response => {
		res.json(response);
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
		password: bcrypt.hashSync(req.body.password, salt),
		first_name: req.body.firstName,
		last_name: req.body.lastName
	};

	pool.query(
		`SELECT * FROM users WHERE username = '${credentialsCombo.username}'`,
		(error, returnedRows) => {
			let bool = false;
			if (error) {
				res.send(error);
			} else {
				bool = returnedRows.length === 0;
			}

			if (bool) {
				const queryStatement = registrationCt.createQuery(credentialsCombo);
				pool.query(queryStatement, (err, response) => {
					if (err) {
						res.send(err);
					} else {
						pool.query(
							`SELECT * FROM users WHERE id = '${response.insertId}' LIMIT 1`,
							(returnedError, registeredRow) => {
								if (returnedError) {
									res.send(returnedError);
								} else {
									res.send({ registationSuccess: true, registeredRow });
								}
							}
						);
					}
				});
			} else {
				res.send({ registationSuccess: false, message: "User already exists" });
			}
		}
	);
});

app.post("/api/checkpassword", cors(), (req, res) => {
	registrationCt.checkPassword(pool, req.body).then(response => {
		res.json(response);
	});
});

// Handles any requests that don't match the ones above
app.get("*", (req, res) => {
	res.sendFile(path.join(`${__dirname}/dist/index.html`));
});

app.listen(port, function() {
	console.log(`App is listening on port ${port}`);
});
