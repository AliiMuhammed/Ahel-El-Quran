import React, { useEffect, useRef, useState } from "react";
import "../Style/navBar.css";
import { Link, NavLink } from "react-router-dom";
import logo from "../../Assets/logos/لوجو2.png";
import { AiOutlineClose } from "react-icons/ai";
import { FaBarsStaggered } from "react-icons/fa6";
import { FaAngleDown } from "react-icons/fa";

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

  const [show, setShow] = useState("");
  const handelShow = () => {
    setShow(show === "" ? "show" : "");
    setShowDrop("");
  };

  const navRef = useRef(null);

  const handleDocumentClick = (e) => {
    if (navRef.current && !navRef.current.contains(e.target)) {
      setShow("");
      setShowDrop("");
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, []);

  const [showDrop, setShowDrop] = useState("");

  const handelDrop = () => {
    setShowDrop(showDrop === "" ? "show" : "");
  };

  return (
    <header>
      <nav className={navClass} ref={navRef}>
        <div className="container">
          <Link
            to={"/"}
            onClick={() => {
              setShow("");
            }}
            className="logo-link"
          >
            <img src={logo} alt="logo" />
          </Link>
          <div className={`nav-links ${show}`}>
            <ul className="links">
              <li className="link">
                <div className="nav-link">
                  <NavLink onClick={handelShow} to={"/"}>
                    الرئيسية
                  </NavLink>
                </div>
              </li>
              <li className="link menu" onClick={handelDrop} ref={navRef}>
                <span>
                  الأقسام <FaAngleDown />
                </span>
                <div className={`drop-down ${showDrop}`}>
                  <ul className="drop-down-list">
                    <li className="drop-link">
                      <NavLink onClick={handelShow} to={""}>
                        القرآن الكريم
                      </NavLink>
                    </li>
                    <li className="drop-link">
                      <NavLink onClick={handelShow} to={""}>
                        الأذكار
                      </NavLink>
                    </li>
                    <li className="drop-link">
                      <NavLink onClick={handelShow} to={""}>
                        الراديو
                      </NavLink>
                    </li>
                    <li className="drop-link">
                      <NavLink onClick={handelShow} to={""}>
                        بث مباشر
                      </NavLink>
                    </li>
                  </ul>
                </div>
              </li>
              <li className="link">
                <div className="nav-link">
                  <NavLink onClick={handelShow} to={"/aboutUs"}>
                    من نحن
                  </NavLink>
                </div>
              </li>
              <li className="link">
                <div className="nav-link">
                  <NavLink onClick={handelShow} to={"contactUs"}>
                    تواصل معنا
                  </NavLink>
                </div>
              </li>
            </ul>
          </div>

          <div className={`nav-btns ${show}`}>
            <Link onClick={handelShow} to={""} className="main-btn sm">
              تسجيل الدخول
            </Link>
            <Link
              onClick={handelShow}
              to={""}
              className="main-btn second-btn sm"
            >
              مستخدم جديد
            </Link>
          </div>

          <button
            className="toggle-btn"
            onClick={(e) => {
              handelShow();
              e.stopPropagation(); // Prevent event propagation
            }}
          >
            {!show ? <FaBarsStaggered /> : <AiOutlineClose />}
          </button>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
