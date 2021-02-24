import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import store from "../../config/store";
import Header from "../header/header";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: ""
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const { name } = target;

    this.setState({
      [name]: value
    });
  }

  handleSubmit() {
    const { username, password } = this.state;
    const { app } = store.getState();
    const { history } = this.props;

    axios
      .post(
        "/api/checkpassword",
        {
          username,
          password
        },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      .then(response => {
        if (response.data.response) {
          app.userInfo.username = response.data.username;
          app.userInfo.id = response.data.id;
          app.userInfo.firstName = response.data.first_name;
          app.userInfo.lastName = response.data.last_name;
          app.isLoggedIn = true;

          store.dispatch({
            type: "INITIAL_STATE",
            payload: app
          });
          localStorage.setItem("isLoggedIn", true);
          localStorage.setItem("userInfo", JSON.stringify(app.userInfo));
          history.push("/");
        } else {
          console.log("INCORRECT");
        }
      })
      .catch(error => {
        console.log("🚀 ~ file: login.jsx ~ line 53 ~ Login ~ handleSubmit ~ error", error);
      });
  }

  render() {
    const { username, password } = this.state;
    const { history, match } = this.props;
    return (
      <>
        <Header history={history} match={match} />
        <div className="login-container">
          <div className="form-group">
            <label htmlFor="username">
              Username:
              <input
                id="username"
                type="text"
                name="username"
                value={username}
                onChange={e => this.handleChange(e)}
              />
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password:
              <input
                id="password"
                type="password"
                name="password"
                value={password}
                onChange={e => this.handleChange(e)}
              />
            </label>
          </div>
          <input type="submit" value="Submit" onClick={this.handleSubmit} />
        </div>
      </>
    );
  }
}

Login.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    ...state.app
  };
};

export default withRouter(connect(mapStateToProps)(Login));
