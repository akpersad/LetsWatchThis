import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import ShowContainer from "../showContainer/showContainer";
import { checkUserLoggedIn } from "../../global/_util";
import store from "../../config/store";

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

  submitRating(event) {
    const { value } = event.target;
    const isLiked = value === "like" ? 1 : 0;
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
    return (
      <div>
        <button type="button" value="like" onClick={e => this.submitRating(e)}>
          Like
        </button>
        <button type="button" value="dislike" onClick={e => this.submitRating(e)}>
          Dislike
        </button>
        <ShowContainer />
      </div>
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
  userInfo: PropTypes.object.isRequired,
  showInfo: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(DecisionPage);
