import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
// import store from "../../config/store";
import { checkUserLoggedIn } from "../../global/_util";

import "./_header.scss";

class Header extends Component {
  constructor() {
    super();
    checkUserLoggedIn();
    this.state = { chevronBool: true };
  }

  toggleDropdown(event) {
    const { chevronBool } = this.state;
    document.querySelector(".dropdown-box").classList.toggle("d-none");
    this.setState({ chevronBool: !chevronBool });
  }

  render() {
    const { isLoggedIn, userInfo } = this.props;
    const { chevronBool } = this.state;
    console.log("🚀 ~ file: header.jsx ~ line 17 ~ Header ~ render ~ userInfo", userInfo);
    console.log("🚀 ~ file: header.jsx ~ line 17 ~ Header ~ render ~ isLoggedIn", isLoggedIn);

    return (
      <div className="header-container">
        <div className="header-left">Left</div>
        <div className="header-right dropdown-container">
          <button
            type="button"
            className="dropdown-header-text"
            onClick={e => {
              this.toggleDropdown(e);
            }}
          >
            {isLoggedIn ? (
              <>
                <span>{`Hello, ${userInfo.firstName}!`}</span>
                <FontAwesomeIcon icon={chevronBool ? faChevronDown : faChevronUp} />
              </>
            ) : (
              "Login"
            )}
          </button>
          <div className="dropdown-box d-none">
            {isLoggedIn ? (
              <>
                <Link to="./profile">
                  <span>Your Profile</span>
                </Link>
                <Link to="./choices">
                  <span>Would you watch these?</span>
                </Link>
              </>
            ) : (
              <>
                <Link to="./login">
                  <span>Login</span>
                </Link>
                <Link to="./registration">
                  <span>Register</span>
                </Link>
              </>
            )}
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

Header.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  userInfo: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(Header);
