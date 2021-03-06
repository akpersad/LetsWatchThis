const sendFriendRequest = (request, pool) => {
	return new Promise((resolve, reject) => {
		const queryFindUser = `SELECT * FROM users WHERE username = '${request.body.friendRequestSearch}'`;
		pool.query(queryFindUser, (err, returnedRows) => {
			if (err) {
				reject(err);
			} else {
				if (returnedRows.length === 0) {
					resolve({ isValidRequest: false, responseText: "User does not exist" });
				} else {
					const sentId = returnedRows[0].id;
					const queryFriendExits = `SELECT * FROM friendships WHERE id_first = ${request.body.userId} AND id_second = ${sentId}`;
					pool.query(queryFriendExits, (errorFriendship, checkedFriendshipRows) => {
						if (errorFriendship) {
							reject(errorFriendship);
						} else {
							console.log(
								"🚀 ~ file: profile.model.js ~ line 18 ~ pool.query ~ checkedFriendshipRows",
								checkedFriendshipRows
							);
							if (checkedFriendshipRows.length > 0) {
								resolve({ isValidRequest: false, responseText: "Already friends!" });
							} else {
								const queryDoubleCheck = `SELECT * FROM pending_requests WHERE id_from = '${request.body.userId}'`;
								pool.query(queryDoubleCheck, (errorSearch, checkedRows) => {
									if (errorSearch) {
										reject(errorSearch);
									} else {
										const returnedRequestIds = checkedRows.map(item => {
											return item.id_to;
										});

										if (returnedRequestIds.includes(sentId)) {
											resolve({
												isValidRequest: false,
												responseText: "Request Already Sent"
											});
										} else {
											const queryInsert = `INSERT INTO pending_requests (id_from, id_to) VALUES ('${request.body.userId}', '${sentId}')`;
											pool.query(queryInsert, (error, insertedRows) => {
												if (error) {
													reject(error);
												} else {
													resolve({
														isValidRequest: true,
														returnedId: insertedRows.insertId,
														responseText: "Request Sent"
													});
												}
											});
										}
									}
								});
							}
						}
					});
				}
				console.log("Request Sent");
			}
		});
	});
};

const getPendingRequets = (requests, pool) => {
	return new Promise((resolve, reject) => {
		const queryPendingRequests = `SELECT pending_requests.id, pending_requests.id_from, users.id, users.first_name, users.last_name, users.username
FROM pending_requests
INNER JOIN users ON pending_requests.id_from = users.id
WHERE pending_requests.id_to = ${requests.query.userid}
ORDER BY users.username;`;

		pool.query(queryPendingRequests, (error, returnedRows) => {
			if (error) {
				reject(error);
			} else {
				resolve({ hasRequests: returnedRows.length > 0, returnedRows });
			}
		});
	});
};

const sendFriendDecision = (requests, pool) => {
	return new Promise((resolve, reject) => {
		const queryCreateFriendship = `INSERT into friendships (id_first, id_second) VALUES ('${requests.body.userId}','${requests.body.requestId}'), ('${requests.body.requestId}','${requests.body.userId}')`;
		const insertFriends = (query, poolSecond) => {
			return new Promise(resolveTwo => {
				if (requests.body.requestDecision === "accept") {
					poolSecond.query(query, (error, returnedRows) => {
						if (error) {
							reject(error);
						}
						resolveTwo({ readyForDelete: true, returnedRows });
					});
				} else {
					resolveTwo({ readyForDelete: true });
				}
			});
		};

		insertFriends(queryCreateFriendship, pool).then(response => {
			if (response.readyForDelete) {
				const queryDeleteRequest = `DELETE FROM pending_requests WHERE id_from = ${requests.body.requestId} AND id_to = ${requests.body.userId}`;
				pool.query(queryDeleteRequest, (deleteError, returnedDeletedRows) => {
					if (deleteError) {
						reject(deleteError);
					} else {
						resolve({ requestSuccessful: true, returnedDeletedRows });
					}
				});
			}
		});
	});
};

const getFriendList = (request, pool) => {
	return new Promise((resolve, reject) => {
		const queryFriendList = `SELECT users.id, users.username, users.first_name, users.last_name
FROM users
INNER JOIN friendships ON friendships.id_second = users.id
WHERE friendships.id_first = ${request.query.userid}
ORDER BY users.first_name`;

		pool.query(queryFriendList, (error, returnedRows) => {
			if (error) {
				reject(error);
			} else {
				resolve({ hasFriends: returnedRows.length > 0, returnedRows });
			}
		});
	});
};

const getUserLikes = (id, sortObj, radioValue, pool) => {
	return new Promise((resolve, reject) => {
		let videoType = "";

		if (radioValue === "both") {
			videoType = "(netflix_shows.vtype = 'series' OR netflix_shows.vtype = 'movie')";
		} else if (radioValue === "movie") {
			videoType = "netflix_shows.vtype = 'movie'";
		} else if (radioValue === "series") {
			videoType = "netflix_shows.vtype = 'series'";
		} else {
			videoType = "(netflix_shows.vtype = 'series' OR netflix_shows.vtype = 'movie')";
		}

		const queryCheckFriendship = `SELECT users.id AS userId, users.username, user_likes.id AS userLikedId, netflix_shows.*
FROM users
INNER JOIN user_likes ON users.id = user_likes.user_id
INNER JOIN netflix_shows ON netflix_shows.id = user_likes.netflix_id
WHERE users.id = ${id} AND user_likes.liked = 1 AND ${videoType}
ORDER BY netflix_shows.${sortObj.column} ${sortObj.direction}`;
		pool.query(queryCheckFriendship, (error, returnedRows) => {
			if (error) {
				reject(error);
			} else {
				resolve({ hasLikes: returnedRows.length > 0, returnedRows });
			}
		});
	});
};

module.exports = {
	sendFriendRequest,
	getPendingRequets,
	sendFriendDecision,
	getFriendList,
	getUserLikes
};
