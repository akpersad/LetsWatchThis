import React, { Component } from "react";
import { connect } from "react-redux";
// import PropTypes from 'prop-types';

class ProfilePageContainer extends Component {
  render() {
    return (
      <div>
        <div className="form-group">
          <h3>Friend Requests:</h3>
          Search Input
        </div>
        <div className="form-group">
          <ul>
            <li>Pending Requests</li>
          </ul>
        </div>
        <div className="form-group">
          Friend List
          <ul>
            <li>Friend 1</li>
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.app
  };
};

// ProfilePageContainer.propTypes = {};

export default connect(mapStateToProps)(ProfilePageContainer);
