import React, { useEffect } from "react";
import MainHeader from "../../../Shared/components/MainHeader";

const Prayers = () => {
    useEffect(() => {
      
    })
  return (
    
      <section className="prayers-section">
        <div className="container">
          <MainHeader
            smHeader={"مواقيت الصلاة"}
            Header={"مواقيت الصلاة للمسلمين"}
          />
          <div className="prayers-time">

          </div>
        </div>
      </section>

  );
};

export default Prayers;
