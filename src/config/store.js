import { combineReducers, createStore, compose } from "redux";
import appContainerReducer from "../components/appContainer/appContainerReducer";
import profilePageContainerReducer from "../components/profilePageContainer/profilePageContainerReducer";

const rootReducer = combineReducers({
	app: appContainerReducer,
	profile: profilePageContainerReducer
});

/* eslint-disable no-underscore-dangle */
const store = createStore(
	rootReducer /* preloadedState, */,
	compose(window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
);
/* eslint-enable */

export default store;
