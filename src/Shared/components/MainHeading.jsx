import React from "react";
import "../Style/mianHeading.css";
const MainHeading = ({ title }) => {
  return (
    <div className="main-heading">
      <div className="container">
        <h1 className="title-heading">{title}</h1>
      </div>
    </div>
  );
};

export default MainHeading;
