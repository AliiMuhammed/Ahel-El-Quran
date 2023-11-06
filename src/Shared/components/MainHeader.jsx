import React from "react";
import "../Style/mainHeader.css";
const MainHeader = ({ smHeader, Header }) => {
  return (
    <div className="main-header">
      <div className="container">
        <h4>{smHeader}</h4>
        <h1>{Header}</h1>
      </div>
    </div>
  );
};

export default MainHeader;
