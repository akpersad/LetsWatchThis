const bcrypt = require("bcryptjs");

const dbName = "users";

const createQuery = request => {
	const fullStatement = `INSERT INTO ${dbName} (username, password) VALUES ('${request.username}', '${request.password}')`;
	return fullStatement;
};

const checkPassword = (pool, combo) => {
	return new Promise((resolve, reject) => {
		const queryStatement = `SELECT * FROM ${dbName} WHERE username = '${combo.username}' LIMIT 1`;

		pool.query(queryStatement, (err, rows) => {
			if (err) {
				reject(err);
			}

			bcrypt.compare(combo.password, rows[0].password).then(resp => {
				const returnedRes = resp
					? { response: resp, username: rows[0].username, id: rows[0].id }
					: { response: resp };
				resolve(returnedRes);
			});

			return true;
		});
	});
};

module.exports = { createQuery, checkPassword };
