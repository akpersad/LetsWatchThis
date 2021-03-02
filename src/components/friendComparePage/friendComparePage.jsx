import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";
import Modal from "react-modal";
import { IconButton, RadioGroup, FormControlLabel, Radio, Select } from "@material-ui/core/";
import { Close, Launch } from "@material-ui/icons/";
import { ScaleLoader } from "react-spinners";
import Header from "../header/header";
import Footer from "../footer/footer";
import store from "../../config/store";
import { checkUserLoggedIn } from "../../global/_util";

class FriendComparePage extends Component {
  constructor() {
    super();
    this.state = {
      hasMutual: false,
      openModal: false,
      radioValue: "both",
      sortValue: "titleDateDesc",
      sortObj: {
        column: "titledate",
        direction: "DESC"
      },
      loading: false
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

  handleRadioChange(event) {
    this.setState({ radioValue: event.target.value }, () => {
      this.getSameLikes();
    });
  }

  handleSortChange(event) {
    const { options } = event.target;
    const filteredOption = [...options].filter(item => {
      return item.value === event.target.value;
    });
    this.setState(
      {
        sortObj: {
          column: filteredOption[0].dataset.column,
          direction: filteredOption[0].dataset.direction
        },
        sortValue: event.target.value
      },
      () => {
        this.getSameLikes();
      }
    );
  }

  getSameLikes() {
    const { app, profile } = store.getState();
    const { userInfo } = app;
    const { match } = this.props;
    const { sortObj, radioValue } = this.state;
    const { params } = match;

    this.setState({ loading: true });
    axios
      .post(
        "/api/getlikesincommon",
        {
          userId: userInfo.id,
          friendId: params.id,
          sortObj,
          radioValue
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

          if (response.data.formattedList.length === 4) {
            document.documentElement.style.setProperty("--col-width", "unset");
            document.documentElement.style.setProperty(
              "--item-width",
              `calc(${100 / 4}% - ${2 * 4}px)`
            );
          } else if (response.data.formattedList.length === 3) {
            document.documentElement.style.setProperty("--col-width", "unset");
            document.documentElement.style.setProperty(
              "--item-width",
              `calc(${100 / 3}% - ${2 * 3}px)`
            );
          } else if (response.data.formattedList.length === 2) {
            document.documentElement.style.setProperty("--col-width", "unset");
            document.documentElement.style.setProperty(
              "--item-width",
              `calc(${100 / 2}% - ${2 * 2}px)`
            );
          } else if (response.data.formattedList.length === 1) {
            document.documentElement.style.setProperty("--col-width", "unset");
            document.documentElement.style.setProperty(
              "--item-width",
              `calc(${100 / 1}% - ${2 * 1}px)`
            );
          } else {
            document.documentElement.style.setProperty("--col-width", 5);
            document.documentElement.style.setProperty("--item-width", "100%");
          }

          this.formatImages();
          this.setState({ loading: false });
        }
        this.setState({ hasMutual: response.data.haveLikesInCommon });
        this.setState({ loading: false });
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
    const { hasMutual, openModal, radioValue, sortValue, loading } = this.state;
    const { history, match } = this.props;
    const { profile, app } = store.getState();
    return (
      <>
        <Header history={history} match={match} />
        <div className="photo-grid-container">
          {loading ? (
            <ScaleLoader color="#000000" loading={loading} size={350} />
          ) : (
            <>
              {hasMutual ? (
                <>
                  <div className="filter-group">
                    <RadioGroup
                      row
                      aria-label="Video Type"
                      name="video"
                      value={radioValue}
                      onChange={e => this.handleRadioChange(e)}
                    >
                      <FormControlLabel
                        className="radio-video"
                        value="movie"
                        control={<Radio />}
                        label="Movie"
                      />
                      <FormControlLabel
                        className="radio-video"
                        value="series"
                        control={<Radio />}
                        label="Series"
                      />
                      <FormControlLabel
                        className="radio-video"
                        value="both"
                        control={<Radio />}
                        label="Both"
                      />
                    </RadioGroup>

                    <div className="pipe-spacer">|</div>

                    <Select
                      native
                      value={sortValue}
                      onChange={e => {
                        this.handleSortChange(e);
                      }}
                    >
                      <option data-column="title" data-direction="ASC" value="titleAsc">
                        Title: A - Z
                      </option>
                      <option data-column="title" data-direction="DESC" value="titleDesc">
                        Title: Z - A
                      </option>
                      <option data-column="titledate" data-direction="ASC" value="titleDateAsc">
                        Release Date: Older - Newer
                      </option>
                      <option data-column="titledate" data-direction="DESC" value="titleDateDesc">
                        Release Date: Newer - Older
                      </option>
                    </Select>
                  </div>
                  <div className="photos">{profile.mutualLikedLikeFormatted}</div>
                </>
              ) : (
                <div>No liked shows or movies in common! Like some more.</div>
              )}
            </>
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
                  {app.modalInfo.vtype === "series" ? (
                    ""
                  ) : (
                    <>
                      <span className="span-pipes">|</span>
                      <span className="show-time">{this.formatTime()}</span>
                    </>
                  )}
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
                      <Launch />
                    </a>
                  </span>
                  {app.modalInfo.imdbid ? (
                    <span className="show-link show-link_imdb">
                      <a
                        className="link"
                        target="_blank"
                        rel="noreferrer"
                        href={`https://www.imdb.com/title/${app.modalInfo.imdbid}/`}
                      >
                        <span data-content="IMDB">IMDB</span>
                        <Launch />
                      </a>
                    </span>
                  ) : (
                    ""
                  )}
                </p>
                <p className="show-p-section">
                  <span className="show-release_label">Release Date:</span>
                  <span className="show-release_date">{this.formatDate()}</span>
                </p>
              </div>
            </div>
          </div>
        </Modal>
        <Footer />
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
