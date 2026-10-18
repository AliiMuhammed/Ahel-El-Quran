let pending;

export function loadYouTube() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!pending) {
    pending = new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.async = true;
      const previous = window.onYouTubeIframeAPIReady;
      const timeout = setTimeout(() => finish(new Error("Player timed out")), 12000);
      const finish = (error) => {
        clearTimeout(timeout);
        window.onYouTubeIframeAPIReady = previous;
        if (error) { script.remove(); reject(error); }
        else resolve(window.YT);
      };
      window.onYouTubeIframeAPIReady = () => {
        finish();
        if (typeof previous === "function") previous();
      };
      script.onerror = () => finish(new Error("Player unavailable"));
      document.head.appendChild(script);
    }).catch((error) => { pending = undefined; throw error; });
  }
  return pending;
}
