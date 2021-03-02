import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import IconButton from "@material-ui/core/IconButton";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import Select from "@material-ui/core/Select";
import Modal from "react-modal";
import ThumbUp from "@material-ui/icons/ThumbUp";
import ThumbDown from "@material-ui/icons/ThumbDown";
import Close from "@material-ui/icons/Close";
import Launch from "@material-ui/icons/Launch";
import ShowContainer from "../showContainer/showContainer";
import { checkUserLoggedIn } from "../../global/_util";
import store from "../../config/store";
import Header from "../header/header";
import Footer from "../footer/footer";

class DecisionPage extends Component {
  constructor() {
    super();
    this.getShowToRate = this.getShowToRate.bind(this);
    this.state = {
      radioValue: "both",
      sortValue: "titleDateDesc",
      sortObj: {
        column: "titledate",
        direction: "DESC"
      },
      openModal: false
    };
  }

  componentDidMount() {
    checkUserLoggedIn();
    const { isLoggedIn, history } = this.props;
    if (!isLoggedIn) {
      history.push("/");
    } else {
      this.getShowToRate();
      Modal.setAppElement(".show-container");
    }
  }

  handleRadioChange(event) {
    this.setState({ radioValue: event.target.value }, () => {
      this.getShowToRate();
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
        this.getShowToRate();
      }
    );
  }

  getShowToRate() {
    const { userInfo } = this.props;
    const { radioValue, sortObj } = this.state;
    axios
      .get(
        `/api/getshowstolike?id=${userInfo.id}&radiochoice=${radioValue}&column=${sortObj.column}&direction=${sortObj.direction}`
      )
      .then(res => {
        const { app } = store.getState();

        app.showInfo = res.data;

        store.dispatch({
          type: "INITIAL_STATE",
          payload: app
        });
      });
  }

  getButtonElement(element) {
    if (element.tagName === "BUTTON") {
      return element;
    }
    return this.getButtonElement(element.parentElement);
  }

  closeModal() {
    this.setState({ openModal: false });
  }

  formatDate() {
    const { showInfo } = this.props;
    const showObj = showInfo[0];
    const date = showObj.titledate ? new Date(showObj.titledate) : "";
    if (date) {
      const month = date.getMonth() > 8 ? date.getMonth() + 1 : `0${date.getMonth() + 1}`;
      const day = date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`;
      const year = date.getFullYear();
      return `${month}/${day}/${year}`;
    }
    return "";
  }

  formatTime() {
    const { showInfo } = this.props;
    const showObj = showInfo[0];
    const numOfMinutes = showObj.runtime / 60;
    const hours = parseInt(numOfMinutes / 60, 10);
    const minutes = parseInt(numOfMinutes % 60, 10);
    return `${hours}h ${minutes}min`;
  }

  showShowModal() {
    this.setState({ openModal: true });
  }

  submitRating(event) {
    const buttonElement = this.getButtonElement(event.target);
    const { dataset } = buttonElement;
    const isLiked = dataset.choice === "like" ? 1 : 0;
    const { userInfo, showInfo } = this.props;

    axios
      .post(
        "/api/sendrating",
        {
          userId: userInfo.id,
          isLiked,
          showId: showInfo[0].id
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      .then(response => {
        if (response.data.isSuccess) {
          this.getShowToRate();
        } else {
          console.log("Save failed");
        }
      });
  }

  render() {
    const { history, match, showInfo } = this.props;
    const showObj = showInfo[0];
    const { radioValue, sortValue, openModal } = this.state;
    return (
      <>
        <Header history={history} match={match} />
        <div className="rating-container">
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
          <div className="show-container">
            <ShowContainer />

            <div className="form-group show-mobile btn-container">
              <button
                className="show-modal-btn"
                type="button"
                value="Submit"
                onClick={() => {
                  this.showShowModal();
                }}
              >
                Show Information
              </button>
            </div>

            <div className="rating-btns_container">
              <IconButton
                data-choice="like"
                onClick={e => this.submitRating(e)}
                className="rating-btn rating-btn_like"
                aria-label="Like"
              >
                <ThumbUp />
              </IconButton>
              <IconButton
                data-choice="dislike"
                onClick={e => this.submitRating(e)}
                className="rating-btn rating-btn_dislike"
                aria-label="Dislike"
              >
                <ThumbDown />
              </IconButton>
            </div>
          </div>
        </div>
        <Modal
          isOpen={openModal}
          className="modal-rating-mobile"
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
            <div className="inner-container mobile-modal">
              <div className="show-info">
                <p className="show-p-section">
                  <span className="show-title">{showObj.title}</span>
                  <span className="show-vtype">{showObj.vtype}</span>
                  <span className="span-pipes">|</span>
                  <span className="show-year">{showObj.year}</span>
                  {showObj.vtype === "series" ? (
                    ""
                  ) : (
                    <>
                      <span className="span-pipes">|</span>
                      <span className="show-time">{this.formatTime()}</span>
                    </>
                  )}
                </p>
                <p className="show-p-section">
                  <span className="show-synopsis">{showObj.synopsis}</span>
                </p>
                <p className="show-p-section">
                  <span className="show-link show-link_netflix">
                    <a
                      className="link"
                      target="_blank"
                      rel="noreferrer"
                      href={`https://www.netflix.com/title/${showObj.nfid}/`}
                    >
                      <span data-content="Netflix">Netflix</span>
                      <Launch />
                    </a>
                  </span>
                  <span className="show-link show-link_imdb">
                    <a
                      className="link"
                      target="_blank"
                      rel="noreferrer"
                      href={`https://www.imdb.com/title/${showObj.imdbid}/`}
                    >
                      <span data-content="IMDB">IMDB</span>
                      <Launch />
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
        <Footer />
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.app
  };
};

DecisionPage.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  userInfo: PropTypes.object.isRequired,
  showInfo: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(DecisionPage);
