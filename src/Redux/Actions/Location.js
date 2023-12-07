import axios from "axios";

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
          setTimeout(() => {
            const { latitude, longitude } = position.coords;
            axios
              .get(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
              )
              .then((response) => {
                const data = response.data;
                console.log("Full address data:", data);

                const city =
                  data.address.statew ||
                  data.address.town ||
                  data.address.village ||
                  data.address.county ||
                  "Unknown City";
                const country = data.address.country;
                console.log("City:", city);
                console.log("Country:", country);

                localStorage.setItem("userCity", city);
                localStorage.setItem("userCountry", country);
                dispatch(receiveLocation({ city, country }));
              })
              .catch((error) => {
                dispatch(locationError(error.message));
              });
          }, 2000); // Wait for 5 seconds before fetching the location
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
