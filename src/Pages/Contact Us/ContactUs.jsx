import React from "react";
import "./style/contactUs.css";
import MainHeading from "./../../Shared/components/MainHeading";
import MainHeader from "./../../Shared/components/MainHeader";
import { Link } from "react-router-dom";
import { FaLocationDot } from "react-icons/fa6";
import { IoMail } from "react-icons/io5";

const ContactUs = () => {
  const breadcrumb = {
    الرئيسية: "/",
    تواصل: "/contactUs",
  };
  return (
    <section className="contact-section">
      <MainHeading title="تواصل معنا" breadcrumb={breadcrumb} />
      <section className="contact-us-form">
        <div className="container">
          <MainHeader
            Header={"لََا تَتَردَّد فِي تَرْك رِسالة"}
            smHeader={"دَعنَا نَتَواصَل"}
          />
          <div className="content">
            <div className="right">
              <div className="right-links">
                <Link to={""}>
                  <span>
                    <FaLocationDot />
                  </span>
                  القاهرة - مصر
                </Link>
                <Link to={"mailto:ali.muhammed.dev@gmail.com"}>
                  <span>
                    <IoMail />
                  </span>
                  ali.muhammed.dev@gmail.com
                </Link>
              </div>
              <div className="right-map">
                <iframe
                  title="helwan map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d221095.76596880506!2d31.137063191685275!3d30.019027319177756!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1458368becfaa68d%3A0xb8a6f7d9576f81f8!2z2YPZhNmK2Kkg2KfZhNit2KfYs9io2KfYqiDZiNin2YTYsNmD2KfYoSDYp9mE2KfYtdi32YbYp9i52YrYjCDYrNin2YXYudipINit2YTZiNin2YY!5e0!3m2!1sen!2seg!4v1700944230513!5m2!1sen!2seg"
                  style={{ border: 0 }}
                  allowfullscreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
            <div className="left">
              <form action="">
                <input type="text" placeholder="الاسم" />
                <input type="text" placeholder="البريد الإلكتروني" />
                <textarea type="text" placeholder="رسالتك" />
                <input type="submit" value="إرسال" className="main-btn" />
              </form>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default ContactUs;
