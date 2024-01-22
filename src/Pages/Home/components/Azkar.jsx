import React, { useEffect, useState, useRef } from "react";
import MainHeader from "../../../Shared/components/MainHeader";
import axios from "axios";
import { BsHeadphones } from "react-icons/bs";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { Link } from "react-router-dom";
import "../Style/azkar.css";

const Azkar = () => {
  // Helper function to get a random number
  const getRandomNumber = (max) => {
    if (max === 1) {
      return 0;
    }
    return Math.floor(Math.random() * max);
  };

  // Function to convert English numbers to Arabic
  const convertToArabicNumber = (englishNumber) => {
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
  };

  const [azkar, setAzkar] = useState([]);
  const [singleZker, setSingleZker] = useState([]);
  const [title, setTitle] = useState("");
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  useEffect(() => {
    // Check if there are saved random numbers in local storage
    const savedRandomNumbers =
      JSON.parse(localStorage.getItem("randomNumbers")) || {};

    // Check if today's date is already saved and get the random numbers
    const today = new Date().toLocaleDateString();
    const savedRandomNumbersForToday = savedRandomNumbers[today];

    if (savedRandomNumbersForToday) {
      setSingleZker(savedRandomNumbersForToday.singleZker);
      setTitle(savedRandomNumbersForToday.title);
    } else {
      axios
        .get(`https://www.hisnmuslim.com/api/ar/husn_ar.json`)
        .then((res) => {
          setAzkar(res.data.العربية || []);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  useEffect(() => {
    const fetchData = () => {
      axios
        .get(`https://www.hisnmuslim.com/api/ar/husn_ar.json`)
        .then((response) => {
          const allAzkar = response.data.العربية || [];
  
          if (allAzkar.length > 0) {
            const today = new Date().toLocaleDateString();
            const savedRandomNumbers =
              JSON.parse(localStorage.getItem("randomNumbers")) || {};
            const savedDataForToday = savedRandomNumbers[today];
  
            if (!savedDataForToday) {
              const zekrCat = allAzkar[getRandomNumber(allAzkar.length)];
              console.log(zekrCat);
              setTitle(zekrCat.TITLE);
              axios
                .get(`https://www.hisnmuslim.com/api/ar/${zekrCat.ID}.json`)
                .then((selectedZkerResponse) => {
                  const selectedZker =
                    selectedZkerResponse.data[zekrCat.TITLE] || [];
  
                  // Save the selected zekr and other information to local storage
                  const newRandomNumbers = {
                    singleZker: selectedZker,
                    title: zekrCat.TITLE,
                    selectedZekrIndex: getRandomNumber(selectedZker.length),
                  };
                  savedRandomNumbers[today] = newRandomNumbers;
                  localStorage.setItem(
                    "randomNumbers",
                    JSON.stringify(savedRandomNumbers)
                  );
  
                  setSingleZker(selectedZker);
                })
                .catch((error) => {
                  console.error(error);
                });
            } else {
              // Use the saved data for today
              setSingleZker(savedDataForToday.singleZker);
              setTitle(savedDataForToday.title);
            }
          }
        })
        .catch((error) => {
          console.error(error);
        });
    };
  
    fetchData();
  }, []);
  

  const savedRandomNumbersForToday =
    JSON.parse(localStorage.getItem("randomNumbers")) || {};
  const savedDataForToday =
    savedRandomNumbersForToday[new Date().toLocaleDateString()] || {};
  const savedZekrIndex =
    savedDataForToday.selectedZekrIndex || getRandomNumber(singleZker.length);
  const zekr = singleZker[savedZekrIndex];

  const audioPlayerRef = useRef();

  const handlePlayPause = () => {
    const audioPlayer = audioPlayerRef.current;
    if (audioPlayer.paused) {
      audioPlayer.play();
      setIsAudioPlaying(true);
    } else {
      audioPlayer.pause();
      setIsAudioPlaying(false);
    }
  };

  return (
    <section className="azkar-section">
      <div className="container">
        <MainHeader Header={"أذكار من القرآن والسنة"} smHeader={"ذكر اليوم"} />
        <div className="content">
          {zekr !== undefined && (
            <>
              <h1>{title}</h1>
              <div className="zker">
                <div className="zker-text">{zekr.ARABIC_TEXT}</div>
                <div className="zker-details">
                  <h4>
                    {`عدد مرات التكرار ${convertToArabicNumber(zekr.REPEAT)}`}
                  </h4>
                  <div className="zekr-btns">
                    <audio
                      id="player-zekr"
                      ref={audioPlayerRef}
                      src={zekr.AUDIO}
                      onEnded={() => setIsAudioPlaying(false)}
                    ></audio>
                    <Link to="" onClick={handlePlayPause}>
                      {isAudioPlaying ? (
                        <HiMiniSpeakerWave />
                      ) : (
                        <BsHeadphones />
                      )}
                    </Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Azkar;
