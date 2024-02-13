// reducers/index.js
import { combineReducers } from "redux";
import readerReducer from "./reader-reducer";
import locationReducer from "./location-reducer";
import favoriteReducer from "./favoriteReducer";

const rootReducer = combineReducers({
  reader: readerReducer,
  location: locationReducer,
  favSurah: favoriteReducer,
});

export default rootReducer;
