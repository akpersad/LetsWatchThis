import React, { Component } from "react";
import axios from "axios";
// import PropTypes from "prop-types";

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
        console.log("🚀 ~ file: login.jsx ~ line 50 ~ Login ~ .then ~ response", response.data);
      })
      .catch(error => {
        console.log("🚀 ~ file: login.jsx ~ line 53 ~ Login ~ handleSubmit ~ error", error);
      });
  }

  render() {
    const { username, password } = this.state;
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
        <input type="submit" value="Submit" onClick={this.handleSubmit} />
      </>
    );
  }
}

export default Login;
