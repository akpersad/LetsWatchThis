import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";
import Modal from "react-modal";
import { IconButton /* RadioGroup, FormControlLabel, Radio, Select */ } from "@material-ui/core/";
import { Close } from "@material-ui/icons/";
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
    const { app } = store.getState();
    app.modalInfo = obj;

    store.dispatch({
      type: "INITIAL_STATE",
      payload: app
    });

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

  formatDate() {
    const { app } = this.props;
    const { modalInfo } = app;
    const date = modalInfo.titledate ? new Date(modalInfo.titledate) : "";
    if (date) {
      const month = date.getMonth() > 8 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
      const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    }
    return "";
  }

  formatTime() {
    const { app } = this.props;
    const { modalInfo } = app;
    const numOfMinutes = modalInfo.runtime / 60;
    const hours = parseInt(numOfMinutes / 60, 10);
    const minutes = parseInt(numOfMinutes % 60, 10);
    return `${hours}h ${minutes}min`;
  }

  render() {
    const { hasMutual, openModal } = this.state;
    const { history, match } = this.props;
    const { profile, app } = store.getState();
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
          className="modal-friend-compare"
          onRequestClose={() => {
            this.closeModal();
          }}
          contentLabel="Example Modal"
        >
          <div className="modal-header">
            <h2>Hello</h2>
            <IconButton
              onClick={() => {
                this.closeModal();
              }}
              className="close-btn"
              aria-label="Close Modal"
            >
              <Close />
            </IconButton>
          </div>
          <div className="modal-body">
            <div className="inner-container">
              <div className="image-section">
                <img src={app.modalInfo.poster || app.modalInfo.img} alt="Poster" />
              </div>
              <div className="show-info">
                <p className="show-p-section">
                  <span className="show-title">{app.modalInfo.title}</span>
                  <span className="show-vtype">{app.modalInfo.vtype}</span>
                  <span className="span-pipes">|</span>
                  <span className="show-year">{app.modalInfo.year}</span>
                  <span className="span-pipes">|</span>
                  <span className="show-time">{this.formatTime()}</span>
                </p>
                <p className="show-p-section">
                  <span className="show-synopsis">{app.modalInfo.synopsis}</span>
                </p>
                <p className="show-p-section">
                  <span className="show-link show-link_netflix">
                    <a
                      className="link"
                      target="_blank"
                      rel="noreferrer"
                      href={`https://www.netflix.com/title/${app.modalInfo.nfid}/`}
                    >
                      <span data-content="Netflix">Netflix</span>
                      {/* <Launch /> */}
                    </a>
                  </span>
                  <span className="show-link show-link_imdb">
                    <a
                      className="link"
                      target="_blank"
                      rel="noreferrer"
                      href={`https://www.imdb.com/title/${app.modalInfo.imdbid}/`}
                    >
                      <span data-content="IMDB">IMDB</span>
                      {/* <Launch /> */}
                    </a>
                  </span>
                </p>
                <p className="show-p-section">
                  <span className="show-release_label">Release Date:</span>
                  <span className="show-release_date">{this.formatDate()}</span>
                </p>
              </div>
            </div>
          </div>
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
  match: PropTypes.object.isRequired,
  app: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(FriendComparePage);
