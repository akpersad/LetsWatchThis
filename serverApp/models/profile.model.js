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
				console.log("INSERT DONE");
			}
		});
	});
};

module.exports = { sendFriendRequest };
