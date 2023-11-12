import React, { useState, useEffect } from "react";
import { Link } from "react-scroll";
import { BsHeadphones, BsFillInfoCircleFill } from "react-icons/bs";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import Modal from "react-bootstrap/Modal";

import MainHeader from "../../../Shared/components/MainHeader";
import axios from "axios";
import "../Style/ayah.css";

const Ayah = () => {
  const getRandomNumber = (seed) => {
    const min = 1;
    const max = 6236;
    const random = (seed * 9301 + 49297) % 233280;
    const randomNumber = Math.floor(min + (random / 233280) * (max - min + 1));
    return randomNumber;
  };

  const [ayah, setAyah] = useState(null);
  const [tafseer, setTafseer] = useState(null);
  const [counter, setCounter] = useState(1);
  const [prevDate, setPrevDate] = useState({
    year: null,
    month: null,
    day: null,
  });
  const getAyah = (RandomNumber) => {
    axios
      .get(`https://api.alquran.cloud/v1/ayah/${RandomNumber}/ar.husary`)
      .then((res) => {
        setAyah(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getTafseer = (RandomNumber) => {
    axios
      .get(`https://api.alquran.cloud/v1/ayah/${RandomNumber}/ar.muyassar`)
      .then((res) => {
        setTafseer(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // Check if the day, month, or year has changed
    if (
      prevDate.year !== year ||
      prevDate.month !== month ||
      prevDate.day !== day
    ) {
      // Increment the counter and update the previous date values
      setCounter((prevCounter) => {
        if (prevCounter === 6236) {
          // Reset the counter to 1 if it reaches 6236
          return 1;
        } else {
          return prevCounter + 1;
        }
      });
      setPrevDate({ year, month, day });
    }

    const seed = counter;
    const RandomNumber = getRandomNumber(seed);
    getAyah(RandomNumber);
    getTafseer(RandomNumber);
    console.log(seed)
  }, [counter]);
  function convertToArabicNumber(englishNumber) {
    const arabicNumbers = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    const englishNumberString = englishNumber.toString();
    let arabicNumberString = "";

    for (let i = 0; i < englishNumberString.length; i++) {
      const digit = englishNumberString[i];
      if (digit >= "0" && digit <= "9") {
        arabicNumberString += arabicNumbers[parseInt(digit)];
      } else {
        // If the character is not a digit, keep it as is.
        arabicNumberString += digit;
      }
    }

    return arabicNumberString;
  }

  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  return (
    <section className="ayah-section">
      <div className="container">
        <MainHeader Header={"آيات من القرآن الكريم"} smHeader={"آيه اليوم"} />
        <div className="content">
          <h1>بِسْمِ اللَّهِ اَلرَّحْمَنِ الرَّحِيمِ</h1>
          <div className="ayah">
            <p className="ayah-text">{ayah !== null && ayah.text}</p>
            <div className="ayah-details">
              {ayah !== null && (
                <>
                  <h4>
                    {`الآية ${convertToArabicNumber(ayah.numberInSurah)} `}
                    <span>{ayah.surah.name}</span>
                    {` صفحة ${convertToArabicNumber(ayah.page)}`}
                  </h4>
                  <audio
                    id="player"
                    src={ayah.audio}
                    onEnded={() => setIsAudioPlaying(false)}
                  ></audio>
                  <div className="ayah-btns">
                    <button
                      onClick={() => {
                        handleShow();
                      }}
                    >
                      <BsFillInfoCircleFill />
                    </button>
                    {isAudioPlaying ? (
                      <Link
                        to=""
                        onClick={() => {
                          const audioPlayer = document.getElementById("player");
                          if (audioPlayer.paused) {
                            audioPlayer.play();
                            setIsAudioPlaying(true);
                          } else {
                            audioPlayer.pause();
                            setIsAudioPlaying(false);
                          }
                        }}
                      >
                        <HiMiniSpeakerWave />
                      </Link>
                    ) : (
                      <Link
                        to=""
                        onClick={() => {
                          const audioPlayer = document.getElementById("player");
                          if (audioPlayer.paused) {
                            audioPlayer.play();
                            setIsAudioPlaying(true);
                          } else {
                            audioPlayer.pause();
                            setIsAudioPlaying(false);
                          }
                        }}
                      >
                        <BsHeadphones />
                      </Link>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header>
          <Modal.Title>تفسير الآيه</Modal.Title>
        </Modal.Header>
        <Modal.Body scrollable>
          <div className="tafseer">
            <p className="ayah-tafseer">
              {tafseer !== null && tafseer.text}
              <span>{tafseer !== null && `( ${tafseer.edition.name} )`}</span>
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="main-btn close-btn"
            variant="secondary"
            onClick={handleClose}
          >
            إِغلَاق
          </button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default Ayah;
