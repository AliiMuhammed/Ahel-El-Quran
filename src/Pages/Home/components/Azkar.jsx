import React, { useEffect } from "react";
import MainHeader from "../../../Shared/components/MainHeader";
import axios from "axios";

const Azkar = () => {
  const type = "random";
  useEffect(() => {
    axios
      .get(`https://ayah.nawafdev.com/api/dekr?types=random`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  });
  return (
    <section className="azkar-section">
      <div className="container">
        <MainHeader Header={"أذكار من القرآن والسنة"} smHeader={"ذكر اليوم"} />
        <div className="content"></div>
      </div>
    </section>
  );
};

export default Azkar;
