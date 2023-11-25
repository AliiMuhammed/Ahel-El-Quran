import React from "react";
import "./style/aboutUs.css";
import MainHeading from "../../Shared/components/MainHeading";
import infoSection from "../../Assets/About us/websit info.jpg";
import MainHeader from "./../../Shared/components/MainHeader";
import developer from "../../Assets/About us/me.png";
import { Link } from "react-router-dom";
import { FaWhatsapp, FaLinkedinIn } from "react-icons/fa";
import { IoMail } from "react-icons/io5";
import { FiGithub } from "react-icons/fi";
const AboutUs = () => {
  const breadcrumb = {
    الرئيسية: "/",
    نحن: "/aboutUs",
  };
  return (
    <section className="about-section">
      <MainHeading title={"من نحن"} breadcrumb={breadcrumb} />
      <section className="about-website">
        <div className="container">
          <div className="left">
            <img src={infoSection} alt="info photoSection" />
          </div>
          <div className="right">
            <h1>استمتع بتلاوة القرآن والأذكار في أي وقت ومكان</h1>
            <p>
              "مرحبًا بك في <span>أهل القرآن</span> ، الموقع الذي يفتح أمامك
              أبواب القرآن بكل يسر وسهولة. يقدم لك هذا الموقع العديد من الخدمات
              القيمة التي تُسهِّل التواصل مع كتاب الله والاستفادة منه بشكل يومي
              ومُثمر. هنا، يمكنك الاستماع إلى تلاوات متنوعة للقرآن الكريم،
              واستكشاف التفاسير المتنوعة لفهم أعمق لمضامينه ومعانيه. كما يُمكنك
              استعراض الأذكار اليومية التي تُحيي قلبك بذكر الله وتقوي روحك
              بالاستمرار في ذكره. ومن خلال مواقيت الصلاة التي يقدمها الموقع،
              يُمكنك تنظيم يومك وأوقات عبادتك، حيث يوفر لك أوقات الصلوات الدقيقة
              لتسهيل أداء فرائضك الدينية في الوقت المحدد.
            </p>
          </div>
        </div>
      </section>
      <section className="developer-info" id="about-me">
        <div className="container">
          <MainHeader
            smHeader={" عن اَلمُطور "}
            Header={"تمَّ تَطوِير اَلموْقِع عن طريق"}
          />
          <div className="content">
            <div className="left">
              <h1>على محمد</h1>
              <p>
                أنا طالب في السنة الرابعة بكلية الحاسبات والذكاء الاصطناعي في
                جامعة حلوان. شغفي الرئيسي يكمن في تطوير وتحسين الواجهات الأمامية
                لمواقع الويب باستخدام React.js. أسعى دائمًا لاستخدام هذه التقنية
                لخلق تجارب مستخدم مميزة وفعّالة، وأنا متحمس لاكتساب المزيد من
                المهارات والخبرات في هذا المجال.
              </p>
              <div className="contactMe">
                <h1>تواصل معي</h1>
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
            </div>
            <div className="right">
              <img src={developer} alt="developerImg" />
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};

export default AboutUs;
