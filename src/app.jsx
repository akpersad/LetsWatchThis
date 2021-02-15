import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import "./styles/main.scss";
import "bootstrap/dist/js/bootstrap.bundle.min";
import AppContainer from "./components/appContainer/appContainer";
import List from "./components/list/list";
import Login from "./components/login/login";

class App extends Component {
  render() {
    return (
      <>
        <Switch>
          <Route path="/" exact component={AppContainer} />
          <Route path="/list" component={List} />
          <Route path="/login" component={Login} />
        </Switch>
      </>
    );
  }
}

export default App;
