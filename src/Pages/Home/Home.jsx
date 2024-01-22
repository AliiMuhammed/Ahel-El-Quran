import React from "react";
import "./Style/home.css";
import Landing from "./components/Landing";
import Prayers from "./components/prayers times/Prayers";
import Pillars from "./components/Pillars";
import Ayah from "./components/Ayah";
import Azkar from "./components/Azkar";
const Home = () => {
  return (
    <div>
      <Landing />
      <Prayers />
      <Ayah />
      <Pillars />
      <Azkar />
    </div>
  );
};

export default Home;
