import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Header from "../header/header";
import SubmitFriendRequest from "../submitFriendRequest/submitFriendRequest";
import PendingRequests from "../pendingRequests/pendingRequests";
import FriendsList from "../friendsList/friendsList";
import ProfileHeader from "../profileHeader/profileHeader";

class ProfilePageContainer extends Component {
  render() {
    const { history, match } = this.props;
    return (
      <>
        <Header history={history} match={match} />
        <div className="profile-page_container">
          <ProfileHeader />
          <div className="container friends-section">
            <div className="friend-left">
              <div className="form-group friend-request-container">
                <SubmitFriendRequest />
              </div>
              <div className="form-group">
                <PendingRequests />
              </div>
            </div>
            <div className="friend-right">
              <div className="form-group">
                <FriendsList />
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.app
  };
};

ProfilePageContainer.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(ProfilePageContainer);
