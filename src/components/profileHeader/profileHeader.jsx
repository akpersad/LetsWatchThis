import React, { Component } from "react";
import { connect } from "react-redux";
import { AvatarGenerator } from "random-avatar-generator";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

class ProfileHeader extends Component {
  constructor() {
    super();
    this.state = {
      imgSrc:
        "https://avataaars.io/?avatarStyle=Circle&topType=ShortHairShortFlat&accessoriesType=Wayfarers&hairColor=Black&facialHairType=BeardLight&facialHairColor=Black&clotheType=BlazerShirt&eyeType=Dizzy&eyebrowType=DefaultNatural&mouthType=Smile&skinColor=Brown"
    };
  }

  componentDidMount() {
    const generator = new AvatarGenerator();

    // Simply get a random avatar
    this.setState({ imgSrc: generator.generateRandomAvatar() });
  }

  render() {
    const { imgSrc } = this.state;
    const { userInfo } = this.props;
    return (
      <div className="profile-header-container container">
        <div className="image-container">
          <img className="profile-image" src={imgSrc} alt="Profile Logo " />
        </div>
        <div className="info-container">
          <div className="name-line">
            <h3 className="name-header">
              <span>{userInfo.firstName}</span>
              <span className="last-name-span">{userInfo.lastName}</span>
            </h3>
          </div>
          <div className="email-line">
            <h4 className="email-header">{userInfo.username}</h4>
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

ProfileHeader.propTypes = {
  userInfo: PropTypes.object.isRequired
};

export default connect(mapStateToProps)(ProfileHeader);
