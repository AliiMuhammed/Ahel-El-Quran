import { REQUEST_LOCATION, RECEIVE_LOCATION, LOCATION_ERROR } from '../Actions/Location';

const initialState = {
  location: null,
  error: null,
  isLoading: false,
};

const locationReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_LOCATION:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case RECEIVE_LOCATION:
      return {
        ...state,
        isLoading: false,
        location: action.payload,
      };
    case LOCATION_ERROR:
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

export default locationReducer;
