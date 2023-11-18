import React, { useEffect, useState } from "react";

import "./style/quran.css";
import MainHeading from "./../../Shared/components/MainHeading";
import MainHeader from "./../../Shared/components/MainHeader";
import axios from "axios";
import Loader from "../../Shared/components/Loader";
const Quran = () => {
  const [readers, setReaders] = useState({
    loading: false,
    data: null,
    errMsg: null,
  });
  useEffect(() => {
    setReaders({ ...readers, loading: true });
    axios
      .get("https://mp3quran.net/api/v3/recent_reads")
      .then((res) => {
        setReaders({ ...readers, data: res.data.reads, loading: true });
        console.log(readers.data);
      })
      .catch((err) => {
        setReaders({
          ...readers,
          loading: false,
          data: null,
          errMsg: "عفواً لقد حدث خطأ ما, برجاء اعادة المحاولة لاحقاً",
        });
        console.log(err);
      });
  }, []);

  const breadcrumb = {
    الرئيسية: "/",
    القرآن: "/quran",
  };
  return (
    <section className="quran-section">
      <MainHeading breadcrumb={breadcrumb} title="القرآن الكريم" />
      <section className="readers">
        <MainHeader
          Header={"اِستمَع إِلى اَلقُرآن اَلكرِيم بِصَوت"}
          smHeader={"قُرَّاء اَلقُرآن اَلكرِيم"}
        />
        <div className="container"></div>
        <div className="readers-cards">
          <div className="reader-card">
            {readers.loading && <Loader />}
            {readers.data !== null &&
              !readers.loading &&
              readers.data.map((reader) => {
                return <h2>{reader.name}</h2>;
              })}
          </div>
        </div>
      </section>
    </section>
  );
};

export default Quran;
