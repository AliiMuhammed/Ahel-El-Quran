import {
  REQUEST_LOCATION,
  RECEIVE_LOCATION,
  LOCATION_ERROR,
  SET_LOCATION,
} from "../actionTypes";

const storedLocation = JSON.parse(localStorage.getItem("location"));
const initialState = storedLocation || { latitude: "", longitude: "" };

const locationReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_LOCATION:
      // Handle request action
      return state;

    case RECEIVE_LOCATION:
      // Handle receive action
      return action.payload;

    case LOCATION_ERROR:
      // Handle error action
      return state;

    case SET_LOCATION:
      // Set location from localStorage
      return action.payload;

    default:
      return state;
  }
};

export default locationReducer;
