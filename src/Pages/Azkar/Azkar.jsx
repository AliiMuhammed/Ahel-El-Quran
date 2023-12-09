import React, { useEffect, useState, useRef } from "react";
import "./style/azkar.css";
import MainHeading from "./../../Shared/components/MainHeading";
import MainHeader from "./../../Shared/components/MainHeader";
import { FaSearch, FaRegPlayCircle, FaPauseCircle } from "react-icons/fa";
import { FaCirclePlay, FaRepeat } from "react-icons/fa6";

import axios from "axios";
import Loader from "./../../Shared/components/Loader";
export const Azkar = () => {
  const azkarSectionRef = useRef(null);
  const [counters, setCounters] = useState([]);

  const breadcrumb = {
    الرئيسية: "/",
    الأذكار: "/azkar",
  };
  const [singleZekr, setSingleZekr] = useState({
    audioUrl: "",
    textUrl: "",
    title: "",
    data: [],
    loading: false,
    errMsg: "",
  });
  const [azkar, setAzkar] = useState({ loading: false, azkar: [], errMsg: "" });
  const [searchInput, setSearchInput] = useState("");
  const handleSearch = (e) => {
    setSearchInput(e.target.value);
  };
  useEffect(() => {
    setAzkar({ ...azkar, loading: true });
    axios
      .get("https://www.hisnmuslim.com/api/ar/husn_ar.json")
      .then((res) => {
        setAzkar({
          ...azkar,
          loading: false,
          azkar: res.data.العربية,
          errMsg: "",
        });
        if (res.data.العربية.length > 0) {
          const firstZekr = res.data.العربية[0];
          setSingleZekr({
            audioUrl: firstZekr.AUDIO_URL,
            textUrl: firstZekr.TEXT,
            title: firstZekr.TITLE,
          });
          setActiveIndex(0);
        }
      })
      .catch((err) => {
        setAzkar({
          ...azkar,
          loading: false,
          azkar: [],
          errMsg: "حدث شَيْء مَا خَاطِئ أعدَّ المحاولة لَاحقًا",
        });
      });
  }, []);
  useEffect(() => {
    if (singleZekr.textUrl) {
      setSingleZekr({ ...singleZekr, loading: true });
      axios
        .get(singleZekr.textUrl)
        .then((res) => {
          setSingleZekr({
            ...singleZekr,
            loading: false,
            data:
              singleZekr.title && res.data && res.data[singleZekr.title]
                ? res.data[singleZekr.title]
                : [],

            errMsg: "",
          });
        })
        .catch((err) => {
          setSingleZekr({
            ...singleZekr,
            loading: false,
            data: [],
            errMsg: "حدث شَيْء مَا خَاطِئ أعدَّ المحاولة لَاحقًا",
          });
        });
    }
  }, [singleZekr.textUrl]);

  const [activeIndex, setActiveIndex] = useState(null);
  function englishToArabicNumbers(number) {
    const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

    return String(number).replace(/\d/g, (match) => {
      return arabicNumbers[parseInt(match)];
    });
  }

  useEffect(() => {
    // Initialize counters based on z.REPEAT values
    if (Array.isArray(singleZekr.data) && singleZekr.data.length > 0) {
      const initialCounters = singleZekr.data.map((z) => z.REPEAT);
      setCounters(initialCounters);
    }
  }, [singleZekr.data]);

  // Function to handle individual counter button click
  const handleCounterClick = (index) => {
    if (counters[index] > 0) {
      const updatedCounters = [...counters];
      updatedCounters[index] -= 1;
      setCounters(updatedCounters);
    }
  };

  // Function to handle the repeat button click
  const handleRepeatClick = (index) => {
    if (Array.isArray(singleZekr.data) && singleZekr.data.length > 0) {
      const resetCounters = [...counters];
      resetCounters[index] = singleZekr.data[index].REPEAT;
      setCounters(resetCounters);
    }
  };

  console.log(singleZekr.data);
  return (
    <section className="azkar-section" ref={azkarSectionRef}>
      <MainHeading breadcrumb={breadcrumb} title="الأذكار" />
      <section className="azkar">
        <div className="container">
          <MainHeader
            Header={"حِصْن اَلمسْلِم"}
            smHeader={"مِن أَذكَار الكتَاب والسُّنَّة"}
          />
          <div className="azkar-container">
            <div className="side-menu">
              <div className="search-box">
                <button className="search-btn">
                  <FaSearch />
                </button>
                <input
                  type="search"
                  name=""
                  id=""
                  placeholder="ادخل اسم القارئ ..."
                  value={searchInput}
                  onChange={handleSearch}
                />
              </div>
              <div className="azkar-names">
                {!azkar.loading &&
                  azkar.azkar.length !== 0 &&
                  azkar.azkar.map((zker, index) => {
                    return (
                      <div
                        className={`zker ${
                          index === activeIndex ? "active" : ""
                        }`}
                        onClick={() => {
                          if (azkarSectionRef.current) {
                            azkarSectionRef.current.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }
                          if (index !== activeIndex) {
                            setSingleZekr({
                              ...singleZekr,
                              audioUrl: zker.AUDIO_URL,
                              textUrl: zker.TEXT,
                              title: zker.TITLE,
                            });
                            setActiveIndex(index);
                          }
                        }}
                        key={zker.ID}
                      >
                        {zker.TITLE}
                      </div>
                    );
                  })}
              </div>
            </div>
            <div className="azkar-body">
              <div className="title">
                {singleZekr.title}
                <button className="play-icon">
                  <FaRegPlayCircle />
                </button>
              </div>
              <div className="content">
                {singleZekr.loading && <Loader />}
                {Array.isArray(singleZekr.data) &&
                  singleZekr.data.length !== 0 &&
                  !singleZekr.loading &&
                  singleZekr.data.map((z, index) => {
                    return (
                      <div key={z.ID} className="single-zekr">
                        <button className="play-icon">
                          <FaCirclePlay />
                        </button>
                        <span> {z.ARABIC_TEXT}</span>
                        <button
                          className="counter-btn"
                          onClick={() => handleCounterClick(index)}
                          disabled={counters[index] === 0}
                        >
                          {englishToArabicNumbers(counters[index])}
                        </button>
                        <button
                          className="counter-btn repeat-btn"
                          onClick={() => handleRepeatClick(index)}
                        >
                          <FaRepeat />
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
};
