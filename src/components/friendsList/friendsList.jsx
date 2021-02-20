import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import store from "../../config/store";
import { checkUserLoggedIn } from "../../global/_util";

class FriendsList extends Component {
  componentDidMount() {
    checkUserLoggedIn();
    this.getPendingRequests();
  }

  getFriendsList() {
    const { app, profile } = store.getState();
    const { userInfo } = app;
    axios.get(`/api/getfriendlist?userid=${userInfo.id}`).then(response => {
      if (response.data.hasFriends) {
        profile.friendList = response.data.returnedRows;

        store.dispatch({
          type: "UPDATE_PROFILE",
          payload: profile
        });

        this.formatFriendList();
      }
    });
  }

  formatFriendList() {}

  render() {
    const { profile } = store.getState();
    const { friendListFormatted } = profile;

    return (
      <>
        <div>Friends List</div>
        <ul>{friendListFormatted}</ul>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state
  };
};

export default connect(mapStateToProps)(FriendsList);
