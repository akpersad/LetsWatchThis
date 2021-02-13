const initialState = {
	initialText: "Hello World",
	initialHash: {},
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
