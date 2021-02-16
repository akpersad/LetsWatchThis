const initialState = {
	initialText: "Hello World",
	initialHash: {},
	isLoggedIn: false,
	userInfo: {},
	showList: []
};

const appContainerReducer = (state = initialState, action) => {
	switch (action.type) {
		case "INITIAL_STATE":
			return {
				...action.payload
			};

		default:
			return state;
	}
};

export default appContainerReducer;
