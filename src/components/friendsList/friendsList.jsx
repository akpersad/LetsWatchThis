import React, { Component } from "react";
import { connect } from "react-redux";
import store from "../../config/store";
import { checkUserLoggedIn, getFriendsList } from "../../global/_util";

class FriendsList extends Component {
  componentDidMount() {
    checkUserLoggedIn();
    getFriendsList();
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
