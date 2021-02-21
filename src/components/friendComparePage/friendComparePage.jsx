import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";
import store from "../../config/store";
import { checkUserLoggedIn } from "../../global/_util";

class FriendComparePage extends Component {
  constructor() {
    super();
    this.state = {
      hasMutual: false
    };
  }

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
          this.getSameLikes();
        } else {
          history.push("/");
        }
      });
  }

  getSameLikes() {
    const { app, profile } = store.getState();
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
          profile.mutualLikedLike = response.data.formattedList;
          store.dispatch({
            type: "UPDATE_PROFILE",
            payload: profile
          });
          this.formatMutualLike();
        }
        this.setState({ hasMutual: response.data.haveLikesInCommon });
      });
  }

  formatMutualLike() {
    const { profile } = store.getState();
    const arrKeys = Object.keys(profile.mutualLikedLike[0]);
    let counter = 0;
    const mutuals = profile.mutualLikedLike.map(item => {
      counter += 1;
      return <ul key={counter}>{this.convertShowInfo(item, arrKeys)}</ul>;
    });
    profile.mutualLikedLikeFormatted = mutuals;
    store.dispatch({
      type: "UPDATE_PROFILE",
      payload: profile
    });
  }

  convertShowInfo(obj, objKeys) {
    return objKeys.map(item => {
      return (
        <li key={item}>
          <span>{item}</span>
          {obj[item]}
        </li>
      );
    });
  }

  render() {
    const { hasMutual } = this.state;
    const { profile } = store.getState();
    return (
      <>
        {hasMutual ? (
          <div>{profile.mutualLikedLikeFormatted}</div>
        ) : (
          <div>No liked shows or movies in common! Like some more.</div>
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

FriendComparePage.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(FriendComparePage);
