import React, { useEffect } from "react";
import { connect } from "react-redux";
import { fetchLocation } from "../../Redux/Actions/Location"; // Update import

const Location = ({
  location,
  isLoading,
  error,
  fetchLocation, // Update props
}) => {
  useEffect(() => {
    fetchLocation(); // Dispatch the fetchLocation action on mount
  }, [fetchLocation]); // Pass fetchLocation as a dependency

  return (
    <div>
      {/* Your UI to display location, loading, and errors */}
      {isLoading && <p>Loading...</p>}
      {location && (
        <div>
          <p>City: {location.city}</p>
          <p>Country: {location.country}</p>
        </div>
      )}
      {error && <p>Error: {error}</p>}
    </div>
  );
};

const mapStateToProps = (state) => ({
  location: state.locationReducer ? state.locationReducer.location : null,
  isLoading: state.locationReducer ? state.locationReducer.isLoading : false,
  error: state.locationReducer ? state.locationReducer.error : null,
});

const mapDispatchToProps = {
  fetchLocation, // Use fetchLocation action
};

export default connect(mapStateToProps, mapDispatchToProps)(Location);
