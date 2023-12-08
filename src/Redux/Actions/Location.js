export const REQUEST_LOCATION = "REQUEST_LOCATION";
export const RECEIVE_LOCATION = "RECEIVE_LOCATION";
export const LOCATION_ERROR = "LOCATION_ERROR";

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

export const fetchLocation = () => {
  return (dispatch) => {
    dispatch(requestLocation());
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          localStorage.setItem("userLatitude", latitude);
          localStorage.setItem("userLongitude", longitude);
          dispatch(receiveLocation({ latitude, longitude }));
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
