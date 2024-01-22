import React, { useEffect, useState } from "react";
import { fetchLocation } from "../Redux/Actions/Location";
import axios from "axios";
import { connect, useSelector } from "react-redux";

import azan from "../Assets/Azan.mp3";

const Notifications = ({ fetchLocation }) => {
  const [notificationShown, setNotificationShown] = useState(false);
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
          setPrayersTime(res.data.data.timings);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [location]);

  let times = [];
  if (prayersTime.hasOwnProperty("Fajr")) {
    const keysToExtract = [
      "Fajr",
      "Sunrise",
      "Dhuhr",
      "Asr",
      "Maghrib",
      "Isha",
    ];
    times = keysToExtract.map((key) => prayersTime[key]);
  }
  let prayers = ["الفجر", "الشروق", "الظهر", "العصر", "المغرب", "العشاء"];

  console.log(times);

  // ...

  // ...
  const playAzan = () => {
    const audioPlayer = document.getElementById("azan-player");

    if (audioPlayer.paused) {
      audioPlayer.play();
    } else {
      audioPlayer.pause();
    }
  };
  useEffect(() => {
    // Function to check if the current time matches any of the times in the array
    const isTargetTime = () => {
      const currentTime = new Date();
      const currentHour = currentTime.getHours().toString().padStart(2, "0");
      const currentMinute = currentTime
        .getMinutes()
        .toString()
        .padStart(2, "0");

      // Check if the current time matches any of the times in the array
      return times.some((targetTime) => {
        const [targetHour, targetMinute] = targetTime.split(":");
        return (
          currentTime.getHours() === parseInt(targetHour, 10) &&
          currentTime.getMinutes() === parseInt(targetMinute, 10)
        );
      });
    };

    // Function to show the notification
    const showNotification = () => {
      // Check if the browser supports notifications
      if ("Notification" in window) {
        // Request permission to show notifications
        Notification.requestPermission()
          .then((permission) => {
            if (permission === "granted") {
              // Declare currentTime within the showNotification function
              const currentTime = new Date();
              playAzan();

              // Get the index of the current time in the times array
              const currentTimeIndex = times.findIndex((targetTime) => {
                const [targetHour, targetMinute] = targetTime.split(":");
                return (
                  currentTime.getHours() === parseInt(targetHour, 10) &&
                  currentTime.getMinutes() === parseInt(targetMinute, 10)
                );
              });

              // Display the notification with the corresponding prayer name
              new Notification(
                `حان الآن موعد أذان ${prayers[currentTimeIndex]}`,
                {
                  body: `سأل النبي صلى الله عليه وسلم: أي العمل - أو أي الأعمال - أحب إلى الله؟ قال: "الصلاة على وقتها"`,
                }
              );

              // Set the state to indicate that the notification has been shown
              setNotificationShown(true);
            }
          })
          .catch((error) => {
            console.error("Notification permission error:", error);
          });
      }
    };

    // Schedule the notification
    const timeoutId = setInterval(() => {
      if (!notificationShown && isTargetTime()) {
        showNotification();
      }
    }, 60000); // Check every minute

    // Cleanup function to reset notification state and clear the interval when the component is unmounted
    return () => {
      setNotificationShown(false);

      clearInterval(timeoutId);
    };
  }, [notificationShown, times, prayers]);

  // ...

  // ...

  return (
    <div>
      <audio src={azan} id="azan-player"></audio>
    </div>
  );
};

const mapDispatchToProps = {
  fetchLocation,
};

export default connect(null, mapDispatchToProps)(Notifications);
