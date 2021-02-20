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

module.exports = { sendFriendRequest, getPendingRequets };
