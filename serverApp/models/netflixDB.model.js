const createQuery = request => {
	const limit = request.query.limit || 100;
	const choice = "SELECT";
	const dbName = "netflix_shows";
	const fullStatement = `${choice} * FROM ${dbName} ORDER BY avgrating DESC LIMIT ${limit}`;
	return fullStatement;
};

module.exports = {
	createQuery
};
