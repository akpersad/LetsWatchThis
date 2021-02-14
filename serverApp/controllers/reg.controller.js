const bcrypt = require("bcryptjs");

const dbName = "users";

const createQuery = request => {
	const fullStatement = `INSERT INTO ${dbName} (username, password) VALUES ('${request.username}', '${request.password}')`;
	return fullStatement;
};

const checkPassword = (pool, combo) => {
	return new Promise(resolve => {
		const queryStatement = `SELECT * FROM ${dbName} WHERE username = '${combo.username}' LIMIT 1`;
		pool.query(queryStatement, (err, rows) => {
			if (err) {
				return err;
			}

			bcrypt.compare(combo.password, rows[0].password).then(resp => {
				resolve(resp);
			});

			return true;
		});
	});
};

module.exports = { createQuery, checkPassword };
