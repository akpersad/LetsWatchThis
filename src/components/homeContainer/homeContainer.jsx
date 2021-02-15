import React, { Component } from "react";
import { Link } from "react-router-dom";

class HomeContainer extends Component {
  render() {
    return (
      <div className="App">
        <h1>Project Home</h1>
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
      </div>
    );
  }
}

export default HomeContainer;
