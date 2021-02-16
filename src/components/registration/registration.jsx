import React, { Component } from "react";
import axios from "axios";
// import PropTypes from "prop-types";

class Registration extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
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
    const { validForm, username, password } = this.state;

    if (validForm) {
      axios
        .post(
          "/api/registration",
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
          console.log("🚀 ~ file: login.jsx ~ line 50 ~ Login ~ .then ~ response", response.data);
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
    const { username, password, confirmPass, validForm } = this.state;
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

export default Registration;
