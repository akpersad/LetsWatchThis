import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import "./styles/main.scss";
import "bootstrap/dist/js/bootstrap.bundle.min";
import AppContainer from "./components/appContainer/appContainer";

class App extends Component {
  render() {
    return (
      <>
        <Switch>
          <Route path="/" exact component={AppContainer} />
          <Route path="/something" component={AppContainer} />
        </Switch>
      </>
    );
  }
}

export default App;
