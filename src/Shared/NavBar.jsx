import React, { useEffect, useState } from "react";
import "../Style/navBar.css";
import { Link, NavLink } from "react-router-dom";
import logo from "../Assets/logos/لوجو2.png";

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
    <>
      <header>
        <nav className={navClass}>
          <div className="container">
            <Link to={"/"} className="logo-link">
              <img src={logo} alt="logo" />
            </Link>
            <div className="nav-links">
              <ul className="links">
                <li className="link">
                  <NavLink to={"/"}>الرئيسية</NavLink>
                </li>
                <li className="link">
                  <NavLink to={"cat"}>الأقسام</NavLink>
                </li>
                <li className="link">
                  <NavLink to={"/aboutUs"}>من نحن</NavLink>
                </li>
                <li className="link">
                  <NavLink to={"contactUs"}>تواصل معنا</NavLink>
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
    </>
  );
};

export default NavBar;
