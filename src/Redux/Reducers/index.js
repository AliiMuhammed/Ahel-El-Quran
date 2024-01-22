// reducers/index.js
import { combineReducers } from "redux";
import readerReducer from "./reader-reducer";
import locationReducer from "./location-reducer";

const rootReducer = combineReducers({
  reader: readerReducer,
  location: locationReducer,
});

export default rootReducer;
