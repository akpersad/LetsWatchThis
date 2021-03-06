import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import "./styles/main.scss";
import "bootstrap/dist/js/bootstrap.bundle.min";
import Favicon from "react-favicon";
import AppContainer from "./components/appContainer/appContainer";
import FaviconImage from "./global/images/tv.png";
import Login from "./components/login/login";
import Registration from "./components/registration/registration";
import DecisionPage from "./components/decisionPage/decisionPage";
import ProfilePage from "./components/profilePageContainer/profilePageContainer";
import FriendComparePage from "./components/friendComparePage/friendComparePage";

class App extends Component {
  render() {
    return (
      <>
        <Favicon url={FaviconImage} />
        <Switch>
          <Route path="/" exact component={AppContainer} />
          <Route path="/login" component={Login} />
          <Route path="/registration" component={Registration} />
          <Route path="/choices" component={DecisionPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/matches/:id" component={FriendComparePage} />
        </Switch>
      </>
    );
  }
}

export default App;
