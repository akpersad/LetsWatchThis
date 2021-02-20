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
				console.log("INSERT DONE");
			}
		});
	});
};

const getPendingRequets = (requests, pool) => {
	return new Promise((resolve, reject) => {
		const queryPendingRequests = `SELECT pending_requests.id, pending_requests.id_from, users.id, users.first_name, users.last_name, users.username
FROM pending_requests
INNER JOIN users ON pending_requests.id_from = users.id
WHERE pending_requests.id_to = ${requests.query.userid};`;

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
WHERE friendships.id_first = ${request.query.userid}`;

		pool.query(queryFriendList, (error, returnedRows) => {
			if (error) {
				reject(error);
			} else {
				resolve({ hasFriends: returnedRows.length > 0, returnedRows });
			}
		});
	});
};

module.exports = { sendFriendRequest, getPendingRequets, sendFriendDecision, getFriendList };
