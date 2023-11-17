import React from "react";
import "../Style/mianHeading.css";
import { Link } from "react-router-dom";

const MainHeading = ({ title, breadcrumb }) => {
  const keys = Object.keys(breadcrumb);
  const totalLinks = keys.length;

  const breadcrumbElements = keys.map((key, index) => (
    <React.Fragment key={key}>
      <li>
        {index === totalLinks - 1 ? (
          <span>
            {key === "نحن" ? "من نحن" : key === "تواصل" ? "تواصل معنا" : key}
          </span>
        ) : (
          <Link to={breadcrumb[key]}>
            {key === "نحن" ? "من نحن" : key === "تواصل" ? "تواصل معنا" : key}
          </Link>
        )}
      </li>
      {index < totalLinks - 1 && <li>/</li>}
    </React.Fragment>
  ));

  return (
    <div className="main-heading">
      <div className="container">
        <h1 className="title-heading">{title}</h1>
        <div className="breadcrumb">
          <ul>{breadcrumbElements}</ul>
        </div>
      </div>
    </div>
  );
};

export default MainHeading;
