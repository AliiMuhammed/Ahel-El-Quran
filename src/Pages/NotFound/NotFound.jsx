import React from "react";
import logo from "../../Assets/logos/لوجو2.png";
import { Link } from "react-router-dom";
import "./style/notFound.css";
const NotFound = () => {
  return (
    <div className="notfound">
      <div className="container">
        <div className="logo">
          <img src={logo} alt="logo" />
        </div>
        <h1>عذراً لم يتم العثور علي هذة الصفحة!</h1>
        <Link to={"/"} className="main-btn">
          العودة الي الرئيسية
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
