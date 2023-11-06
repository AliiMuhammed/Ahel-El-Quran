import React from "react";
import "./Style/home.css";
import Landing from "./components/Landing";
import Prayers from "./components/prayers times/Prayers";
const Home = () => {
  return (
    <section>
      <Landing />
      <Prayers />
    </section>
  );
};

export default Home;
