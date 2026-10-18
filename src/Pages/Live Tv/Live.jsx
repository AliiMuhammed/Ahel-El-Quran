import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import { FiExternalLink, FiRadio, FiRefreshCw, FiYoutube } from "react-icons/fi";
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
  const [readyId, setReadyId] = useState(null);
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
    setReadyId(null);
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
            setReadyId(videoId);
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
  const checking = (loading && !stream) || (videoId && readyId !== videoId && !playerError);
  const showFallback = !videoId || playerError;
  let title = "البث غير متاح حالياً";
  let message = "لا يوجد بث مباشر متاح الآن. يمكنك متابعة القناة من أحد مصادرها الرسمية.";
  if (checking) {
    title = "جارٍ تجهيز البث المباشر";
    message = "لحظات ونصلك بالبث من القناة الرسمية…";
  } else if (ended) {
    title = "انتهى البث المباشر";
    message = "نتحقق تلقائياً من توفر بث بديل. يمكنك المتابعة عبر المصادر الرسمية أدناه.";
  } else if (unavailable || playerError) {
    title = "تعذر تشغيل البث حالياً";
    message = "أعد المحاولة، أو تابع البث مباشرة من أحد المصادر الرسمية أدناه.";
  }

  return (
    <section className={channel.className}>
      <MainHeader smHeader={channel.subtitle} Header={channel.title} />
      <div className="container">
        <div className={`live-window${showFallback || checking ? " is-fallback" : ""}`}>
          <div className="live-player-host" ref={host} hidden={showFallback} />
          {(showFallback || checking) && <div className="live-fallback">
            <div className="live-status" role="status">
              <span className={`live-status-icon${checking ? " is-checking" : ""}`} aria-hidden="true">
                {checking ? <FiRefreshCw /> : <FiRadio />}
              </span>
              <h2>{title}</h2>
              <p>{message}</p>
            </div>
            {!checking && <div className="live-actions">
              <button className="live-action live-action-primary" disabled={loading} onClick={() => { setAttempt(value => value + 1); refresh(); }}>
                <FiRefreshCw aria-hidden="true" />إعادة المحاولة
              </button>
              <a className="live-action" href={channel.official} target="_blank" rel="noopener noreferrer">
                <FiExternalLink aria-hidden="true" />شاهد البث عبر الموقع الرسمي
              </a>
              <a className="live-youtube-link" href={`https://www.youtube.com/@${channel.name === "makkah" ? "SaudiQuranTv" : "SaudiSunnahTv"}/live`} target="_blank" rel="noopener noreferrer">
                <FiYoutube aria-hidden="true" />القناة الرسمية على YouTube<FiExternalLink aria-hidden="true" />
              </a>
            </div>}
          </div>}
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
