import React from "react";
import MainHeading from "./../../Shared/components/MainHeading";
import MainHeader from "./../../Shared/components/MainHeader";
import "./style/live.css";

const Live = () => {
  const breadcrumb = {
    الرئيسية: "/",
    بث: "/live",
  };

  return (
    <section className="live-section">
      <MainHeading title={"البث المباشر"} breadcrumb={breadcrumb} />
      <section className="Makkah-section">
        <MainHeader
          smHeader={"قَنَاة الحرم المكِّيِّ"}
          Header={"بثٌّ مُبَاشِر مَكة المكرَّمة"}
        />
        <div className="container">
          <iframe
            src="https://www.youtube.com/embed/5bRjxlQgK90?autoplay=1"
            frameBorder="0"
            title="Makkah"
            allow="encrypted-media"
            allowFullScreen
            className="live-window"
          ></iframe>
        </div>
      </section>
      <section className="Madinah-section">
        <MainHeader
          smHeader={"قَنَاة السُّنَّة النَّبويَّة"}
          Header={"بثٌّ مُبَاشِر المدينة المنوَّرة"}
        />
        <div className="container">
          <iframe
            src="https://www.youtube.com/embed/EB0Y1ztWnic?autoplay=1"
            frameBorder="0"
            title="Madinah"
            allow="encrypted-media"
            allowFullScreen
            className="live-window"
          ></iframe>
        </div>
      </section>
    </section>
  );
};

export default Live;
