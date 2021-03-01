import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faLinkedin, faSalesforce, faGithub } from "@fortawesome/free-brands-svg-icons";

class Footer extends Component {
  constructor() {
    super();
    this.state = {
      socialLinks: [
        {
          href: "https://twitter.com/akpersad",
          class: "social_twitter",
          icon: faTwitter
        },
        {
          href: "https://www.linkedin.com/in/andrew-persad-aa496432/",
          class: "social_linkedin",
          icon: faLinkedin
        },
        {
          href: "https://trailblazer.me/id/apersad",
          class: "social_salesforce",
          icon: faSalesforce
        },
        {
          href: "https://github.com/akpersad/",
          class: "social_github",
          icon: faGithub
        }
      ]
    };
  }

  formatSocialLinks() {
    const { socialLinks } = this.state;
    return socialLinks.map(item => {
      return (
        <a
          key={item.class}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className={item.class}
        >
          <FontAwesomeIcon icon={item.icon} size="lg" />
        </a>
      );
    });
  }

  render() {
    return (
      <footer className="footer-container">
        <div className="social-container">{this.formatSocialLinks()}</div>
        <span>Made by Me! © 2021</span>
      </footer>
    );
  }
}

export default Footer;
