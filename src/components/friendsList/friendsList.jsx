import React, { Component } from "react";
import { connect } from "react-redux";
import { ScaleLoader } from "react-spinners";
import store from "../../config/store";
import { checkUserLoggedIn, getFriendsList } from "../../global/_util";

class FriendsList extends Component {
  componentDidMount() {
    checkUserLoggedIn();
    getFriendsList();
  }

  render() {
    const { app } = store.getState();
    const { friendListFormatted, friendListLoading } = app;

    return (
      <>
        <h3>Friends List:</h3>
        {friendListLoading ? (
          <ScaleLoader color="#000000" loading={friendListLoading} size={350} />
        ) : (
          <ul className="friends-list-container">{friendListFormatted}</ul>
        )}
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
