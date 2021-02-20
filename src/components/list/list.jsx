import React, { Component } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { connect } from "react-redux";
import store from "../../config/store";

class List extends Component {
  // Fetch the list on first mount
  componentDidMount() {
    console.log("NOW");
    this.getList();
  }

  // Retrieves the list of items from the Express app
  getList() {
    const { app } = store.getState();
    axios.get("/api/shows?limit=125").then(res => {
      app.showList = res.data;

      store.dispatch({
        type: "INITIAL_STATE",
        payload: app
      });
    });
  }

  setList() {
    const { showList } = this.props;

    return showList.map(item => {
      return <li key={item.id}>{item.title}</li>;
    });
  }

  render() {
    return (
      <div className="App">
        <h1>List of Shows</h1>
        <ul>{this.setList()}</ul>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    ...state.app
  };
};

List.propTypes = {
  showList: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(List);
