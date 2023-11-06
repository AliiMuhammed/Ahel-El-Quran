import React, { useState, useEffect } from "react";

const ArabicDate = () => {
  const [arabicDate, setArabicDate] = useState("");

  useEffect(() => {
    const updateArabicDate = () => {
      const currentTime = new Date();

      const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
        numberingSystem: "arab",
      };

      const newArabicDate = currentTime.toLocaleDateString("ar", options);
      setArabicDate(newArabicDate);
    };

    const timer = setInterval(updateArabicDate, 1000);

    // Initial update
    updateArabicDate();

    // Cleanup interval on unmount
    return () => {
      clearInterval(timer);
    };
  }, []);

  return <p>{arabicDate}</p>;
};

export default ArabicDate;
