const bcrypt = require("bcryptjs");

const dbName = "users";

const createQuery = request => {
	const fullStatement = `INSERT INTO ${dbName} (username, password) VALUES ('${request.username}', '${request.password}')`;
	return fullStatement;
};

const checkPassword = (pool, combo) => {
	console.log("🚀 ~ file: reg.controller.js ~ line 11 ~ checkPassword ~ combo", combo);
	return new Promise((resolve, reject) => {
		console.log("🚀 ~ file: reg.controller.js ~ line 13 ~ returnnewPromise ~ combo", combo);
		const queryStatement = `SELECT * FROM ${dbName} WHERE username = '${combo.username}' LIMIT 1`;
		console.log(
			"🚀 ~ file: reg.controller.js ~ line 13 ~ returnnewPromise ~ queryStatement",
			queryStatement
		);

		pool.query(queryStatement, (err, rows) => {
			if (err) {
				reject(err);
			}

			bcrypt.compare(combo.password, rows[0].password).then(resp => {
				console.log("🚀 ~ file: reg.controller.js ~ line 21 ~ bcrypt.compare ~ resp", resp);
				resolve(resp);
			});

			return true;
		});
	});
};

module.exports = { createQuery, checkPassword };
