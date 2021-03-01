import React, { Component } from "react";
import PropTypes from "prop-types";
import Header from "../header/header";
import Footer from "../footer/footer";

class HomeContainer extends Component {
  render() {
    const { history, match } = this.props;
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

HomeContainer.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

export default HomeContainer;
