import React, { Component } from "react";
import axios from "axios";
// import PropTypes from "prop-types";

class Login extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      password: "",
      confirmPass: "",
      validForm: false
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
    debugger;
    if (validForm) {
      axios
        .post(
          "/api/checkpassword",
          {
            username,
            password
          },
          {
            headers: {
              "Content-Type": "text/plain"
            }
          }
        )
        .then(function(response) {
          debugger;
          console.log("🚀 ~ file: login.jsx ~ line 50 ~ Login ~ .then ~ response", response);
        })
        .catch(function(error) {
          debugger;
          console.log("🚀 ~ file: login.jsx ~ line 53 ~ Login ~ handleSubmit ~ error", error);
        });
    }
  }

  confirmPassCheck() {
    const { password, confirmPass } = this.state;
    if (password !== confirmPass) {
      console.log("DOES NOT MATCH", confirmPass);
    } else {
      const hash = { validForm: true };
      this.setState(hash);
    }
  }

  render() {
    const { username, password, confirmPass } = this.state;
    return (
      <>
        <form onSubmit={this.handleSubmit}>
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

          <label htmlFor="test2">
            Password:
            <input
              id="test2"
              type="text"
              name="password"
              value={password}
              onChange={e => this.handleChange(e)}
            />
          </label>

          <label htmlFor="test3">
            Confirm Password:
            <input
              id="test3"
              type="text"
              name="confirmPass"
              value={confirmPass}
              onChange={e => this.handleChange(e)}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </>
    );
  }
}

// Login.propTypes = {};

export default Login;
