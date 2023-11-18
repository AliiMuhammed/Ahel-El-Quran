import React from "react";
import Spinner from "react-bootstrap/Spinner";

const Loader = () => {
  return (
    <div className="container spinner-container">
      <Spinner animation="border" className="spinner-loader" />
    </div>
  );
};

export default Loader;
