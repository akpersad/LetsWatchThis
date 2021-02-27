import React, { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { TextField } from "@material-ui/core";
import { ScaleLoader } from "react-spinners";
import store from "../../config/store";
import Header from "../header/header";

class Registration extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      confirmPass: "",
      validForm: true,
      regMessage: "",
      formPostable: false,
      loading: false
    };

    this.confirmPassCheck = this.confirmPassCheck.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const { name } = target;

    if (name !== "confirmPass") {
      this.setState(
        {
          [name]: value
        },
        () => {
          this.checkValidForm();
        }
      );
    } else {
      this.setState(
        {
          [name]: value
        },
        () => {
          this.confirmPassCheck();
          this.checkValidForm();
        }
      );
    }
  }

  handleSubmit() {
    const { validForm, username, password, firstName, lastName } = this.state;
    const { app } = store.getState();
    const { history } = this.props;

    this.setState({ loading: true });
    if (validForm) {
      axios
        .post(
          "/api/registration",
          {
            username,
            password,
            firstName,
            lastName
          },
          {
            headers: {
              "Content-Type": "application/json"
            }
          }
        )
        .then(response => {
          if (response.data.registationSuccess) {
            app.userInfo.username = response.data.registeredRow[0].username;
            app.userInfo.id = response.data.registeredRow[0].id;
            app.userInfo.firstName = response.data.registeredRow[0].first_name;
            app.userInfo.lastName = response.data.registeredRow[0].last_name;
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
            this.setState({ regMessage: response.data.message });
            this.setState({ loading: false });
          }
        })
        .catch(error => {
          console.log("🚀 ~ file: login.jsx ~ line 53 ~ Login ~ handleSubmit ~ error", error);
        });
    }
  }

  checkValidForm() {
    const { username, password, firstName, lastName, confirmPass, validForm } = this.state;

    if (username && password && firstName && lastName && confirmPass && validForm) {
      this.setState({ formPostable: true });
    }
  }

  confirmPassCheck() {
    const { password, confirmPass } = this.state;
    if (password !== confirmPass || confirmPass === "") {
      const hash = { validForm: false };
      this.setState(hash);
    } else {
      const hash = { validForm: true };
      this.setState(hash);
    }
  }

  render() {
    const { history, match } = this.props;
    const { validForm, regMessage, formPostable, loading } = this.state;
    return (
      <>
        <Header history={history} match={match} />

        <div className="registration-container">
          {loading ? (
            <div className="login-container_inner loading-container">
              <ScaleLoader color="#000000" loading={loading} size={350} />
            </div>
          ) : (
            <div className="login-container_inner">
              <h2 className="login-header">Register</h2>
              <div className="form-group">
                <TextField
                  type="email"
                  className="login-input"
                  label="Username"
                  name="username"
                  autoComplete="off"
                  onChange={e => this.handleChange(e)}
                />
              </div>

              <div className="form-group">
                <TextField
                  type="text"
                  className="login-input"
                  label="First Name"
                  name="firstName"
                  autoComplete="off"
                  onChange={e => this.handleChange(e)}
                />
              </div>

              <div className="form-group">
                <TextField
                  type="text"
                  className="login-input"
                  label="Last Name"
                  name="lastName"
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
                  autoComplete="off"
                  onChange={e => this.handleChange(e)}
                />
              </div>

              <div className="form-group">
                <TextField
                  type="password"
                  className="login-input"
                  label="Confirm Password"
                  name="confirmPass"
                  autoComplete="off"
                  onChange={e => this.handleChange(e)}
                />
                {!validForm ? (
                  <div className="error-div">
                    <span>Passwords Do Not Match</span>
                  </div>
                ) : (
                  <div className="error-div-empty" />
                )}
              </div>

              <div className="form-group">
                <input
                  className="submit-btn"
                  type="submit"
                  value="Submit"
                  onClick={this.handleSubmit}
                  disabled={!formPostable}
                />
              </div>

              <div className="reg-fail">{regMessage}</div>
            </div>
          )}
        </div>
      </>
    );
  }
}

Registration.propTypes = {
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    ...state.app
  };
};

export default connect(mapStateToProps)(Registration);
