import React, { useEffect, useState, useRef } from "react";
import MainHeading from "../../Shared/components/MainHeading";
import axios from "axios";
import "./style/radio.css";
import { FaSearch, FaRegPlayCircle, FaRegPauseCircle } from "react-icons/fa";
import Loader from "./../../Shared/components/Loader";
import MainHeader from "./../../Shared/components/MainHeader";
import AudioPlayer from "react-h5-audio-player";
import Alert from "./../../Shared/components/Alert";

export const Radio = () => {
  const breadcrumb = {
    الرئيسية: "/",
    الراديو: "/quran",
  };

  const [radio, setRadio] = useState({
    loading: false,
    channels: [],
    errMsg: null,
    url: null,
    playingChannelId: null,
  });

  const [isPlaying, setIsPlaying] = useState(false);
  const [isAudioVisible, setIsAudioVisible] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    setRadio({ ...radio, loading: true });

    const cachedChannels = localStorage.getItem("radioChannels");

    if (cachedChannels) {
      setRadio({
        ...radio,
        channels: JSON.parse(cachedChannels),
        loading: false,
      });
    } else {
      axios
        .get("https://mp3quran.net/api/v3/radios")
        .then((res) => {
          const channelsData = res.data.radios;

          localStorage.setItem("radioChannels", JSON.stringify(channelsData));

          setRadio({
            ...radio,
            channels: channelsData,
            loading: false,
            errMsg: null,
          });
        })
        .catch((err) => {
          setRadio({
            ...radio,
            loading: false,
            channels: [],
            errMsg: "حدث شَيْء مَا خَاطِئ أعدَّ المحاولة لَاحقًا",
          });
          console.log(err);
        });
    }
  }, []);

  const channelElement =
    radio.channels.length !== 0 &&
    radio.channels
      .filter((channel) =>
        channel.name.toLowerCase().includes(searchInput.toLowerCase())
      )
      .map((channel) => {
        return (
          <div key={channel.id} className="channel main-btn">
            {channel.name}

            {radio.playingChannelId === channel.id && isPlaying ? (
              <button
                onClick={() => {
                  handlePause();
                }}
                className="play-btn"
                title="إيقاف الأستماع الي الاذاعة"
              >
                <FaRegPauseCircle />
              </button>
            ) : (
              <button
                onClick={() => {
                  handleAudio(channel.url, channel.id);
                }}
                className="play-btn"
                title="الأستماع الي الاذاعة"
              >
                <FaRegPlayCircle />
              </button>
            )}
          </div>
        );
      });

  const handleAudio = (url, channelId) => {
    setRadio({ ...radio, url: url, playingChannelId: channelId });
    setIsAudioVisible(true);
    setIsPlaying(true);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.audio.current.play();
    }
  };
  const audioPlayerRef = useRef(null);

  const audioElement = () => {
    const audioSrc = radio.url;
    return isAudioVisible ? (
      <AudioPlayer
        ref={audioPlayerRef}
        src={audioSrc}
        className="audio-element"
        autoPlay={isPlaying}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsAudioVisible(false)}
        playing={isPlaying}
      />
    ) : null;
  };

  const handleSearch = (e) => {
    const input = e.target.value;
    setSearchInput(input);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (audioPlayerRef.current) {
      audioPlayerRef.current.audio.current.pause();
    }
  };

  return (
    <section className="radio-section">
      <MainHeading breadcrumb={breadcrumb} title="الراديو" />
      <section className="radio">
        <div className="container">
          <MainHeader
            Header={"اِستمَع إِلى إِذاعَات إِسْلاميَّة مُتَنوعَة"}
            smHeader={"الإذاعات الإسْلاميَّة"}
          />
          <div className="search-box">
            <button className="search-btn">
              <FaSearch />
            </button>
            <input
              type="search"
              name=""
              id=""
              placeholder="ادخل اسم الإذاعة ..."
              value={searchInput}
              onChange={handleSearch}
            />
          </div>
          {radio.channels.length === 0 && radio.loading && <Loader />}
          <div className="channels">
            {radio.channels.length !== 0 && !radio.loading && channelElement}
          </div>
          {channelElement.length === 0 && (
            <Alert
              msg={`لا يوجد إذاعة بهذا الاسم "${searchInput}"`}
              variant={"warning"}
            />
          )}

          {!radio.loading && radio.channels.length === 0 && (
            <Alert msg={radio.errMsg} variant={"danger"} />
          )}
        </div>
        <div className="radio-audio">{audioElement()}</div>
      </section>
    </section>
  );
};
