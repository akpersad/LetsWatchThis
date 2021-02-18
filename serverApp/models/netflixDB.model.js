const createQuery = request => {
	const limit = request.query.limit || 100;
	const choice = "SELECT";
	const dbName = "netflix_shows";
	const fullStatement = `${choice} * FROM ${dbName} ORDER BY avgrating DESC LIMIT ${limit}`;
	return fullStatement;
};

const getShowToLike = (pool, request) => {
	return new Promise((resolve, reject) => {
		const userId = request.query.id || 1;
		const queryUserLikes = `SELECT netflix_id FROM user_likes WHERE user_id = '${userId}'`;

		pool.query(queryUserLikes, (errorUserLikes, rowsUserLikes) => {
			if (errorUserLikes) {
				reject(errorUserLikes);
			} else {
				let queryNetflixStatement = "";
				if (rowsUserLikes.length === 0) {
					queryNetflixStatement = "SELECT * FROM netflix_shows ORDER BY titledate DESC LIMIT 1";
				} else {
					const idList = rowsUserLikes.map(item => {
						return item.netflix_id;
					});
					queryNetflixStatement = `SELECT * FROM netflix_shows WHERE id NOT IN (${idList.join(
						","
					)}) ORDER BY titledate DESC LIMIT 1`;
				}
				pool.query(queryNetflixStatement, (errorNetflixList, rowsNetflixList) => {
					if (errorUserLikes) {
						reject(errorNetflixList);
					} else {
						resolve(rowsNetflixList);
					}
				});
			}
		});
	});
};

module.exports = {
	createQuery,
	getShowToLike
};
