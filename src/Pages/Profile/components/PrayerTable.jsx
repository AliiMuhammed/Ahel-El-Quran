import React, { useState, useEffect } from "react";
import { getAuthUser, setAuthUser } from "../../../Helpers/Storage";
import "../style/prayerTable.css";
import MainHeader from "../../../Shared/components/MainHeader";

const PrayerTable = () => {
  // Initialize state to keep track of marks for each day

  const user = getAuthUser();
  const [marks, setMarks] = useState(() => {
    return user ? user.PrayerTable : getDefaultMarks();
  });

  // Arabic names of the days
  const arabicDays = [
    "الأحد",
    "الإثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
    "السبت",
  ];

  // Function to toggle a mark for a specific day and prayer
  const toggleMark = (dayIndex, prayerIndex) => {
    setMarks((prevMarks) => {
      const newMarks = [...prevMarks];
      newMarks[dayIndex][prayerIndex] = !newMarks[dayIndex][prayerIndex];
      user.PrayerTable = newMarks;
      //   localStorage.setItem("prayerMarks", JSON.stringify(newMarks));
      setAuthUser(user);
      return newMarks;
    });
  };

  // Function to reset marks at the beginning of each week
  const resetMarks = () => {
    setMarks(getDefaultMarks());
    user.PrayerTable = getDefaultMarks();
    setAuthUser(user);
  };

  // Clear local storage when component unmounts
  useEffect(() => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
    const daysUntilReset = 7 - dayOfWeek; // Number of days until next Sunday
    const millisecondsUntilReset = daysUntilReset * 24 * 60 * 60 * 1000;

    const timeoutId = setTimeout(() => {
      resetMarks();
    }, millisecondsUntilReset);

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  // Helper function to get default marks for a new week
  function getDefaultMarks() {
    return [
      [false, false, false, false, false], // Sunday
      [false, false, false, false, false], // Monday
      [false, false, false, false, false], // Tuesday
      [false, false, false, false, false], // Wednesday
      [false, false, false, false, false], // Thursday
      [false, false, false, false, false], // Friday
      [false, false, false, false, false], // Saturday
    ];
  }

  return (
    <section className="table-section">
      <div className="container">
        <MainHeader
          Header={"قُم بِتتبُّع صَلاتِك على مَدَار الأسْبوع"}
          smHeader={"صلاتيْ"}
        />

        <div className="table-res">
          <table>
            <thead>
              <tr>
                <th>اليوم</th>
                <th>الفجر</th>
                <th>الظهر</th>
                <th>العصر</th>
                <th>المغرب</th>
                <th>العشاء</th>
              </tr>
            </thead>
            <tbody>
              {marks.map((day, dayIndex) => (
                <tr key={dayIndex}>
                  <td>{arabicDays[dayIndex]}</td>
                  {day.map((mark, prayerIndex) => (
                    <td key={prayerIndex}>
                      <input
                        type="checkbox"
                        checked={mark}
                        onChange={() => toggleMark(dayIndex, prayerIndex)}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default PrayerTable;
