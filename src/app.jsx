import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import "./styles/main.scss";
import "bootstrap/dist/js/bootstrap.bundle.min";
import AppContainer from "./components/appContainer/appContainer";
import Login from "./components/login/login";
import Registration from "./components/registration/registration";
import DecisionPage from "./components/decisionPage/decisionPage";
import ProfilePage from "./components/profilePageContainer/profilePageContainer";

class App extends Component {
  render() {
    return (
      <>
        <Switch>
          <Route path="/" exact component={AppContainer} />
          <Route path="/login" component={Login} />
          <Route path="/registration" component={Registration} />
          <Route path="/choices" component={DecisionPage} />
          <Route path="/profile" component={ProfilePage} />
        </Switch>
      </>
    );
  }
}

export default App;
