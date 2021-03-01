import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Header from "../header/header";
import Footer from "../footer/footer";

class HomeContainer extends Component {
  render() {
    const { history, match, isLoggedIn } = this.props;
    return (
      <>
        <Header history={history} match={match} />
        <div className="context">
          <p className="home-text_container">
            <span className="text-middle">Let&apos;s Watch This!</span>
            <span className="text-bottom">
              Can&apos;t decide what you both want to watch? Like what shows you both are interested
              in and see what you both have in common!
            </span>

            {isLoggedIn ? (
              <Link className="link-btn" to="/choices">
                <span>Start Rating!</span>
              </Link>
            ) : (
              ""
            )}
          </p>
        </div>

        <div className="area">
          <ul className="circles">
            <li />
            <li />
            <li />
            <li />
            <li />
            <li />
            <li />
            <li />
            <li />
            <li />
          </ul>
        </div>

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

HomeContainer.propTypes = {
  isLoggedIn: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(HomeContainer);
