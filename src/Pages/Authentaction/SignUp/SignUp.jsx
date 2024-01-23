import React, { useState } from "react";
import { MdEmail } from "react-icons/md";
import { FaLock, FaImage } from "react-icons/fa";
import { IoEyeOff, IoEye } from "react-icons/io5";
import { IoMdPerson } from "react-icons/io";
import Form from "react-bootstrap/Form";
import "./style/signUp.css";
import Alert from "../../../Shared/components/Alert";
import { Link } from "react-router-dom";

const SignUp = () => {
  const [showPass, setShowPass] = useState("password");
  const [showAlert, setShowAlert] = useState(false);

  const handleShowPass = (e) => {
    e.preventDefault();
    setShowPass(showPass === "password" ? "text" : "password");
  };
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    profileImage: null,
    fav: {},
  });
  const [errors, setErrors] = useState({});
  const [selectedFileName, setSelectedFileName] = useState("");
  const handleFileButtonClick = (e) => {
    e.preventDefault();
    document.getElementById("getImage").click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const fileValue = file.name;

      setSelectedFileName(fileValue);

      setFormData((prevData) => ({
        ...prevData,
        profileImage: file,
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        profileImage: null,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateImage = (file) => {
    const allowedExtensions = ["jpg", "jpeg", "png"];
    const extension = file.name.split(".").pop().toLowerCase();

    if (!allowedExtensions.includes(extension)) {
      return "*الصورة الشخصية يجب أن تكون: jpg, jpeg, png";
    }

    if (file.size > 1024 * 1024) {
      return "حجم الصورة الشخصية يجب أن يكون أقل من *1MB";
    }

    return null; // No error
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    const newErrors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = "*الاسم الأول مطلوب";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "*الاسم الأخير مطلوب";
    }
    if (!formData.email.trim()) {
      newErrors.email = "*البريد الإلكتروني مطلوب";
    } else if (
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(
        formData.email.trim()
      )
    ) {
      newErrors.email = "*البريد الإلكتروني غير صالح";
    }
    if (!formData.password.trim()) {
      newErrors.password = "*كلمة السر مطلوبة";
    }

    if (!formData.profileImage) {
      newErrors.profileImage = "*صورة الملف الشخصي مطلوبة";
    } else {
      const imageError = validateImage(formData.profileImage);
      if (imageError) {
        newErrors.profileImage = imageError;
      }
    }

    if (Object.keys(newErrors).length === 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const newUser = {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password,
          profileImage: reader.result, // Store the data URL
          fav: {},
        };
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        setSelectedFileName("");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          profileImage: null,
        });
        setShowAlert(true);
        setErrors({});
      };

      reader.readAsDataURL(formData.profileImage);
    } else {
      setShowAlert(false);
      setErrors(newErrors);
    }
  };

  return (
    <section className="signUp-section">
      <div className="container">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-title">إنشاء حساب جديد</div>
          {showAlert && (
            <Alert
              variant={"warning"}
              msg={"تم إنشاء حسابك بنجاح"}
              className="alert-form"
            />
          )}
          <div className="names">
            <div className="message-wrapper">
              <div className="input-container">
                <IoMdPerson />
                <Form.Control
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="الاسم الأول"
                />
              </div>
              {errors.firstName && (
                <div className="error-message">{errors.firstName}</div>
              )}
            </div>
            <div className="message-wrapper">
              <div className="input-container">
                <IoMdPerson />
                <Form.Control
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="الاسم الأخير"
                />
              </div>
              {errors.lastName && (
                <div className="error-message">{errors.lastName}</div>
              )}
            </div>
          </div>

          <div className="form-img">
            <div className="input-container">
              <button onClick={handleFileButtonClick}>
                <FaImage />
                اختر ملف
              </button>

              <p>{selectedFileName || "الصورة الشخصية"}</p>
              <Form.Control
                id="getImage"
                type="file"
                name="profileImage"
                onChange={handleFileChange}
              />
            </div>
            {errors.profileImage && (
              <div className="error-message">{errors.profileImage}</div>
            )}
          </div>
          <div className="input-container">
            <MdEmail />
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={`البريد الألكتروني`}
            />
          </div>
          {errors.email && <div className="error-message">{errors.email}</div>}
          <div className="input-container">
            <FaLock />
            <Form.Control
              type={showPass}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="كلمة السر"
            />
            <button onClick={handleShowPass}>
              {showPass === "password" ? <IoEyeOff /> : <IoEye />}
            </button>
          </div>
          {errors.password && (
            <div className="error-message">{errors.password}</div>
          )}
          <div className="already">
            لديك حساب بالفعل؟ <Link to={"/login"}>تسجيل الدخول</Link>
          </div>
          <button className="main-btn form-btn" type="submit">
            إنشاء حساب
          </button>
        </form>
      </div>
    </section>
  );
};

export default SignUp;
