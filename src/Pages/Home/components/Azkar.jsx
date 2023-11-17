import React, { useEffect, useState } from "react";
import MainHeader from "../../../Shared/components/MainHeader";
import axios from "axios";

const Azkar = () => {
  //   const [azkar, setAzkar] = useState();
  //   useEffect(() => {
  //     axios
  //       .get(
  //         `https://api3.islamhouse.com/v3/paV29H2gm56kvLPy/main/get-item/2522/ar/json`
  //       )
  //       .then((res) => {
  //         console.log(res);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   });
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
