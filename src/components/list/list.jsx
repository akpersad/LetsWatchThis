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
    axios.get("/api/users").then(res => {
      // res.data;
      console.log("🚀 ~ file: list.jsx ~ line 14 ~ List ~ axios.get ~ res", res.data);

      app.testList = res.data;

      store.dispatch({
        type: "INITIAL_STATE",
        payload: app
      });
    });
  }

  render() {
    const { testList } = this.props;
    return (
      <div className="App">
        <h1>List of Items</h1>
        {testList.length ? (
          <div>
            {testList.map(item => {
              return <div>{item}</div>;
            })}
          </div>
        ) : (
          <div>
            <h2>No List Items Found</h2>
          </div>
        )}
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
  testList: PropTypes.array.isRequired
};

export default connect(mapStateToProps)(List);
