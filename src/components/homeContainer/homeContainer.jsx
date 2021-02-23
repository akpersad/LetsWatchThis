import React, { Component } from "react";
import PropTypes from "prop-types";
// import { connect } from "react-redux";
// import { checkUserLoggedIn } from "../../global/_util";
import Header from "../header/header";

class HomeContainer extends Component {
  // componentDidMount() {
  //   checkUserLoggedIn();
  // }

  render() {
    const { history, match } = this.props;
    return (
      <div className="App">
        <Header history={history} match={match} />
      </div>
    );
  }
}

HomeContainer.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default HomeContainer;
