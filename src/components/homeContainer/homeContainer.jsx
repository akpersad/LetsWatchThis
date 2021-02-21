import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { checkUserLoggedIn } from "../../global/_util";

class HomeContainer extends Component {
  componentDidMount() {
    checkUserLoggedIn();
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

        <div className="form-group">
          <Link to="./profile">
            <button type="button" variant="raised">
              Your Profile
            </button>
          </Link>
        </div>

        {!isLoggedIn ? (
          <div>
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
        ) : (
          <>
            <div>You are logged In</div>
            <Link to="./choices">
              <button type="button" variant="raised">
                Would you watch these?
              </button>
            </Link>
          </>
        )}
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
