// readerReducer.js
import { SET_READER_DATA } from "../actionTypes";

const storedReaderData = JSON.parse(localStorage.getItem("readerData"));
const initialState = storedReaderData || {};

const readerReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_READER_DATA:
      const newState = action.payload;
      localStorage.setItem("readerData", JSON.stringify(newState)); // Store in localStorage
      return newState;
    default:
      return state;
  }
};

export default readerReducer;
