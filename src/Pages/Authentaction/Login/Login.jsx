import React, { useState } from "react";
import "./style/login.css";
import Form from "react-bootstrap/Form";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { IoEyeOff, IoEye } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import Alert from "../../../Shared/components/Alert";

const Login = () => {
  const navgate = useNavigate();
  const [showPass, setShowPass] = useState("password");
  const [showAlert, setShowAlert] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Clear previous error messages when the user types
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: null,
    }));
  };

  const users = JSON.parse(localStorage.getItem("users")) || [];

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "البريد الإلكتروني مطلوب";
    } else if (
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
        formData.email.trim()
      )
    ) {
      newErrors.email = "البريد الإلكتروني غير صالح";
    }

    if (!formData.password.trim()) {
      newErrors.password = "كلمة السر مطلوبة";
    }

    if (Object.keys(newErrors).length === 0) {
      const matchedUser = users.find(
        (user) =>
          user.email === formData.email && user.password === formData.password
      );

      if (matchedUser) {
        // Save the matched user data in localStorage
        localStorage.setItem("currentUser", JSON.stringify(matchedUser));

        // Redirect to the home page
        navgate("/");
      } else {
        setShowAlert(true);
        setErrors(newErrors);
      }
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <section className="login-section">
      <div className="container">
        <div className="form">
          <div className="form-title">تسجيل الدخول</div>
          {showAlert && (
            <Alert
              variant={"warning"}
              msg={"البريد الإلكتروني أو كلمة السر غير صحيحة"}
              className="alert-form"
            />
          )}
          <div className="input-container">
            <MdEmail />
            <Form.Control
              type="email"
              placeholder={`البريد الألكتروني`}
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          {errors.email && <div className="error-message">{errors.email}</div>}
          <div className="input-container">
            <FaLock />
            <Form.Control
              type={showPass}
              placeholder="كلمة السر"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <button
              onClick={() => {
                setShowPass(showPass === "password" ? "text" : "password");
              }}
            >
              {showPass === "password" ? <IoEyeOff /> : <IoEye />}
            </button>
          </div>
          {errors.password && (
            <div className="error-message">{errors.password}</div>
          )}
          <div className="already">
            ليس لديك حساب؟<Link to={"/sign-up"}>إنشاء حساب جديد</Link>
          </div>
          <button
            className="main-btn form-btn"
            type="submit"
            onClick={handleSubmit}
          >
            تسجيل الدخول
          </button>
        </div>
      </div>
    </section>
  );
};

export default Login;
