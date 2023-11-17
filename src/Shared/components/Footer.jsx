import React from "react";
import "../Style/footer.css";
import logo from "../../Assets/logos/لوجو2.png";
import { Link } from "react-router-dom";
import { FaWhatsapp, FaLinkedinIn } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { FiGithub } from "react-icons/fi";

const Footer = () => {
  const newArabicDate = new Date().toLocaleDateString("ar", {
    year: "numeric",
    numberingSystem: "arab",
  });

  return (
    <footer>
      <div className="top">
        <div className="container">
          <div className="col">
            <div className="logo">
              <img src={logo} alt="logo" />
            </div>
            <div className="bref">
              <p>
                أهل القرآن الموقع الذي يقدم لك الأذكار اليومية ومواقيت الصلاة
                بسهولة. استمع إلى تلاوات القرآن وتصفح تفاسيره للتقرب إلى الله
                وتعزيز إيمانك.
              </p>
            </div>
          </div>
          <div className="col">
            <h2>روابط سريعة</h2>
            <ul className="links-footer">
              <li>
                <Link to={"/"}>الرئيسية</Link>
              </li>
              <li>
                <Link to={"/aboutUs"}>من نحن</Link>
              </li>
              <li>
                <Link to={"/contactUs"}>تواصل معنا</Link>
              </li>
            </ul>
          </div>
          <div className="col">
            <h2>الأقسام</h2>
            <ul className="links-footer">
              <li>
                <Link to={"/"}>القرآن الكريم</Link>
              </li>
              <li>
                <Link to={"/"}>الأذكار</Link>
              </li>
              <li>
                <Link to={"/"}>الراديو</Link>
              </li>
              <li>
                <Link to={"/"}>بث مباشر</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bottom">
        <div className="container">
          <div className="col">
            جميع الحقوق محفوظة &copy; {newArabicDate} - أهل القرآن
          </div>
          <div className="col">
            <div className="icons">
              <Link
                to={
                  "https://api.whatsapp.com/send/?phone=201066567630&text=Hi%20Ali!&type=phone_number&app_absent=0"
                }
                target="_blank"
              >
                <FaWhatsapp />
              </Link>
              <Link to="mailto:ali.muhammed.dev@gmail.com">
                <IoMail />
              </Link>
              <Link to={"https://www.linkedin.com/in/ali-muhammed-dev/"}>
                <FaLinkedinIn />
              </Link>
              <Link to={"https://github.com/AliiMuhammed"}>
                <FiGithub />
              </Link>
            </div>
          </div>
          <div className="col">
            تم تطويره بواسطة <span>علي محمد</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
