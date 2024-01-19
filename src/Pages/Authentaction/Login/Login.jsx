import React from "react";
import "./style/login.css";
import Form from "react-bootstrap/Form";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";

const Login = () => {
  return (
    <section className="login-section">
      <div className="container">
        <div className="form">
          <div className="form-title">تسجيل الدخول</div>
          <div className="input-container">
            <MdEmail />
            <Form.Control type="email" placeholder={`البريد الألكتروني`} />
          </div>
          <div className="input-container">
            <FaLock />
            <Form.Control type="password" placeholder="كلمة السر" />
          </div>
          <button className="main-btn" type="submit">
            تسجيل الدخول
          </button>
        </div>
      </div>
    </section>
  );
};

export default Login;
