const bcrypt = require("bcryptjs");

const dbName = "users";

const createQuery = request => {
	const fullStatement = `INSERT INTO ${dbName} (username, password, first_name, last_name) VALUES ('${request.username}', '${request.password}', '${request.first_name}', '${request.last_name}')`;
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
					? {
							response: resp,
							username: rows[0].username,
							id: rows[0].id,
							first_name: rows[0].first_name,
							last_name: rows[0].last_name
					  }
					: { response: resp };
				resolve(returnedRes);
			});

			return true;
		});
	});
};

module.exports = { createQuery, checkPassword };
