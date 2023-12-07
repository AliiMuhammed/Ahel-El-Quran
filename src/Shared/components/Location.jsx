import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { receiveLocation, locationError } from '../../Redux/Actions/Location'; // Import your action creators

const Location = ({ location, isLoading, error, receiveLocation, locationError }) => {
  useEffect(() => {
    const storedLocation = localStorage.getItem('userLocation');
    if (!location && storedLocation) {
      const parsedLocation = JSON.parse(storedLocation);
      receiveLocation(parsedLocation);
    } else if (!location) {
      getLocation();
    }
  }, [location, receiveLocation]);

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          localStorage.setItem('userLocation', JSON.stringify(userLocation));
          receiveLocation(userLocation);
        },
        (error) => {
          locationError(error.message);
        }
      );
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div>
      {/* Your UI to display location, loading, and errors */}
    </div>
  );
};

const mapStateToProps = (state) => ({
  location: state.locationReducer ? state.locationReducer.location : null,
  isLoading: state.locationReducer ? state.locationReducer.isLoading : false,
  error: state.locationReducer ? state.locationReducer.error : null,
});

const mapDispatchToProps = {
  receiveLocation,
  locationError,
};

export default connect(mapStateToProps, mapDispatchToProps)(Location);
