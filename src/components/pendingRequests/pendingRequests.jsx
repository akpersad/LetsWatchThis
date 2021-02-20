import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";
import store from "../../config/store";
import { checkUserLoggedIn } from "../../global/_util";

class PendingRequests extends Component {
  componentDidMount() {
    checkUserLoggedIn();
    this.getPendingRequests();
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
            onClick={this.handleFriendSubmit}
            className="submit-friend-request_yes"
          >
            Add
          </button>
          <button
            type="button"
            data-id={item.id_from}
            data-choice="deny"
            onClick={this.handleFriendSubmit}
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

// PendingRequests.propTypes = {
//   pendingRequestsFormatted: PropTypes.array
// };

// PendingRequests.defaultProps = {
//   pendingRequestsFormatted: []
// };

export default connect(mapStateToProps)(PendingRequests);
