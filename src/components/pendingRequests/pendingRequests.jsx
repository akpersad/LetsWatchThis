import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import store from "../../config/store";
import { checkUserLoggedIn } from "../../global/_util";

class PendingRequests extends Component {
  constructor() {
    super();
    this.handleFriendDecision = this.handleFriendDecision.bind(this);
  }

  componentDidMount() {
    checkUserLoggedIn();
    this.getPendingRequests();
  }

  handleFriendDecision(event) {
    const { app } = store.getState();
    const { dataset } = event.target;
    axios
      .post(
        "/api/sendfrienddecision",
        {
          requestDecision: dataset.choice,
          requestId: dataset.id,
          userId: app.userInfo.id
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      .then(response => {
        if (response.data.requestSuccessful) {
          this.getPendingRequests();
        }
      });
  }

  getPendingRequests() {
    const { app, profile } = store.getState();
    const { userInfo } = app;
    axios.get(`/api/getpendingrequests?userid=${userInfo.id}`).then(response => {
      if (response.data.hasRequests) {
        profile.pendingRequestsReturn = response.data.returnedRows;

        store.dispatch({
          type: "UPDATE_PROFILE",
          payload: profile
        });

        this.formatPendingRequests();
      } else {
        profile.pendingRequestsReturn = [];
        profile.pendingRequestsFormatted = [];

        store.dispatch({
          type: "UPDATE_PROFILE",
          payload: profile
        });
      }
    });
  }

  formatPendingRequests() {
    const { profile } = store.getState();
    const formatedArr = profile.pendingRequestsReturn.map(item => {
      return (
        <li key={item.id}>
          <span>
            {item.first_name}
            {}
            {item.last_name}
          </span>
          <button
            type="button"
            data-id={item.id_from}
            data-choice="accept"
            onClick={e => this.handleFriendDecision(e)}
            className="submit-friend-request_yes"
          >
            Add
          </button>
          <button
            type="button"
            data-id={item.id_from}
            data-choice="deny"
            onClick={e => this.handleFriendDecision(e)}
            className="submit-friend-request_no"
          >
            Delete
          </button>
        </li>
      );
    });

    profile.pendingRequestsFormatted = formatedArr;
    store.dispatch({
      type: "UPDATE_PROFILE",
      payload: profile
    });
  }

  render() {
    const { profile } = store.getState();
    const { pendingRequestsFormatted } = profile;
    return (
      <>
        <h3>Pending Requests:</h3>
        <ul>{pendingRequestsFormatted}</ul>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state
  };
};

export default connect(mapStateToProps)(PendingRequests);
