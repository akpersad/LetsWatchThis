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
		let videoType = "";
		const orderVar = `${request.query.column} ${request.query.direction}`;
		const queryUserLikes = `SELECT netflix_id FROM user_likes WHERE user_id = '${userId}'`;

		if (request.query.radiochoice === "both") {
			videoType = "(vtype = 'series' OR vtype = 'movie')";
		} else if (request.query.radiochoice === "movie") {
			videoType = "vtype = 'movie'";
		} else if (request.query.radiochoice === "series") {
			videoType = "vtype = 'series'";
		} else {
			videoType = "(vtype = 'series' OR vtype = 'movie')";
		}
		pool.query(queryUserLikes, (errorUserLikes, rowsUserLikes) => {
			if (errorUserLikes) {
				reject(errorUserLikes);
			} else {
				let queryNetflixStatement = "";
				if (rowsUserLikes.length === 0) {
					queryNetflixStatement = `SELECT * FROM netflix_shows WHERE ${videoType} ORDER BY ${orderVar} LIMIT 1`;
				} else {
					const idList = rowsUserLikes.map(item => {
						return item.netflix_id;
					});
					queryNetflixStatement = `SELECT * FROM netflix_shows WHERE ${videoType} AND id NOT IN (${idList.join(
						","
					)}) ORDER BY ${orderVar} LIMIT 1`;
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
