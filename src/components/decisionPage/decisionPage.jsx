import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import { IconButton } from "@material-ui/core/";
import { ThumbUp, ThumbDown } from "@material-ui/icons/";
import ShowContainer from "../showContainer/showContainer";
import { checkUserLoggedIn } from "../../global/_util";
import store from "../../config/store";
import Header from "../header/header";

class DecisionPage extends Component {
  constructor() {
    super();
    this.getShowToRate = this.getShowToRate.bind(this);
  }

  componentDidMount() {
    checkUserLoggedIn();
    const { isLoggedIn, history } = this.props;
    if (!isLoggedIn) {
      history.push("/");
    } else {
      this.getShowToRate();
    }
  }

  getShowToRate() {
    const { userInfo } = this.props;
    axios.get(`/api/getshowstolike?id=${userInfo.id}`).then(res => {
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
    const { history, match } = this.props;
    return (
      <>
        <Header history={history} match={match} />
        <div className="show-container">
          <ShowContainer />
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
