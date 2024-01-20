import React, { useState } from "react";
import "./style/login.css";
import Form from "react-bootstrap/Form";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { IoEyeOff } from "react-icons/io5";
import { IoEye } from "react-icons/io5";

const Login = () => {
  const [showPass, setShowPass] = useState("password");
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
            <Form.Control type={showPass} placeholder="كلمة السر" />
            <button
              onClick={() => {
                setShowPass(showPass === "password" ? "text" : "password");
              }}
            >
              {showPass === "password" ? <IoEyeOff /> : <IoEye />}
            </button>
          </div>
          <button className="main-btn form-btn" type="submit">
            تسجيل الدخول
          </button>
        </div>
      </div>
    </section>
  );
};

export default Login;
