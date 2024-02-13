import React, { useState, useRef, useEffect } from "react";
import "./style/profile.css";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { getAuthUser, setAuthUser } from "./../../Helpers/Storage"; // Assuming setAuthUser is a function to update user in local storage
import {
  FaEdit,
  FaRegPlayCircle,
  FaRegArrowAltCircleDown,
  FaRegPauseCircle,
  FaRegHeart,
  FaHeart,
} from "react-icons/fa";
import MainHeader from "./../../Shared/components/MainHeader";

const Profile = () => {
  const auth = getAuthUser();
  const { fav: userFav } = auth;

  const surahsByRwaya = Object.values(userFav).reduce((acc, surah) => {
    const { selectedRwayaName: rwayaName } = surah;
    acc[rwayaName] = acc[rwayaName] || [];
    acc[rwayaName].push(surah);
    return acc;
  }, {});

  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioVisible, setIsAudioVisible] = useState(false);
  const [selectedSurah, setSelectedSurah] = useState("");
  const [nowPlayingSurah, setNowPlayingSurah] = useState("");
  const [favStatus, setFavStatus] = useState(userFav || {});
  const [rerenderKey, setRerenderKey] = useState(0); // This key will be changed to force re-render
  const audioPlayerRef = useRef(null);

  const handleSurahDownload = (surahLink) => {
    // Implement logic for downloading the surah
    window.open(surahLink, "_blank");
  };

  const handleSurahPlayPause = (surahLink) => {
    setSelectedSurah(surahLink);
    setIsAudioVisible(true);
    setIsPlaying(true);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.audio.current.play();
    }
    setNowPlayingSurah(surahLink);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.audio.current.pause();
    }
  };

  const favSurah = (surah) => {
    const newFavStatus = { ...favStatus };
    const uniqueKey = `${surah.surahNumber}-${surah.surahName}-${surah.readerName}-${surah.selectedRwayaIndex}`;

    if (newFavStatus[uniqueKey]) {
      delete newFavStatus[uniqueKey];
    } else {
      newFavStatus[uniqueKey] = surah;
    }

    setFavStatus(newFavStatus);

    // Update user in local storage
    const updatedUser = {
      ...auth,
      fav: newFavStatus,
    };
    setAuthUser(updatedUser);

    // Force re-render by changing the key
    setRerenderKey(prevKey => prevKey + 1);
  };

  useEffect(() => {
    const storedUser = getAuthUser();
    const { fav: storedFav } = storedUser;
    setFavStatus(storedFav || {});
  }, []);

  const audioElement = (audioSrc) => {
    return isAudioVisible ? (
      <AudioPlayer
        src={audioSrc}
        ref={audioPlayerRef}
        className="audio-element"
        autoPlay={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsAudioVisible(false)}
      />
    ) : null;
  };

  return (
    <section className="profile-section">
      <div className="cover-profile">
        <div className="container">
          <div className="profile-detials">
            <button>
              <FaEdit />
            </button>
            <div
              className="user-img"
              style={{ backgroundImage: `url(${auth.profileImage})` }}
            ></div>
            <h1>{`${auth.firstName} ${auth.lastName}`}</h1>
          </div>
        </div>
      </div>
      <section className="fav-section" key={rerenderKey}>
        <div className="surah-audio">{audioElement(selectedSurah)}</div>

        <div className="container">
          <MainHeader
            Header={"بَعْض مِن سُور اَلقُرآن المفضَّلة إِلَيك"}
            smHeader={"المفضَّلة"}
          />

          {Object.entries(surahsByRwaya).map(([rwayaName, surahs], index) => (
            <div key={index} className="rwaya-collection">
              <h2>{rwayaName}</h2>
              <div key={rwayaName} className="rwaya-kind">
                {surahs.map((surah, index) => (
                  <div key={index} className=" surah main-btn">
                    {`${surah.surahName} - ${surah.readerName}`}
                    <div className="btns">
                      <button
                        onClick={() => handleSurahDownload(surah.surahLink)}
                        title="تحميل السورة"
                      >
                        <FaRegArrowAltCircleDown />
                      </button>
                      {nowPlayingSurah === surah.surahLink && isPlaying ? (
                        <button
                          onClick={() => {
                            handlePause();
                          }}
                          className="play-btn"
                          title="إيقاف الأستماع الي السورة"
                        >
                          <FaRegPauseCircle />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            handleSurahPlayPause(surah.surahLink);
                          }}
                          className="play-btn"
                          title="الأستماع الي السورة"
                        >
                          <FaRegPlayCircle />
                        </button>
                      )}
                      <button
                        onClick={() => favSurah(surah)}
                        className="fav-btn"
                      >
                        {favStatus[
                          `${surah.surahNumber}-${surah.surahName}-${surah.readerName}-${surah.selectedRwayaIndex}`
                        ] ? (
                          <FaHeart />
                        ) : (
                          <FaRegHeart />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
};

export default Profile;
