import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import PropTypes from "prop-types";
import { Input, Button, InputAdornment } from "@material-ui/core/";
import { Search } from "@material-ui/icons/";
import store from "../../config/store";
import { checkUserLoggedIn } from "../../global/_util";

class SubmitFriendRequest extends Component {
  constructor() {
    super();
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFriendSubmit = this.handleFriendSubmit.bind(this);

    this.state = {
      errorClass: "error-text_friend invisible",
      responseText: "Temp"
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
          this.setState({
            errorClass: "error-text_friend success-text visible",
            responseText: response.data.responseText
          });
        } else {
          this.setState({
            errorClass: "error-text_friend error-text visible",
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
    const { submitFriendBtnDisable } = this.props;
    const { errorClass, responseText } = this.state;
    return (
      <>
        <h3 className="friend-section-header">Submit Friend Request:</h3>
        <div className="form-group">
          {/* <InputLabel htmlFor="input-with-icon-adornment">With a start adornment</InputLabel> */}
          <Input
            className="friend-request-btn"
            placeholder="Enter Username"
            onChange={e => this.handleInputChange(e)}
            startAdornment={
              /* eslint-disable */
              <InputAdornment position="end">
                <Search />
              </InputAdornment>
              /* eslint-enable */
            }
          />
        </div>

        <div className="form-group">
          <Button
            variant="contained"
            color="primary"
            onClick={this.handleFriendSubmit}
            className="submit-friend-btn"
            disabled={submitFriendBtnDisable}
          >
            Add Friend
          </Button>

          <div className={errorClass}>{responseText}</div>
        </div>
      </>
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
