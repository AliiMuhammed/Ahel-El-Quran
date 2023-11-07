import React from "react";
import "./Style/home.css";
import Landing from "./components/Landing";
import Prayers from "./components/prayers times/Prayers";
import Pillars from "./components/Pillars";
const Home = () => {
  return (
    <section>
      <Landing />
      <Pillars />
      <Prayers />
    </section>
  );
};

export default Home;
