import {
  REQUEST_LOCATION,
  RECEIVE_LOCATION,
  LOCATION_ERROR,
  SET_LOCATION,
} from "../actionTypes";
export const requestLocation = () => ({
  type: REQUEST_LOCATION,
});

export const receiveLocation = (location) => ({
  type: RECEIVE_LOCATION,
  payload: location,
});

export const locationError = (error) => ({
  type: LOCATION_ERROR,
  payload: error,
});

export const setLocation = (location) => ({
  type: SET_LOCATION,
  payload: location,
});

export const fetchLocation = () => {
  return (dispatch) => {
    dispatch(requestLocation());
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(receiveLocation({ latitude, longitude }));
          localStorage.setItem(
            "location",
            JSON.stringify({ latitude, longitude })
          );
        },
        (error) => {
          dispatch(locationError(error.message));
        }
      );
    } else {
      dispatch(locationError("Geolocation is not supported by this browser."));
    }
  };
};

export const loadLocationFromStorage = () => {
  return (dispatch) => {
    const storedLocation = JSON.parse(localStorage.getItem("location"));
    if (storedLocation) {
      dispatch(setLocation(storedLocation));
    }
  };
};
