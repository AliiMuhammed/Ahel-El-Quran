export const REQUEST_LOCATION = 'REQUEST_LOCATION';
export const RECEIVE_LOCATION = 'RECEIVE_LOCATION';
export const LOCATION_ERROR = 'LOCATION_ERROR';

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
