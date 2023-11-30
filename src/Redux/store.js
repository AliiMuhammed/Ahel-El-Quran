// store.js

import { legacy_createStore } from "redux";
import readerReducer from "./Reducers/reader-reducer";

const store = legacy_createStore(readerReducer);

export default store;
