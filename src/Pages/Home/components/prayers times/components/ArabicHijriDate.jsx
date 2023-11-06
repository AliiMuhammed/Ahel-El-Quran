import React, { useState, useEffect } from "react";
import moment from "moment-hijri";

const ArabicHijriDate = () => {
  const [arabicHijriDate, setArabicHijriDate] = useState("");

  useEffect(() => {
    const updateArabicHijriDate = () => {
      const currentTime = moment().format("iD iMMMM iYYYY");
      const formattedDate = currentTime.replace(/\d/g, (digit) => {
        const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
        return arabicDigits[digit];
      });
      setArabicHijriDate(formattedDate);
    };

    const timer = setInterval(updateArabicHijriDate, 1000);

    // Initial update
    updateArabicHijriDate();

    // Cleanup interval on unmount
    return () => {
      clearInterval(timer);
    };
  }, []);

  return <p>{arabicHijriDate}</p>;
};

export default ArabicHijriDate;
