// reducers/favoriteReducer.js
import { ADD_FAVORITE_SURAH, REMOVE_FAVORITE_SURAH } from "../actionTypes.js";

const initialState = {};

const favoriteReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_FAVORITE_SURAH:
      return {
        ...state,
        [action.payload.uniqueKey]: action.payload,
      };
    case REMOVE_FAVORITE_SURAH:
      const newState = { ...state };
      delete newState[action.payload];
      return newState;
    default:
      return state;
  }
};

export default favoriteReducer;
