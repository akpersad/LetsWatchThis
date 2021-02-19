const profileObject = {
	friendRequestSearch: ""
};

const profilePageContainerReducer = (state = profileObject, action) => {
	switch (action.type) {
		case "UPDATE_PROFILE":
			return {
				...action.payload
			};

		default:
			return state;
	}
};

export default profilePageContainerReducer;
