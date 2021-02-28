import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";
import Modal from "react-modal";
import Header from "../header/header";
import store from "../../config/store";
import { checkUserLoggedIn } from "../../global/_util";

class FriendComparePage extends Component {
  constructor() {
    super();
    this.state = {
      hasMutual: false,
      openModal: false
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
          Modal.setAppElement(".photo-grid-container");
          this.getSameLikes();
        } else {
          history.push("/");
        }
      });
  }

  handleImageClick(event, obj) {
    console.log(
      "🚀 ~ file: friendComparePage.jsx ~ line 77 ~ FriendComparePage ~ handleImageClick ~ obj",
      obj
    );
    this.setState({ openModal: true });
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
          this.formatImages();
        }
        this.setState({ hasMutual: response.data.haveLikesInCommon });
      });
  }

  closeModal() {
    this.setState({ openModal: false });
  }

  formatImages() {
    const { profile } = store.getState();
    const mutuals = profile.mutualLikedLike.map(item => {
      return (
        <button
          key={item.id}
          type="button"
          onClick={e => {
            this.handleImageClick(e, item);
          }}
        >
          <img src={item.poster || item.img} alt="Poster" />
        </button>
      );
    });

    profile.mutualLikedLikeFormatted = mutuals;
    store.dispatch({
      type: "UPDATE_PROFILE",
      payload: profile
    });
  }

  render() {
    const { hasMutual, openModal } = this.state;
    const { history, match } = this.props;
    const { profile } = store.getState();
    return (
      <>
        <Header history={history} match={match} />
        <div className="photo-grid-container">
          {hasMutual ? (
            <div className="photos">{profile.mutualLikedLikeFormatted}</div>
          ) : (
            <div>No liked shows or movies in common! Like some more.</div>
          )}
        </div>

        <Modal
          isOpen={openModal}
          // onAfterOpen={afterOpenModal}
          onRequestClose={() => {
            this.closeModal();
          }}
          // style={customStyles}
          contentLabel="Example Modal"
        >
          <h2>Hello</h2>
          <button
            type="button"
            onClick={() => {
              this.closeModal();
            }}
          >
            Close
          </button>
          <div>I am a modal</div>
          <form>
            <input />
            <button type="button">tab navigation</button>
            <button type="button">stays</button>
            <button type="button">inside</button>
            <button type="button">the modal</button>
          </form>
        </Modal>
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
