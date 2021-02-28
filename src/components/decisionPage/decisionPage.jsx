import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import axios from "axios";
import { IconButton, RadioGroup, FormControlLabel, Radio, Select } from "@material-ui/core/";
import { ThumbUp, ThumbDown } from "@material-ui/icons/";
import ShowContainer from "../showContainer/showContainer";
import { checkUserLoggedIn } from "../../global/_util";
import store from "../../config/store";
import Header from "../header/header";

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
      }
    };
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
    const { radioValue, sortValue } = this.state;
    return (
      <>
        <Header history={history} match={match} />
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
