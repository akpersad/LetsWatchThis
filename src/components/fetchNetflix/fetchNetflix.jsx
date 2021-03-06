// import axios from "axios";
import store from "../../config/store";
import { dummyResults } from "../../global/dummyData";

export const fetchNetflix = () => {
  const { app } = store.getState();
  // const options = {
  //   method: "GET",
  //   url: "https://unogsng.p.rapidapi.com/search",
  //   params: {
  //     start_year: "2010",
  //     orderby: "rating",
  //     audiosubtitle_andor: "and",
  //     subtitle: "english",
  //     countrylist: "78",
  //     audio: "english",
  //     offset: "0",
  //     end_year: "2021"
  //   },
  //   headers: {
  //     "x-rapidapi-host": "unogsng.p.rapidapi.com"
  //   }
  // };

  // axios
  //   .request(options)
  //   .then(function(response) {
  //     console.log("🚀 ~ file: fetchNetflix.jsx ~ line 25 ~ .then ~ response", response.data);

  //     store.dispatch({
  //       type: "INITIAL_STATE",
  //       payload: response.data
  //     });
  //   })
  //   .catch(function(error) {
  //     console.error(error);
  //   });

  app.initialHash = dummyResults;

  store.dispatch({
    type: "INITIAL_STATE",
    payload: app
  });
};
