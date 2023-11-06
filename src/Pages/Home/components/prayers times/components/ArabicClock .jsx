import React, { useState, useEffect } from "react";

const ArabicClock = () => {
  const [arabicTime, setArabicTime] = useState("");

  useEffect(() => {
    const updateArabicTime = () => {
      const currentTime = new Date();

      const options = {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
        hourCycle: "h12",
        numberingSystem: "arab",
      };

      const newArabicTime = currentTime.toLocaleTimeString("ar", options);
      setArabicTime(newArabicTime);
    };

    const timer = setInterval(updateArabicTime, 1000);

    // Initial update
    updateArabicTime();

    // Cleanup interval on unmount
    return () => {
      clearInterval(timer);
    };
  }, []);

  return <p>{arabicTime}</p>;
};

export default ArabicClock;
