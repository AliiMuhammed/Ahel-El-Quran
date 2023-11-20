import React from "react";
import Alert from 'react-bootstrap/Alert';

const alert = ({ variant, msg }) => {
  return (
    <section className="alert-section">
      <div className="container">
        <Alert variant={variant}>{msg}</Alert>
      </div>
    </section>
  );
};



export default alert;
