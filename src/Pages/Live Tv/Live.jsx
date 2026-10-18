import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import MainHeading from "./../../Shared/components/MainHeading";
import MainHeader from "./../../Shared/components/MainHeader";
import { loadYouTube } from "./youtubePlayer";
import "./style/live.css";

const CHANNELS = [
  { name: "makkah", className: "Makkah-section", subtitle: "قَنَاة الحرم المكِّيِّ", title: "بثٌّ مُبَاشِر مَكة المكرَّمة", official: "https://aloula.sba.sa/live/quran" },
  { name: "madinah", className: "Madinah-section", subtitle: "قَنَاة السُّنَّة النَّبويَّة", title: "بثٌّ مُبَاشِر المدينة المنوَّرة", official: "https://aloula.sba.sa/live/sunna" },
];

function Broadcast({ channel, stream, loading, unavailable, refresh }) {
  const host = useRef(null);
  const wasPlaying = useRef(false);
  const [endedIds, setEndedIds] = useState([]);
  const [playerError, setPlayerError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const videoId = stream?.videoIds.find(id => !endedIds.includes(id));

  useEffect(() => {
    if (!videoId) return;
    let active = true;
    let player;
    let timeout;
    const destroy = () => { if (player) { player.destroy(); player = null; } };
    const fail = (terminal) => {
      if (!active) return;
      active = false;
      clearTimeout(timeout);
      destroy();
      if (terminal) setEndedIds(ids => [...ids, videoId]);
      else setPlayerError(true);
      refresh();
    };
    setPlayerError(false);
    loadYouTube().then(YT => {
      if (!active) return;
      const element = document.createElement("div");
      host.current.replaceChildren(element);
      timeout = setTimeout(() => fail(false), 15000);
      player = new YT.Player(element, {
        width: "100%", height: "100%", videoId,
        playerVars: { origin: window.location.origin, playsinline: 1, autoplay: wasPlaying.current ? 1 : 0 },
        events: {
          onReady: (event) => {
            if (!active) return;
            clearTimeout(timeout);
            event.target.getIframe().title = channel.title;
          },
          onStateChange: (event) => {
            if (event.data === 1) wasPlaying.current = true;
            if (event.data === 0) fail(true);
          },
          onError: (event) => fail([100, 101, 150].includes(event.data)),
        },
      });
    }).catch(() => fail(false));
    return () => { active = false; clearTimeout(timeout); destroy(); };
  }, [videoId, channel.title, refresh, attempt]);

  const ended = endedIds.length > 0 && !videoId;
  let message = "لا يتوفر بث مباشر قابل للتشغيل حالياً. يمكنك مشاهدة القناة عبر موقعها الرسمي.";
  if (loading && !stream) message = "جارٍ التحقق من البث المباشر…";
  else if (ended) message = "انتهى البث أو تعذر تضمينه. نتحقق تلقائياً من توفر بث بديل.";
  else if (unavailable || playerError) message = "تعذر تشغيل البث حالياً. أعد المحاولة أو شاهد القناة عبر موقعها الرسمي.";

  return (
    <section className={channel.className}>
      <MainHeader smHeader={channel.subtitle} Header={channel.title} />
      <div className="container">
        <div className="live-window">
          <div className="live-player-host" ref={host} hidden={!videoId || playerError} />
          {(!videoId || playerError) && <p role="status">{message}</p>}
        </div>
        <div className="live-actions">
          <button className="main-btn second-btn" disabled={loading} onClick={() => { setAttempt(value => value + 1); refresh(); }}>إعادة المحاولة</button>
          <a className="main-btn" href={channel.official} target="_blank" rel="noopener noreferrer">شاهد البث عبر الموقع الرسمي</a>
          <a href={`https://www.youtube.com/@${channel.name === "makkah" ? "SaudiQuranTv" : "SaudiSunnahTv"}/live`} target="_blank" rel="noopener noreferrer">القناة الرسمية على YouTube</a>
        </div>
      </div>
    </section>
  );
}

const Live = () => {
  const [streams, setStreams] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const request = useRef(null);
  const lastRequest = useRef(0);
  const mounted = useRef(true);
  const refresh = useCallback(async () => {
    if (request.current || Date.now() - lastRequest.current < 30000) return;
    lastRequest.current = Date.now();
    const controller = new AbortController();
    request.current = controller;
    setLoading(true);
    try {
      const { data } = await axios.get("/api/live-streams", { timeout: 12000, signal: controller.signal });
      if (!CHANNELS.every(channel => Array.isArray(data.channels?.[channel.name]?.videoIds))) throw new Error("Invalid broadcast response");
      if (mounted.current) {
        setStreams(Object.fromEntries(CHANNELS.map(channel => [channel.name, {
          ...data.channels[channel.name],
          videoIds: data.channels[channel.name].videoIds.filter(id => typeof id === "string" && /^[A-Za-z0-9_-]{11}$/.test(id)),
        }])));
        setUnavailable(false);
      }
    } catch {
      if (mounted.current) setUnavailable(true);
    } finally {
      request.current = null;
      if (mounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    refresh();
    const interval = setInterval(() => { if (!document.hidden) refresh(); }, 60000);
    return () => { mounted.current = false; clearInterval(interval); request.current?.abort(); };
  }, [refresh]);

  return (
    <section className="live-section">
      <MainHeading title="البث المباشر" breadcrumb={{ الرئيسية: "/", بث: "/live" }} />
      {CHANNELS.map(channel => <Broadcast key={channel.name} channel={channel} stream={streams?.[channel.name]} loading={loading} unavailable={unavailable} refresh={refresh} />)}
    </section>
  );
};

export default Live;
