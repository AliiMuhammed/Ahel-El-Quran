import React from "react";
import "./Style/home.css";
import Landing from "./components/Landing";
import Prayers from "./components/prayers times/Prayers";
import Pillars from "./components/Pillars";
const Home = () => {
  return (
    <div>
      <Landing />
      <Pillars />
      <Prayers />
    </div>
  );
};

export default Home;
