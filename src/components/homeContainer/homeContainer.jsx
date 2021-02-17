import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import store from "../../config/store";

class HomeContainer extends Component {
  componentDidMount() {
    this.checkLocalStorage();
  }

  checkLocalStorage() {
    if (localStorage.getItem("isLoggedIn") && localStorage.getItem("isLoggedIn") === "true") {
      const { app } = store.getState();
      const userInfoLocal = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : window.location.reload();
      app.userInfo.username = userInfoLocal.username;
      app.userInfo.id = userInfoLocal.id;
      app.isLoggedIn = true;
      return true;
    }
    return false;
  }

  render() {
    const { initialText, isLoggedIn, userInfo } = this.props;
    return (
      <div className="App">
        <h1>
          {isLoggedIn ? (
            <div>
              Hello,
              {userInfo.username}
            </div>
          ) : (
            <div>{initialText}</div>
          )}
        </h1>
        <h2>Project Home</h2>
        <Link to="./list">
          <button type="button" variant="raised">
            My List
          </button>
        </Link>

        <Link to="./login">
          <button type="button" variant="raised">
            Login
          </button>
        </Link>

        <Link to="./registration">
          <button type="button" variant="raised">
            Registration
          </button>
        </Link>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.app
  };
};

HomeContainer.propTypes = {
  initialText: PropTypes.string.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  userInfo: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(HomeContainer);
