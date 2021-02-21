const profileObject = {
	friendRequestSearch: "",
	submitFriendBtnDisable: true,
	pendingRequestsReturn: [],
	pendingRequestsFormatted: [],
	mutualLikedLike: [],
	mutualLikedLikeFormatted: []
};

const profilePageContainerReducer = (state = profileObject, action) => {
	switch (action.type) {
		case "UPDATE_PROFILE":
			return {
				...action.payload
			};

		case "UPDATE_REQUESTS":
			return {
				...action.payload
			};

		default:
			return state;
	}
};

export default profilePageContainerReducer;
