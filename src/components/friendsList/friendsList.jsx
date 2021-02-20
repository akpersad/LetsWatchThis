import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import store from "../../config/store";
import { checkUserLoggedIn } from "../../global/_util";

class FriendsList extends Component {
  componentDidMount() {
    checkUserLoggedIn();
    this.getFriendsList();
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

  formatFriendList() {
    const { profile } = store.getState();
    const formatList = profile.friendList.map(item => {
      return (
        <li key={item.id}>
          <span>{item.first_name}</span>
          {}
          <span>{item.last_name}</span>
        </li>
      );
    });
    profile.friendListFormatted = formatList;

    store.dispatch({
      type: "UPDATE_PROFILE",
      payload: profile
    });
  }

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
