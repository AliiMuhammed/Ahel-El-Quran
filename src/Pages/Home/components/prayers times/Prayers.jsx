import React, { useEffect, useState } from "react";
import MainHeader from "../../../../Shared/components/MainHeader";
import axios from "axios";
import ArabicClock from "./components/ArabicClock ";
import { FaCalendarDay } from "react-icons/fa6";
import ArabicDate from "./components/ArabicDate";
import ArabicHijriDate from "./components/ArabicHijriDate";
import "../../Style/prayers.css";
const Prayers = () => {
  const [todayDate, setTodayDate] = useState({
    gregorian: {},
    hijri: {},
    err: null,
  });
  const [prayersTime, setParyersTime] = useState({});

  useEffect(() => {
    axios
      .get("http://api.aladhan.com/v1/timingsByCity/formattedDate", {
        params: {
          city: "cairo",
          country: "Egypt",
          method: 5,
        },
      })
      .then((res) => {
        setTodayDate({
          ...todayDate,
          gregorian: res.data.data.date.gregorian,
          hijri: res.data.data.date.hijri,
        });
        setParyersTime(res.data.data.timings);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const date = new Date();
  const options = { weekday: "long", localeMatcher: "best fit" };
  const dayNameInArabic = date.toLocaleDateString("ar", options);

  let times = [];

  if (prayersTime.hasOwnProperty("Fajr")) {
    function convertToArabicNumbers(input) {
      const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

      return input.replace(/[0-9]/g, (match) => arabicNumbers[parseInt(match)]);
    }

    function convertTo12HourFormat(time) {
      const [hours, minutes] = time.split(":");
      let period = "ص";

      let hours12 = parseInt(hours, 10);

      if (hours12 >= 12) {
        period = "م";
        if (hours12 > 12) {
          hours12 -= 12;
        }
      }

      const arabicTime = `${convertToArabicNumbers(
        hours12.toString()
      )}:${convertToArabicNumbers(minutes)} ${period}`;
      return arabicTime;
    }

    const keysToExtract = [
      "Fajr",
      "Sunrise",
      "Dhuhr",
      "Asr",
      "Maghrib",
      "Isha",
    ];
    times = keysToExtract.map((key) => convertTo12HourFormat(prayersTime[key]));
  }

  let prayers = ["الفجر", "الشروق", "الظهر", "العصر", "المغرب", "العشاء"];

  return (
    <section className="prayers-section">
      <MainHeader
        smHeader={"مواقيت الصلاة"}
        Header={"مواقيت الصلاة للمسلمين"}
      />
      <div className="container">
        <div className="prayers-time">
          <div className="date">
            <div className="day">
              <FaCalendarDay />
              {dayNameInArabic}
            </div>
            <div className="full-date">
              <ArabicDate />
              <ArabicHijriDate />
            </div>
          </div>
        </div>
        <div className="city">
          <h1>مواقيت الصلاة في القاهرة - مصر</h1>
          <div className="time">
            <span>الساعة الآن</span>
            <ArabicClock />
          </div>
        </div>
        <div className="prayers-cards">
          {times.map((time, index) => {
            return (
              <div key={time} className="prayer-card">
                <h1>{prayers[index]}</h1>
                <span>{time}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Prayers;
