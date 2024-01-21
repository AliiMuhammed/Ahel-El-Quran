import React, { useEffect, useRef, useState } from "react";
import "../Style/navBar.css";
import { Link, NavLink } from "react-router-dom";
import logo from "../../Assets/logos/لوجو2.png";
import { AiOutlineClose } from "react-icons/ai";
import { FaBarsStaggered } from "react-icons/fa6";
import { FaAngleDown } from "react-icons/fa";
import { getAuthUser, removeAuthUser } from "../../Helpers/Storage";

const NavBar = () => {
  const [navScroll, setNavScroll] = useState(false);
  const user = getAuthUser();
  const logOut = () => {
    removeAuthUser();
  };
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
                      <NavLink onClick={handelShow} to={"/quran"}>
                        القرآن الكريم
                      </NavLink>
                    </li>
                    <li className="drop-link">
                      <NavLink onClick={handelShow} to={"/azkar"}>
                        الأذكار
                      </NavLink>
                    </li>
                    <li className="drop-link">
                      <NavLink onClick={handelShow} to={"/radio"}>
                        الراديو
                      </NavLink>
                    </li>
                    <li className="drop-link">
                      <NavLink onClick={handelShow} to={"/live"}>
                        البث المباشر
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
          {!user && (
            <div className={`nav-btns ${show}`}>
              <Link onClick={handelShow} to={"/login"} className="main-btn sm">
                تسجيل الدخول
              </Link>
              <Link
                onClick={handelShow}
                to={"/sign-up"}
                className="main-btn second-btn sm"
              >
                مستخدم جديد
              </Link>
            </div>
          )}
          {user && (
            <div className={`nav-btns ${show}`}>
              <Link
                className="user-profile"
                style={{ backgroundImage: `url(${user.profileImage})` }}
                to={`/profile/${user.firstName} ${user.lastName}`}
              ></Link>
              <Link
                onClick={() => {
                  handelShow();
                  logOut();
                }}
                to={"/"}
                className="main-btn sm"
              >
                تسجيل الخروج
              </Link>
            </div>
          )}

          <button
            className="toggle-btn"
            onClick={(e) => {
              handelShow();
              e.stopPropagation();
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
