import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

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
    return (
      <div>
        <ul>{this.displayShowInfo()}</ul>
      </div>
    );
  }
}

ShowContainer.propTypes = {};

const mapStateToProps = state => {
  return {
    ...state.app
  };
};

ShowContainer.propTypes = {
  showInfo: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(ShowContainer);
