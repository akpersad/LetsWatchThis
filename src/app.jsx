import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import "./styles/main.scss";
import "bootstrap/dist/js/bootstrap.bundle.min";
import AppContainer from "./components/appContainer/appContainer";
import List from "./components/list/list";

class App extends Component {
  render() {
    return (
      <>
        <Switch>
          <Route path="/" exact component={AppContainer} />
          <Route path="/list" component={List} />
        </Switch>
      </>
    );
  }
}

export default App;
