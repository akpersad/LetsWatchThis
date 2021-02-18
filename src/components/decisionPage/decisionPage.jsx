import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { checkUserLoggedIn } from "../../global/_util";

class DecisionPage extends Component {
  componentDidMount() {
    checkUserLoggedIn();
    const { isLoggedIn, history } = this.props;
    if (!isLoggedIn) {
      history.push("/");
    }
  }

  render() {
    return <div>DecisionPage</div>;
  }
}

const mapStateToProps = state => {
  return {
    ...state.app
  };
};

DecisionPage.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(DecisionPage);
