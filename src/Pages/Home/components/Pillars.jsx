import React from "react";
import MainHeader from "./../../../Shared/components/MainHeader";
import img1 from "../../../Assets/Home/الشهادة2.png";
import img2 from "../../../Assets/Home/الصلاة.png";
import img3 from "../../../Assets/Home/الزكاة.png";
import img4 from "../../../Assets/Home/الصوم.png";
import img5 from "../../../Assets/Home/الحج.png";
import "../Style/Pillar.css"
const Pillars = () => {
  return (
    <section className="Pillar-section">
      <div className="container">
        <MainHeader
          smHeader={"أركان الإسلام"}
          Header={"أركان الإسلام الخمسة"}
        />
        <p className="Pillar-dif">
          مصطلح إسلامي يطلق على الأسس الخمسة التي يبنى عليها دين الإسلام.
        </p>
        <div className="Pillars-cards">
          <div className="Pillar-card">
            <div className="Pillar-img">
              <img src={img1} alt="" />
            </div>
            <h1>الشهادتين</h1>
          </div>
          <div className="Pillar-card">
            <div className="Pillar-img">
              <img src={img2} alt="" />
            </div>
            <h1>إقامة الصَّلاة</h1>
          </div>
          <div className="Pillar-card">
            <div className="Pillar-img">
              <img src={img3} alt="" />
            </div>
            <h1>إيتاءُ الزكاة</h1>
          </div>
          <div className="Pillar-card">
            <div className="Pillar-img">
              <img src={img4} alt="" />
            </div>
            <h1>صومُ رمضَان</h1>
          </div>
          <div className="Pillar-card">
            <div className="Pillar-img">
              <img src={img5} alt="" />
            </div>
            <h1>حجُّ البيت</h1>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pillars;
