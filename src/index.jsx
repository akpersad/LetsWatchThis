import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import GA from "./components/googleAnalytics/googleAnalytics";
import App from "./app";
import store from "./config/store";

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      {GA.init() && <GA.RouteTracker />}
      <App />
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);

if (module.hot) {
  module.hot.accept();
}

// serviceWorker.unregister();
