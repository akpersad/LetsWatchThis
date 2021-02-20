import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import PropTypes from "prop-types";
import store from "../../config/store";
import { checkUserLoggedIn } from "../../global/_util";

class SubmitFriendRequest extends Component {
  constructor() {
    super();
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFriendSubmit = this.handleFriendSubmit.bind(this);

    this.state = {
      errorClass: "error-text_friend invisible",
      responseText: ""
    };
  }

  componentDidMount() {
    checkUserLoggedIn();
  }

  handleInputChange(event) {
    const { profile } = store.getState();
    profile.friendRequestSearch = event.target.value;
    profile.submitFriendBtnDisable = !event.target.value;

    store.dispatch({
      type: "UPDATE_PROFILE",
      payload: profile
    });
  }

  handleFriendSubmit() {
    const { friendRequestSearch } = this.props;
    const { app, profile } = store.getState();
    axios
      .post(
        "/api/sendfriendrequest",
        {
          friendRequestSearch,
          userId: app.userInfo.id
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      .then(response => {
        if (response.data.isValidRequest) {
          console.log(
            "🚀 ~ file: submitFriendRequest.jsx ~ line 52 ~ SubmitFriendRequest ~ handleFriendSubmit ~ response.data",
            response.data
          );
          this.setState({
            errorClass: "error-text_friend error-text visible",
            responseText: response.data.responseText
          });
        } else {
          this.setState({
            errorClass: "error-text_friend success-text visible",
            responseText: response.data.responseText
          });
        }

        profile.friendRequestSearch = "";
        profile.submitFriendBtnDisable = true;

        store.dispatch({
          type: "UPDATE_PROFILE",
          payload: profile
        });
      });
  }

  render() {
    const { friendRequestSearch, submitFriendBtnDisable } = this.props;
    const { errorClass, responseText } = this.state;
    return (
      <div className="form-group">
        <label htmlFor="friend-request">
          Friend Requests:
          <input
            id="friend-request"
            placeholder="Enter Username"
            value={friendRequestSearch}
            onChange={e => this.handleInputChange(e)}
          />
        </label>
        <button
          type="button"
          onClick={this.handleFriendSubmit}
          className="submit-friend-btn"
          disabled={submitFriendBtnDisable}
        >
          Add Friend
        </button>

        <div className={errorClass}>{responseText}</div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.profile
  };
};

SubmitFriendRequest.propTypes = {
  friendRequestSearch: PropTypes.string,
  submitFriendBtnDisable: PropTypes.bool.isRequired
};

SubmitFriendRequest.defaultProps = {
  friendRequestSearch: ""
};

export default connect(mapStateToProps)(SubmitFriendRequest);
