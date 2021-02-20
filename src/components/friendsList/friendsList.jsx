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
    const { app } = store.getState();
    const { userInfo } = app;
    axios.get(`/api/getfriendlist?userid=${userInfo.id}`).then(response => {
      if (response.data.hasFriends) {
        app.friendList = response.data.returnedRows;

        store.dispatch({
          type: "INITIAL_STATE",
          payload: app
        });

        this.formatFriendList();
      }
    });
  }

  formatFriendList() {
    const { app } = store.getState();
    const formatList = app.friendList.map(item => {
      return (
        <li key={item.id}>
          <span>{item.first_name}</span>
          {}
          <span>{item.last_name}</span>
        </li>
      );
    });
    app.friendListFormatted = formatList;

    store.dispatch({
      type: "INITIAL_STATE",
      payload: app
    });
  }

  render() {
    const { app } = store.getState();
    const { friendListFormatted } = app;

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
