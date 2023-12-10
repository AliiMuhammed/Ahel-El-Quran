import React, { useEffect, useState, useRef } from "react";
import "./style/azkar.css";
import MainHeading from "./../../Shared/components/MainHeading";
import MainHeader from "./../../Shared/components/MainHeader";
import { FaSearch, FaPauseCircle } from "react-icons/fa";
import { FaCirclePlay, FaRepeat } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { BsHeadphones } from "react-icons/bs";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import axios from "axios";
import Loader from "./../../Shared/components/Loader";
import Alert from "./../../Shared/components/Alert";
import { TfiMenu } from "react-icons/tfi";

export const Azkar = () => {
  const [showAzkarNames, setShowAzkarNames] = useState(false);

  const breadcrumb = {
    الرئيسية: "/",
    الأذكار: "/azkar",
  };
  const azkarSectionRef = useRef(null);
  const [counters, setCounters] = useState([]);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
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
          setSelectedZekrID(firstZekr.ID);
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
    if (Array.isArray(singleZekr.data) && singleZekr.data.length > 0) {
      const initialCounters = singleZekr.data.map((z) => z.REPEAT);
      setCounters(initialCounters);
    }
  }, [singleZekr.data]);

  const handleCounterClick = (index) => {
    if (counters[index] > 0) {
      const updatedCounters = [...counters];
      updatedCounters[index] -= 1;
      setCounters(updatedCounters);
    }
  };

  const handleRepeatClick = (index) => {
    if (Array.isArray(singleZekr.data) && singleZekr.data.length > 0) {
      const resetCounters = [...counters];
      resetCounters[index] = singleZekr.data[index].REPEAT;
      setCounters(resetCounters);
    }
  };

  const [zekrAudio, setZekrAudio] = useState(null);
  const [zekrAudios, setZekrAudios] = useState({});
  const handleAudioClick = (audioId, audioUrl) => {
    const audioPlayer = document.getElementById(audioId);

    if (!audioPlayer) return;

    const allAudioPlayers = document.getElementsByTagName("audio");
    Array.from(allAudioPlayers).forEach((player) => {
      if (player !== audioPlayer) {
        player.pause();
      }
    });

    if (audioPlayer.paused || audioPlayer.ended) {
      audioPlayer.src = audioUrl;
      audioPlayer.load();

      if (zekrAudio && zekrAudio !== audioPlayer) {
        zekrAudio.pause();
        setIsAudioPlaying(false);
        setZekrAudio(null);
      }

      audioPlayer.play();
      setIsAudioPlaying(true);
      setZekrAudio(audioPlayer);
    } else {
      audioPlayer.pause();
      setIsAudioPlaying(false);
      setZekrAudio(null);
    }
  };

  const [isZekrAudioPlaying, setIsZekrAudioPlaying] = useState(false);

  const [filteredIndices, setFilteredIndices] = useState([]);
  const [previouslySelectedIndex, setPreviouslySelectedIndex] = useState(null);
  const [selectedZekrID, setSelectedZekrID] = useState(null);

  // ... (existing code remains the same)

  useEffect(() => {
    // Update the filtered indices when azkar or searchInput changes
    if (!azkar.loading && azkar.azkar.length !== 0) {
      const indices = azkar.azkar
        .map((zker, index) => ({
          index,
          match: zker.TITLE.toLowerCase().includes(searchInput.toLowerCase()),
        }))
        .filter((item) => item.match)
        .map((item) => item.index);

      setFilteredIndices(indices);

      // Check if the previously selected index is included in the filtered indices
      const isSelectedIndexInFiltered =
        previouslySelectedIndex !== null &&
        indices.includes(previouslySelectedIndex);

      // If the search input is empty and the previously selected index is in the filtered list, set it as active
      if (searchInput === "" && isSelectedIndexInFiltered) {
        setActiveIndex(previouslySelectedIndex);
      } else {
        setActiveIndex(null);
      }
    }
  }, [azkar, searchInput, previouslySelectedIndex]);
  const azkarNames =
    !azkar.loading &&
    azkar.azkar.length !== 0 &&
    azkar.azkar
      .filter((zker) =>
        zker.TITLE.toLowerCase().includes(searchInput.toLowerCase())
      )
      .map((zker, index) => {
        const isActive = activeIndex === index || zker.ID === selectedZekrID;

        return (
          <div
            className={`zker ${isActive ? "active" : ""}`}
            onClick={() => {
              setShowAzkarNames(!showAzkarNames);
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
                setSelectedZekrID(zker.ID);
              }
            }}
            key={zker.ID}
          >
            {zker.TITLE}
          </div>
        );
      });
  const handleOpenButtonClick = () => {
    setShowAzkarNames(!showAzkarNames);
  };
  return (
    <section className="azkar-section" ref={azkarSectionRef}>
      <MainHeading breadcrumb={breadcrumb} title="الأذكار" />
      <section className="azkar">
        <div className="container">
          <MainHeader
            Header={"حِصْن اَلمسْلِم"}
            smHeader={"مِن أَذكَار الكتَاب والسُّنَّة"}
          />
          <audio
            id="playerZekr"
            src={singleZekr.audioUrl}
            onEnded={() => setIsZekrAudioPlaying(false)}
            type="audio/mpeg"
            preload="auto"
          ></audio>
          {azkar.azkar.map((zker) => (
            <audio
              key={zker.ID}
              id={`player-${zker.ID}`}
              src={zekrAudios[zker.ID]}
              onEnded={() => setIsAudioPlaying(false)}
              type="audio/mpeg"
              preload="auto"
            ></audio>
          ))}
          <div className="azkar-container">
            <div className="side-menu">
              <div className="search-box">
                <button className="open-menu" onClick={handleOpenButtonClick}>
                  <TfiMenu />
                </button>
                <button className="search-btn">
                  <FaSearch />
                </button>
                <input
                  type="search"
                  name=""
                  id=""
                  placeholder="البحث..."
                  value={searchInput}
                  onChange={handleSearch}
                />
              </div>
              <div className={`azkar-names ${showAzkarNames ? "show" : ""}`}>
                {azkarNames.length === 0 && (
                  <Alert
                    msg={`لا يوجد أذكار بهذا الاسم "${searchInput}"`}
                    variant={"warning"}
                  />
                )}
                {azkarNames}
              </div>
            </div>
            <div className="azkar-body">
              <div className="title">
                {singleZekr.title}
                {isZekrAudioPlaying ? (
                  <Link
                    to=""
                    className="play-icon"
                    onClick={() => {
                      const audioPlayer = document.getElementById("playerZekr");
                      if (audioPlayer.paused) {
                        audioPlayer.play();
                        setIsZekrAudioPlaying(true);
                      } else {
                        audioPlayer.pause();
                        setIsZekrAudioPlaying(false);
                      }
                    }}
                  >
                    <FaPauseCircle />
                  </Link>
                ) : (
                  <Link
                    to=""
                    className="play-icon"
                    onClick={() => {
                      const audioPlayer = document.getElementById("playerZekr");
                      if (audioPlayer.paused) {
                        audioPlayer.play();
                        setIsZekrAudioPlaying(true);
                      } else {
                        audioPlayer.pause();
                        setIsZekrAudioPlaying(false);
                      }
                    }}
                  >
                    <FaCirclePlay />
                  </Link>
                )}
              </div>
              <div className="content">
                {singleZekr.loading && <Loader />}
                {Array.isArray(singleZekr.data) &&
                  singleZekr.data.length !== 0 &&
                  !singleZekr.loading &&
                  singleZekr.data.map((z, index) => {
                    const audioPlayer = document.getElementById(
                      `player-${z.ID}`
                    );
                    const isThisAudioPlaying =
                      audioPlayer && !audioPlayer.paused && !audioPlayer.ended;

                    return (
                      <div key={z.ID} className="single-zekr">
                        <Link
                          to=""
                          className="play-icon"
                          onClick={() =>
                            handleAudioClick(`player-${z.ID}`, z.AUDIO)
                          }
                        >
                          {!zekrAudio ||
                          zekrAudio.paused ||
                          zekrAudio.ended ||
                          zekrAudio.id !== `player-${z.ID}` ? (
                            <BsHeadphones />
                          ) : (
                            <HiMiniSpeakerWave />
                          )}
                        </Link>

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
