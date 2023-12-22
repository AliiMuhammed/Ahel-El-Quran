import React from "react";
import "./style/login.css";
import Form from "react-bootstrap/Form";

const Login = () => {
  return (
    <section className="login-section">
      <div className="container">
        <div className="form">
          <Form.Control type="email" placeholder="البريد الإلكتروني" />
          <Form.Control type="password" placeholder="كلمة السر" />
          <button className="main-btn" type="submit">
            تسجيل الدخول
          </button>
        </div>
        <div className="img-login"></div>
      </div>
    </section>
  );
};

export default Login;
