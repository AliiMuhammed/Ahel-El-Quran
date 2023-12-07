import { createStore } from "redux";
import rootReducer from "./Reducers/index"; // Import your combined reducers

const store = createStore(rootReducer);

export default store;
