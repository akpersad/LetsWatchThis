import React, { Component } from "react";
// import PropTypes from "prop-types";
// import { connect } from "react-redux";
// import { checkUserLoggedIn } from "../../global/_util";
import Header from "../header/header";

class HomeContainer extends Component {
  // componentDidMount() {
  //   checkUserLoggedIn();
  // }

  render() {
    return (
      <div className="App">
        <Header />
      </div>
    );
  }
}

export default HomeContainer;
