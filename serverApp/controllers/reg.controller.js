const createQuery = request => {
	const dbName = "users";
	const fullStatement = `INSERT INTO ${dbName} (username, password) VALUES ('${request.username}', '${request.password}')`;

	console.log("🚀 ~ file: netflixDB.js ~ line 6 ~ fullStatement", fullStatement);

	return fullStatement;
};

module.exports = { createQuery };
