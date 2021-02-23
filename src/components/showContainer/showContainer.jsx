import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Header from "../header/header";

class ShowContainer extends Component {
  constructor() {
    super();
    this.displayShowInfo = this.displayShowInfo.bind(this);
  }

  displayShowInfo() {
    const { showInfo } = this.props;
    const infoKeys = Object.keys(showInfo[0]);
    let counter = 0;
    return infoKeys.map(item => {
      counter += 1;
      return (
        <li key={counter}>
          <span>{item}</span>
          <span>: </span>
          <span>{showInfo[0][item]}</span>
        </li>
      );
    });
  }

  render() {
    const { history, match } = this.props;
    return (
      <div>
        <Header history={history} match={match} />
        <ul>{this.displayShowInfo()}</ul>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.app
  };
};

ShowContainer.propTypes = {
  showInfo: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(ShowContainer);
