import React from "react";
import "./style/aboutUs.css";
import MainHeading from "../../Shared/components/MainHeading";
import infoSection from "../../Assets/About us/websit info.jpg";
const AboutUs = () => {
  return (
    <section className="about-section">
      <MainHeading title={"من نحن"} />
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
    </section>
  );
};

export default AboutUs;
