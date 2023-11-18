import React from "react";
import PropTypes from "prop-types";
import "../Style/mianHeading.css";
import { Link } from "react-router-dom";

const translationMap = {
  نحن: "من نحن",
  تواصل: "تواصل معنا",
  بث: "البث المباشر",
  القرآن: "القرآن الكريم",
};

const MainHeading = ({ title, breadcrumb }) => {
  const keys = Object.keys(breadcrumb || {});
  const totalLinks = keys.length;

  const breadcrumbElements = keys.map((key, index) => {
    const translatedKey = translationMap[key] || key;
    const isLastElement = index === totalLinks - 1;

    return (
      <React.Fragment key={key}>
        <li>
          {isLastElement ? (
            <span>{translatedKey}</span>
          ) : (
            <Link to={breadcrumb[key]}>{translatedKey}</Link>
          )}
        </li>
        {index < totalLinks - 1 && <li>/</li>}
      </React.Fragment>
    );
  });

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

MainHeading.propTypes = {
  title: PropTypes.string.isRequired,
  breadcrumb: PropTypes.objectOf(PropTypes.string).isRequired,
};

export default MainHeading;
