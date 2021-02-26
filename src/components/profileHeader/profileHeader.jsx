import React, { Component } from "react";
import { connect } from "react-redux";
// import PropTypes from "prop-types";

class ProfileHeader extends Component {
  render() {
    return <div>ProfileHeader</div>;
  }
}

const mapStateToProps = state => {
  return {
    ...state.app
  };
};

// ProfileHeader.propTypes = {
//   history: PropTypes.object.isRequired,
//   match: PropTypes.object.isRequired
// };

export default connect(mapStateToProps)(ProfileHeader);
