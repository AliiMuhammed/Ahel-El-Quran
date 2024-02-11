import React, { useState, useRef, useEffect } from "react";
import "./style/profile.css";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { getAuthUser } from "./../../Helpers/Storage";
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
  const user = getAuthUser();
  const { fav: userFav } = user;

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
  const [reload, setReload] = useState(1);
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

  const [favStatus, setFavStatus] = useState(userFav || {});
  const favSurah = (surah) => {
    setFavStatus(prevFavStatus => {
      const newFavStatus = { ...prevFavStatus };
      const uniqueKey = `${surah.surahNumber}-${surah.surahName}-${surah.readerName}-${surah.selectedRwayaIndex}`;

      if (newFavStatus[uniqueKey]) {
        delete newFavStatus[uniqueKey];
      } else {
        newFavStatus[uniqueKey] = surah;
      }

      return newFavStatus;
    });
  };

  const reloadFavoriteSurah = () => {
    setReload(reload + 1);
  };

  useEffect(() => {
    console.log(favStatus, "from use 1");

    const storedUser = JSON.parse(localStorage.getItem("currentUser")) || {};
    setFavStatus(storedUser?.fav || {});
  }, []);

  useEffect(() => {
    console.log(favStatus, "from use 2");
    if (user) {
      const updatedUser = {
        ...user,
        fav: favStatus,
      };

      const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
      const userIndex = storedUsers.findIndex(
        (storedUser) => storedUser.email === user.email
      );

      if (userIndex !== -1) {
        storedUsers[userIndex] = updatedUser;
        localStorage.setItem("users", JSON.stringify(storedUsers));
      }
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    }
  }, [favStatus, user]);

  const audioElement = (audioSrc) => {
    console.log(audioSrc);
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
              style={{ backgroundImage: `url(${user.profileImage})` }}
            ></div>
            <h1>{`${user.firstName} ${user.lastName}`}</h1>
          </div>
        </div>
      </div>
      <section className="fav-section">
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
                {surahs.map((surah) => (
                  <div key={surah} className=" surah main-btn">
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
                        {surah.isFav ? <FaHeart /> : <FaRegHeart />}
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
