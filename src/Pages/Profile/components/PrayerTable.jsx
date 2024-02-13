// import React, { useState, useEffect } from "react";
// import { getAuthUser, setAuthUser } from "../../../Helpers/Storage"; // Assuming setAuthUser is a function to update user in local storage

// const PrayerTable = () => {
//   const auth = getAuthUser();
//   const { table: userFav } = auth;
//   // Initialize state to keep track of marks for each day
//   const [marks, setMarks] = useState(userFav || {});

//   useEffect(() => {
//     const storedUser = getAuthUser();
//     const { table: storedFav } = storedUser;
//     setMarks(storedFav || {});
//   }, []);
//   // Arabic names of the days
//   const arabicDays = [
//     "الأحد",
//     "الإثنين",
//     "الثلاثاء",
//     "الأربعاء",
//     "الخميس",
//     "الجمعة",
//     "السبت",
//   ];

//   // Function to toggle a mark for a specific day and prayer
//   const toggleMark = (dayIndex, prayerIndex) => {
//     setMarks((prevMarks) => {
//       const newMarks = [...prevMarks];
//       newMarks[dayIndex][prayerIndex] = !newMarks[dayIndex][prayerIndex];
//       localStorage.setItem("prayerMarks", JSON.stringify(newMarks));
//       return newMarks;
//     });
//   };

//   // Function to reset marks at the beginning of each week
//   const resetMarks = () => {
//     setMarks(getDefaultMarks());
//     localStorage.setItem("prayerMarks", JSON.stringify(getDefaultMarks()));
//   };

//   // Clear local storage when component unmounts
//   useEffect(() => {
//     const today = new Date();
//     const dayOfWeek = today.getDay(); // 0 (Sunday) to 6 (Saturday)
//     const daysUntilReset = 7 - dayOfWeek; // Number of days until next Sunday
//     const millisecondsUntilReset = daysUntilReset * 24 * 60 * 60 * 1000;

//     const timeoutId = setTimeout(() => {
//       resetMarks();
//     }, millisecondsUntilReset);

//     return () => {
//       clearTimeout(timeoutId);
//       localStorage.removeItem("prayerMarks");
//     };
//   }, []);

//   // Helper function to get default marks for a new week
//   function getDefaultMarks() {
//     return [
//       [false, false, false, false, false], // Sunday
//       [false, false, false, false, false], // Monday
//       [false, false, false, false, false], // Tuesday
//       [false, false, false, false, false], // Wednesday
//       [false, false, false, false, false], // Thursday
//       [false, false, false, false, false], // Friday
//       [false, false, false, false, false], // Saturday
//     ];
//   }

//   return (
//     <table>
//       <thead>
//         <tr>
//           <th>اليوم</th>
//           <th>الصلاة 1</th>
//           <th>الصلاة 2</th>
//           <th>الصلاة 3</th>
//           <th>الصلاة 4</th>
//           <th>الصلاة 5</th>
//         </tr>
//       </thead>
//       <tbody>
//         {marks.map((day, dayIndex) => (
//           <tr key={dayIndex}>
//             <td>{arabicDays[dayIndex]}</td>
//             {day.map((mark, prayerIndex) => (
//               <td key={prayerIndex}>
//                 <input
//                   type="checkbox"
//                   checked={mark}
//                   onChange={() => toggleMark(dayIndex, prayerIndex)}
//                 />
//               </td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// };

// export default PrayerTable;
