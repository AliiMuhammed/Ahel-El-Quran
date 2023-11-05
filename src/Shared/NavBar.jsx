import React, { useEffect, useState } from "react";
import "../Style/navBar.css";
import { Link, NavLink } from "react-router-dom";
import logo from "../Assets/logos/لوجو2.png";
import { AiFillCaretDown } from "react-icons/ai";
const NavBar = () => {
  const [navScroll, setNavScroll] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY >= (10 * window.innerHeight) / 100) {
        setNavScroll(true);
      } else {
        setNavScroll(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navClass = navScroll ? "nav-scroll" : "";

  return (
    <header>
      <nav className={navClass}>
        <div className="container">
          <Link to={"/"} className="logo-link">
            <img src={logo} alt="logo" />
          </Link>
          <div className="nav-links">
            <ul className="links">
              <li className="link">
                <div className="nav-link">
                  <NavLink to={"/"}>الرئيسية</NavLink>
                </div>
              </li>
              <li className="link menu">
                <span>
                  <AiFillCaretDown /> الأقسام
                </span>
                <div className="drop-down">
                  <ul className="drop-down-list">
                    <li className="drop-link">
                      <NavLink to={""}>القرآن الكريم</NavLink>
                    </li>
                    <li className="drop-link">
                      <NavLink to={""}>الراديو</NavLink>
                    </li>
                    <li className="drop-link">
                      <NavLink to={""}>بث مباشر</NavLink>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="link">
                <div className="nav-link">
                  <NavLink to={"/aboutUs"}>من نحن</NavLink>
                </div>
              </li>
              <li className="link">
                <div className="nav-link">
                  <NavLink to={"contactUs"}>تواصل معنا</NavLink>
                </div>
              </li>
            </ul>
          </div>

          <div className="nav-btns">
            <Link to={""} className="main-btn">
              تسجيل الدخول
            </Link>
            <Link to={""} className="main-btn second-btn">
              الأشتراك
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
