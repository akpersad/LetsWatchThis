import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Launch } from "@material-ui/icons/";

class ShowContainer extends Component {
  constructor() {
    super();
    this.displayShowInfo = this.displayShowInfo.bind(this);
  }

  displayShowInfo() {
    const { showInfo } = this.props;
    const infoKeys = Object.keys(showInfo[0]);
    let counter = 0;
    return infoKeys.map(item => {
      counter += 1;
      return (
        <li key={counter}>
          <span>{item}</span>
          <span>: </span>
          <span>{showInfo[0][item]}</span>
        </li>
      );
    });
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
    // return `${month}/${day}/${year}`;
  }

  formatTime() {
    const { showInfo } = this.props;
    const showObj = showInfo[0];
    const numOfMinutes = showObj.runtime / 60;
    const hours = parseInt(numOfMinutes / 60, 10);
    const minutes = parseInt(numOfMinutes % 60, 10);
    return `${hours}h ${minutes}min`;
  }

  render() {
    const { showInfo } = this.props;
    const showObj = showInfo[0];

    return (
      <div className="show-container_show">
        <h1 className="show-title show-mobile">{showObj.title}</h1>
        <div className="inner-container">
          <div className="image-section">
            <img src={showObj.poster || showObj.img} alt="Poster" />
          </div>
          <div className="show-info">
            <p className="show-p-section">
              <span className="show-title">{showObj.title}</span>
              <span className="show-vtype">{showObj.vtype}</span>
              <span className="span-pipes">|</span>
              <span className="show-year">{showObj.year}</span>
              <span className="span-pipes">|</span>
              <span className="show-time">{this.formatTime()}</span>
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
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.app
  };
};

ShowContainer.propTypes = {
  showInfo: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(ShowContainer);
