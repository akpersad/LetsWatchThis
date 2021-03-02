import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { TextField } from "@material-ui/core";
import { ScaleLoader } from "react-spinners";
import store from "../../config/store";
import Header from "../header/header";
import Footer from "../footer/footer";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      showError: false,
      loading: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const { name } = target;
    this.setState({ showError: false });

    this.setState({
      [name]: value
    });
  }

  handleSubmit() {
    const { username, password } = this.state;
    const { app } = store.getState();
    const { history } = this.props;

    this.setState({ loading: true });
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
        if (response.data.loginSuccessful) {
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
          this.setState({ loading: false });
          history.push("/");
        } else {
          this.setState({ showError: true });
          this.setState({ loading: false });
        }
      })
      .catch(error => {
        console.log("🚀 ~ file: login.jsx ~ line 53 ~ Login ~ handleSubmit ~ error", error);
      });
  }

  render() {
    const { history, match } = this.props;
    const { showError, loading } = this.state;
    return (
      <>
        <Header history={history} match={match} />

        <div className="login-container">
          {loading ? (
            <div className="login-container_inner loading-container">
              <ScaleLoader color="#000000" loading={loading} size={350} />
            </div>
          ) : (
            <div className="login-container_inner">
              <h2 className="login-header">Login</h2>
              <div className="form-group">
                <TextField
                  type="text"
                  className="login-input"
                  label="Username"
                  name="username"
                  autoComplete="off"
                  onChange={e => this.handleChange(e)}
                />
              </div>

              <div className="form-group">
                <TextField
                  type="password"
                  className="login-input"
                  label="Password"
                  name="password"
                  onChange={e => this.handleChange(e)}
                />
              </div>

              <div className="form-group">
                <input
                  className="submit-btn"
                  type="submit"
                  value="Submit"
                  onClick={this.handleSubmit}
                />
              </div>

              <div className="form-group">
                <div
                  className={showError ? "error-container visible" : "error-container invisible"}
                >
                  The password you’ve entered is incorrect.
                </div>
              </div>
            </div>
          )}
        </div>
        <Footer />
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
