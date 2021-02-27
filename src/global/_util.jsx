import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { AccountCircle } from "@material-ui/icons/";

import store from "../config/store";

export const getAllChildrenNodes = (element = document.body) => {
  return element.querySelectorAll("*");
};

// Inputs: Integer, Integer, HTML ELement, Integer, Function
export const setHeight = (start, to, element, duration, cb) => {
  if (start == null || to == null || element == null || duration == null || cb == null) {
    console.warn("Inputs: Integer, Integer, HTML Element, Integer, Function");
  } else {
    const change = to - start;
    let currentTime;

    const animateHeight = timestamp => {
      if (!currentTime) {
        currentTime = timestamp;
      }
      const progress = timestamp - currentTime;
      const parseIntValue = (progress / duration) * (change + start);
      const val = parseInt(parseIntValue, 10);

      element.setAttribute("style", `height:${val}px;`);
      if (progress < duration) {
        window.requestAnimationFrame(animateHeight);
      } else {
        cb();
      }
    };

    // set the height of the element before starting animation -> fix bug on Safari
    element.setAttribute("style", `height:${start}px;`);
    window.requestAnimationFrame(animateHeight);
  }
};

// Inputs: Array, HTML ELement
export const getIndexInArray = (array, el) => {
  return Array.prototype.indexOf.call(array, el);
};

// Inputs: HTML ELement, Object
export const setAttributes = (el, attrs) => {
  if (el == null || attrs == null) {
    console.warn("Make sure el (HTML Element) and attrs (Object {} ) are passed!");
  } else {
    for (const key in attrs) {
      if (attrs[key]) {
        el.setAttribute(key, attrs[key]);
      }
    }
  }
};

// Inputs: HTML ELement, String
export const hasClass = (el, className) => {
  if (el == null || className == null) {
    console.warn("Make sure el (HTML Element) and className (string) are passed!");
  } else {
    if (el.classList) {
      return el.classList.contains(className);
    }
    return !!el.className.match(new RegExp(`(\\s|^)${className}(\\s|$)`));
  }
  return true;
};

// Inputs: HTML ELement, String
export const addClass = (el, className) => {
  if (el == null || className == null) {
    console.warn("Make sure el (HTML Element) and className (string) are passed!");
  } else {
    const classList = className.split(" ");
    if (el.classList) {
      el.classList.add(classList[0]);
    } else if (!hasClass(el, classList[0])) {
      el.className += ` ${classList[0]}`;
    }
    if (classList.length > 1) {
      addClass(el, classList.slice(1).join(" "));
    }
  }
};

// Inputs: HTML ELement, String
export const removeClass = (el, className) => {
  if (el == null || className == null) {
    console.warn("Make sure el (HTML Element) and className (string) are passed!");
  } else {
    const classList = className.split(" ");
    if (el.classList) {
      el.classList.remove(classList[0]);
    } else if (hasClass(el, classList[0])) {
      const reg = new RegExp(`(\\s|^)${classList[0]}(\\s|$)`);
      el.className = el.className.replace(reg, " ");
    }
    if (classList.length > 1) {
      removeClass(el, classList.slice(1).join(" "));
    }
  }
};

export const swapClasses = (el, classNameToAdd, classNameToRemove) => {
  if (el == null || classNameToAdd == null || classNameToRemove == null) {
    console.warn(
      "Make sure el (HTML Element) and classNameToAdd / classNameToRemove (string) are passed!"
    );
  } else {
    addClass(el, classNameToAdd);
    removeClass(el, classNameToRemove);
  }
};

// Inputs: HTML ELement, String, Boolean
export const toggleClass = (el, className, bool) => {
  if (el == null || className == null) {
    console.warn("Make sure el (HTML Element) and className (string) are passed!");
  } else if (bool) {
    addClass(el, className);
  } else {
    removeClass(el, className);
  }
};

// Inputs: HTML ELement, String
export const getChildrenByClassName = (el, className) => {
  const childrenByClass = [];
  if (el == null || className == null) {
    console.warn("Make sure el (HTML Element) and className (string) are passed!");
  } else {
    for (let i = 0; i < el.children.length; i++) {
      if (hasClass(el.children[i], className)) {
        childrenByClass.push(el.children[i]);
      }
    }
    return childrenByClass;
  }
  return childrenByClass;
};

// Inputs: Integer, Integer, Function
export const scrollTo = (final, duration, cb) => {
  const start = window.scrollY || document.documentElement.scrollTop;
  let currentTime;

  const animateScroll = timestamp => {
    if (!currentTime) {
      currentTime = timestamp;
    }
    let progress = timestamp - currentTime;
    if (progress > duration) {
      progress = duration;
    }
    const val = Math.easeInOutQuad(progress, start, final - start, duration);

    window.scrollTo(0, val);

    if (progress < duration) {
      window.requestAnimationFrame(animateScroll);
    } else {
      cb();
    }
  };

  window.requestAnimationFrame(animateScroll);
};

// Move focus to an element
// Inputs: HTML ELement
export const moveFocus = element => {
  element.focus();
  if (document.activeElement !== element) {
    element.setAttribute("tabindex", "-1");
    element.focus();
  }
};

export const randomIdGen = () => {
  return Math.floor(Math.random() * Math.floor(999));
  // "https://i.picsum.photos/id/815/3360/1768.jpg?blur=1"
};

export const checkUserLoggedIn = () => {
  if (localStorage.getItem("isLoggedIn") && localStorage.getItem("isLoggedIn") === "true") {
    const { app } = store.getState();
    const userInfoLocal = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo"))
      : window.location.reload();
    app.userInfo.username = userInfoLocal.username;
    app.userInfo.firstName = userInfoLocal.firstName;
    app.userInfo.lastName = userInfoLocal.lastName;
    app.userInfo.id = userInfoLocal.id;
    app.isLoggedIn = true;

    store.dispatch({
      type: "INITIAL_STATE",
      payload: app
    });

    return true;
  }
  return false;
};

export const formatFriendList = () => {
  const { app } = store.getState();
  const formatList = app.friendList.map(item => {
    return (
      <Link key={item.id} to={`./matches/${item.id}`}>
        <li className="pending-request">
          <div className="name-section">
            <p className="names-line">
              <span className="first-name">{item.first_name}</span>
              <span className="last-name">{item.last_name}</span>
            </p>
            <p className="email-line">
              <span>{item.username}</span>
            </p>
          </div>
          <div className="btns-section">
            <AccountCircle />
          </div>
        </li>
      </Link>
    );
  });
  app.friendListFormatted = formatList;
  app.friendListLoading = false;

  store.dispatch({
    type: "INITIAL_STATE",
    payload: app
  });
};

export const getFriendsList = () => {
  const { app } = store.getState();
  const { userInfo } = app;

  app.friendListLoading = true;

  store.dispatch({
    type: "INITIAL_STATE",
    payload: app
  });

  axios.get(`/api/getfriendlist?userid=${userInfo.id}`).then(response => {
    if (response.data.hasFriends) {
      app.friendList = response.data.returnedRows;

      store.dispatch({
        type: "INITIAL_STATE",
        payload: app
      });

      formatFriendList();
    }
  });
};
