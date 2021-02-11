import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { fetchNetflix } from "../fetchNetflix/fetchNetflix";
import HomeContainer from "../homeContainer/homeContainer";

class AppContainer extends Component {
  componentDidMount() {
    fetchNetflix();
  }

  render() {
    const { initialText } = this.props;
    return (
      <>
        <div>{initialText}</div>
        <HomeContainer />
      </>
    );
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
