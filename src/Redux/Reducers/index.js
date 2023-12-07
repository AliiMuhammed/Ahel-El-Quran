// reducers/index.js (or wherever you combine reducers)
import { combineReducers } from "redux";
import readerReducer from "./reader-reducer"; // Import your individual reducers
import locationReducer from "./location-reducer";
const rootReducer = combineReducers({
  reader: readerReducer,
  location: locationReducer,
});

export default rootReducer;
