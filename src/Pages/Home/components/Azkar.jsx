import React, { useEffect, useState, useRef } from "react";
import MainHeader from "../../../Shared/components/MainHeader";
import axios from "axios";
import { BsHeadphones } from "react-icons/bs";
import { HiMiniSpeakerWave } from "react-icons/hi2";
import { Link } from "react-router-dom";
import "../Style/azkar.css";
const Azkar = () => {
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
  const [azkar, setAzkar] = useState([]);
  const [singleZker, setSingleZker] = useState([]);
  const [title, setTitle] = useState(""); // Use state to manage the title
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  function getRandomNumber(max) {
    if (max === 1) {
      return 0;
    }
    return Math.floor(Math.random() * max);
  }

  useEffect(() => {
    axios
      .get(`https://www.hisnmuslim.com/api/ar/husn_ar.json`)
      .then((res) => {
        setAzkar(res.data.العربية || []);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (azkar.length > 0) {
        const zekrCat = azkar[getRandomNumber(azkar.length)];
        setTitle(zekrCat.TITLE);

        try {
          const response = await axios.get(`${zekrCat.TEXT}`);
          setSingleZker(response.data[zekrCat.TITLE] || []); // Ensure it's an array
        } catch (error) {
          console.error(error);
        }
      }
    };

    fetchData();
  }, [azkar]);

  const zekr = singleZker[getRandomNumber(singleZker.length)];

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
                  <h4 >
                    {`عدد مرات التكرار ${convertToArabicNumber(zekr.REPEAT)}`}
                  </h4>
                  <div className="zekr-btns">
                    <audio
                      id="player-zekr"
                      ref={audioPlayerRef} // Assign the ref to the audio player
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
