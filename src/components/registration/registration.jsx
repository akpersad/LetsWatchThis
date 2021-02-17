import React, { Component } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import store from "../../config/store";

class Registration extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      firstName: "",
      lastName: "",
      confirmPass: "",
      validForm: true
    };

    this.confirmPassCheck = this.confirmPassCheck.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const { target } = event;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const { name } = target;

    if (name !== "confirmPass") {
      this.setState({
        [name]: value
      });
    } else {
      this.setState(
        {
          [name]: value
        },
        () => {
          this.confirmPassCheck();
        }
      );
    }
  }

  handleSubmit() {
    const { validForm, username, password, firstName, lastName } = this.state;
    const { app } = store.getState();
    const { history } = this.props;

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
            history.push("/");
          } else {
            console.log(response.data.message);
          }
        })
        .catch(error => {
          console.log("🚀 ~ file: login.jsx ~ line 53 ~ Login ~ handleSubmit ~ error", error);
        });
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
    const { username, password, firstName, lastName, confirmPass, validForm } = this.state;
    return (
      <>
        <div className="form-group">
          <label htmlFor="test1">
            Username:
            <input
              id="test1"
              type="text"
              name="username"
              value={username}
              onChange={e => this.handleChange(e)}
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="fName">
            First Name:
            <input
              id="fName"
              type="text"
              name="firstName"
              value={firstName}
              onChange={e => this.handleChange(e)}
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="lName">
            Last Name:
            <input
              id="lName"
              type="text"
              name="lastName"
              value={lastName}
              onChange={e => this.handleChange(e)}
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="test2">
            Password:
            <input
              id="test2"
              type="password"
              name="password"
              value={password}
              onChange={e => this.handleChange(e)}
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="test3">
            Confirm Password:
            <input
              id="test3"
              type="password"
              name="confirmPass"
              value={confirmPass}
              onChange={e => this.handleChange(e)}
            />
          </label>
          {!validForm ? (
            <div className="error-div">
              <span>Passwords Do Not Match</span>
            </div>
          ) : (
            <div />
          )}
        </div>
        <input type="submit" value="Submit" onClick={this.handleSubmit} />
      </>
    );
  }
}

Registration.propTypes = {
  history: PropTypes.object.isRequired
};

const mapStateToProps = state => {
  return {
    ...state.app
  };
};

export default connect(mapStateToProps)(Registration);
