const initialState = {
	initialText: "Hello World",
	initialHash: {},
	isLoggedIn: false,
	userInfo: { username: "", id: "", firstName: "", lastName: "" },
	showList: [],
	showInfo: [
		{
			id: "",
			title: "",
			img: "",
			vtype: "",
			nfid: "",
			synopsis: "",
			avgrating: "",
			year: "",
			runtime: "",
			imdbid: "",
			poster: "",
			imdbrating: "",
			top250: "",
			top250tv: "",
			clist: "",
			titledate: ""
		}
	],
	friendList: [],
	friendListFormatted: []
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
