import React from "react";
import { Link } from "react-router-dom";
import landingImg from "../../../Assets/Home/landing.png";
import "../Style/landing.css";
import { Link as ScrollLink } from "react-scroll";

const Landing = () => {
  return (
    <section className="first-sectoin landing-section">
      <div className="container">
        <div className="right">
          <div className="landing-img">
            <img src={landingImg} alt="" />
          </div>
        </div>
        <div className="left">
          <h1>استمتع بتلاوة القرآن والأذكار في أي وقت ومكان</h1>
          <p>
            مرحبًا بك في أهل القرآن الموقع الذي يقدم لك الأذكار اليومية ومواقيت
            الصلاة بسهولة. استمع إلى تلاوات القرآن وتصفح تفاسيره للتقرب إلى الله
            وتعزيز إيمانك.
          </p>
          <div className="left-btns">
            <Link to={"https://archive.org/embed/EQuran00001"} className="main-btn">
              قراءة القرآن
            </Link>

            {/* <Link to={"/#prayers-time"}>مواقيت الصلاة</Link> */}
            <ScrollLink
              className="main-btn second-btn"
              activeClass="active"
              to="prayers-time"
              spy={true}
              smooth={true}
              offset={-150} // You can adjust the offset to suit your layout
              duration={1}
            >
              مواقيت الصلاة
            </ScrollLink>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Landing;
