const bcrypt = require("bcryptjs");

const createQuery = request => {
	const dbName = "users";
	const fullStatement = `INSERT INTO ${dbName} (username, password) VALUES ('${request.username}', '${request.password}')`;

	console.log("🚀 ~ file: netflixDB.js ~ line 6 ~ fullStatement", fullStatement);

	return fullStatement;
};

const checkPassword = (pool, combo) => {
	return new Promise(resolve => {
		const queryStatement = `SELECT * FROM users WHERE username = '${combo.username}' LIMIT 1`;
		pool.query(queryStatement, (err, rows) => {
			if (err) {
				return err;
			}

			console.log("ANDRW", rows[0].password);

			bcrypt.compare(combo.password, rows[0].password).then(resp => {
				resolve(resp);
			});

			return true;
		});
	});
};

module.exports = { createQuery, checkPassword };
