import React, { Component } from "react";
import { connect } from "react-redux";
// import PropTypes from 'prop-types';
import SubmitFriendRequest from "../submitFriendRequest/submitFriendRequest";
import PendingRequests from "../pendingRequests/pendingRequests";
import FriendsList from "../friendsList/friendsList";

class ProfilePageContainer extends Component {
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
          <FriendsList />
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
