import React from "react";
import Alert from "react-bootstrap/Alert";

const alert = ({ variant, msg }) => {
  return (
    <div className="alert-div">
      <Alert variant={variant}>{msg}</Alert>
    </div>
  );
};

export default alert;
