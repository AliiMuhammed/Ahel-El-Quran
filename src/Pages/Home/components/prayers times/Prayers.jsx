import React, { useEffect, useState } from "react";
import MainHeader from "../../../../Shared/components/MainHeader";
import axios from "axios";
import ArabicClock from "./components/ArabicClock ";
import { FaCalendarDay } from "react-icons/fa6";
import ArabicDate from "./components/ArabicDate";
import ArabicHijriDate from "./components/ArabicHijriDate";
import "../../Style/prayers.css";

import { connect, useSelector } from "react-redux";
import { fetchLocation } from "../../../../Redux/Actions/Location";
import Loader from "../../../../Shared/components/Loader";
const Prayers = ({ fetchLocation }) => {
  const [todayDate, setTodayDate] = useState({
    gregorian: {},
    hijri: {},
    err: null,
  });
  const [prayersTime, setPrayersTime] = useState({});
  let location = useSelector((state) => state.location);
  useEffect(() => {
    if (location && location.latitude && location.longitude) {
      const currentDate = new Date();
      const day = currentDate.getDate().toString().padStart(2, "0");
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
      const year = currentDate.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;

      axios
        .get(`https://api.aladhan.com/v1/timings`, {
          params: {
            latitude: location.latitude,
            longitude: location.longitude,
            date: formattedDate,
            method: 5,
          },
        })
        .then((res) => {
          setTodayDate({
            ...todayDate,
            gregorian: res.data.data.date.gregorian,
            hijri: res.data.data.date.hijri,
          });
          setPrayersTime(res.data.data.timings);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [location]);

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
  const [isLoading, setIsLoading] = useState(false);
  return (
    <section className="prayers-section" name="prayers-time">
      <div className="container">
        <MainHeader
          smHeader={"مَواقِيت الصَّلَاة"}
          Header={"مَواقِيت الصَّلَاة لِلْمسْلمين"}
        />
        <div className="bg-div">
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
            <h1>مواقيت الصلاة في مصر</h1>
            <div className="time">
              <span>الساعة الآن</span>
              <ArabicClock />
            </div>
          </div>
          <div className="prayers-cards">
            {location.latitude === "" &&
              location.longitude === "" &&
              isLoading && <Loader />}

            {location.latitude !== "" &&
              location.longitude !== "" &&
              times.map((time, index) => {
                return (
                  <div key={time} className="prayer-card">
                    <h1>{prayers[index]}</h1>
                    <span>{time}</span>
                  </div>
                );
              })}

            {!isLoading &&
              location.latitude === "" &&
              location.longitude === "" && (
                <div className="location-req">
                  <p>الحصول علي موقعك لعرض مواقيت الصلاة حسب منطقتك</p>
                  <button
                    onClick={() => {
                      fetchLocation();
                      setIsLoading(true);
                    }}
                    className="main-btn second-btn location-btn"
                  >
                    الحصول علي موقعك
                  </button>
                </div>
              )}
          </div>
        </div>
      </div>
    </section>
  );
};

const mapDispatchToProps = {
  fetchLocation,
};

export default connect(null, mapDispatchToProps)(Prayers);
