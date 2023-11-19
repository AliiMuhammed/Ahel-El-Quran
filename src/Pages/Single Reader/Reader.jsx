// ReaderDetail.js
import React from "react";
import { useSelector } from "react-redux";

const Reader = () => {
  const reader = useSelector((state) => state.readerData);

  if (!reader) {
    return <section>Reader details not found.</section>;
  }

  // Use the reader object to display details or perform actions

  // useEffect(() => {
  //   axios
  //     .get("https://api.alquran.cloud/v1/quran/ar.alafasy")
  //     .then((res) => {
  //       console.log(res.data.data);
  //     })
  //     .catch(() => {});
  // }, []);
  return (
    <section>
      <h1>Reader Detail</h1>
      <p>Name: {reader.name}</p>
      Display other reader details
    </section>
  );
};

export default Reader;
