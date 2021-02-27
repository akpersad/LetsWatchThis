import React, { Component } from "react";
import { connect } from "react-redux";
import { AvatarGenerator } from "random-avatar-generator";
import { Link } from "react-router-dom";
// import PropTypes from "prop-types";

class ProfileHeader extends Component {
  constructor() {
    super();
    this.state = {
      imgSrc: ""
    };
  }

  componentDidMount() {
    const generator = new AvatarGenerator();

    // Simply get a random avatar
    this.setState({ imgSrc: generator.generateRandomAvatar() });
  }

  render() {
    const { imgSrc } = this.state;
    return (
      <div className="profile-header-container container">
        <div className="image-container">
          <img className="profile-image" src={imgSrc} alt="Profile Logo " />
        </div>
        <div className="info-container">
          <div className="name-line">
            <h3 className="name-header">Andrew Persad</h3>
          </div>
          <div className="email-line">
            <h4 className="email-header">akpersad@gmail.com</h4>
          </div>
          <div className="link-line">
            <h5 className="link-header">
              <Link className="link" to="/choices">
                <span data-content="What to watch?">What to watch?</span>
              </Link>
            </h5>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.app
  };
};

// ProfileHeader.propTypes = {
//   history: PropTypes.object.isRequired,
//   match: PropTypes.object.isRequired
// };

export default connect(mapStateToProps)(ProfileHeader);
