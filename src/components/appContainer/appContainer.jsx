import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { fetchNetflix } from "../fetchNetflix/fetchNetflix";

class AppContainer extends Component {
  componentDidMount() {
    fetchNetflix();
  }

  render() {
    const { initialText } = this.props;
    return <div>{initialText}</div>;
  }
}

const mapStateToProps = state => {
  return {
    ...state.app
  };
};

AppContainer.propTypes = {
  initialText: PropTypes.string.isRequired
};

export default connect(mapStateToProps)(AppContainer);
