import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import axios from "axios";
import store from "../../config/store";

class PendingRequests extends Component {
  componentDidMount() {
    const { app, profile } = store.getState();
    const { userInfo } = app;
    axios.get(`/api/getpendingrequests?userid=${userInfo.id}`).then(response => {
      console.log(
        "🚀 ~ file: pendingRequests.jsx ~ line 12 ~ PendingRequests ~ axios.get ~ response",
        response.data
      );
      if (response.data.hasRequests) {
        profile.pendingRequestsReturn = response.data.returnedArray;

        store.dispatch({
          type: "UPDATE_PROFILE",
          payload: profile
        });
        this.formatPendingRequests();
      }
    });
  }

  formatPendingRequests() {
    const { pendingRequestsReturn } = this.props;
    console.log(
      "🚀 ~ file: pendingRequests.jsx ~ line 30 ~ PendingRequests ~ formatPendingRequests ~ pendingRequestsReturn",
      pendingRequestsReturn
    );
  }

  render() {
    const { pendingRequestsFormatted } = this.props;
    return (
      <>
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

PendingRequests.propTypes = {
  pendingRequestsReturn: PropTypes.array.isRequired,
  pendingRequestsFormatted: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(PendingRequests);
