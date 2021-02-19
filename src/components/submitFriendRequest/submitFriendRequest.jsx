import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

class SubmitFriendRequest extends Component {
  render() {
    const { friendRequestSearch } = this.props;
    return (
      <div className="form-group">
        <input
          placeholder="Search for..."
          value={friendRequestSearch}
          onChange={this.handleInputChange}
        />
        <button type="button" onClick={this.handleFriendSubmit}>
          Add Friend
        </button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.profilePageContainerReducer
  };
};

SubmitFriendRequest.propTypes = {
  friendRequestSearch: PropTypes.string.isRequired
};

export default connect(mapStateToProps)(SubmitFriendRequest);
