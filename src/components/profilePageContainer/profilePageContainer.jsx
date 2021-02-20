import React, { Component } from "react";
import { connect } from "react-redux";
// import PropTypes from 'prop-types';
import { checkUserLoggedIn } from "../../global/_util";
import SubmitFriendRequest from "../submitFriendRequest/submitFriendRequest";
import PendingRequests from "../pendingRequests/pendingRequests";

class ProfilePageContainer extends Component {
  componentDidMount() {
    checkUserLoggedIn();
  }

  render() {
    return (
      <div>
        <div className="form-group">
          <SubmitFriendRequest />
        </div>
        <div className="form-group">
          <PendingRequests />
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
