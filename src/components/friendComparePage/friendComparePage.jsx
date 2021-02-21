import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";
// import { useParams } from "react-router";
import store from "../../config/store";
import { checkUserLoggedIn } from "../../global/_util";

class FriendComparePage extends Component {
  componentDidMount() {
    checkUserLoggedIn();
    const { app } = store.getState();
    const { userInfo } = app;
    const { history, match } = this.props;
    const { params } = match;
    axios
      .post(
        "/api/checkfriends",
        {
          userId: userInfo.id,
          friendId: params.id
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      .then(response => {
        if (response.data.areFriends) {
          // show likes logic
        } else {
          history.push("/");
        }
      });
  }

  getSameLikes() {
    const { app } = store.getState();
    const { userInfo } = app;
    const { match } = this.props;
    const { params } = match;
    axios
      .post(
        "/api/getlikesincommon",
        {
          userId: userInfo.id,
          friendId: params.id
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      .then(response => {
        if (response.data.haveLikesInCommon) {
          // update store
        } else {
          // update text "No likes in common"
        }
      });
  }

  render() {
    return <div>FriendComparePage</div>;
  }
}

const mapStateToProps = state => {
  return {
    ...state
  };
};

FriendComparePage.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(FriendComparePage);
