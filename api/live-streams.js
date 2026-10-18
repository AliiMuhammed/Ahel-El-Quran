const { getCache } = require('@vercel/functions');

const CHANNELS = {
  makkah: 'UCos52azQNBgW63_9uDJoPDA',
  madinah: 'UCROKYPep-UuODNwyipe6JMw',
};
// Search can omit long-running broadcasts; these candidates still require live API validation.
const KNOWN_IDS = { makkah: 'eC4LfEVxvKg', madinah: 'Rs7St51oDDc' };
const CHECK_MS = 5 * 60 * 1000;
const SEARCH_MS = 60 * 60 * 1000;
const VIDEO_ID = /^[A-Za-z0-9_-]{11}$/;

function createResolver({ cache, apiKey, fetcher = fetch, now = Date.now }) {
  // shortcut: cooldown writes are not atomic; add an atomic quota budget if concurrent cold starts exhaust quota.
  let pending;
  async function youtube(resource, params) {
    const url = new URL(`https://www.googleapis.com/youtube/v3/${resource}`);
    url.search = new URLSearchParams({ ...params, key: apiKey });
    const response = await fetcher(url.toString(), { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error('YouTube request failed');
    const data = await response.json();
    if (!Array.isArray(data.items)) throw new Error('Invalid YouTube response');
    return data.items;
  }
  async function activeVideos(ids, channelId) {
    if (!ids.length) return [];
    const videos = await youtube('videos', { part: 'snippet,status,liveStreamingDetails', id: ids.join(',') });
    return videos.filter(video => VIDEO_ID.test(video.id) && ids.includes(video.id) &&
      video.snippet?.channelId === channelId && video.snippet.liveBroadcastContent === 'live' &&
      video.status?.embeddable === true && video.status.privacyStatus === 'public' &&
      video.liveStreamingDetails?.actualStartTime && !video.liveStreamingDetails.actualEndTime
    ).map(video => video.id);
  }
  async function resolveChannel(name, channelId) {
    const unavailable = { videoIds: [], state: 'unavailable' };
    if (!apiKey) return unavailable;
    let record;
    const timestamp = now();
    const key = `ahel-el-quran:live:v1:${name}`;
    try {
      record = await cache.get(key) || { videoIds: [], searchedAt: 0, checkedAt: 0 };
      if (timestamp - record.checkedAt < CHECK_MS) return record;
      let videoIds = await activeVideos([...new Set([...record.videoIds, KNOWN_IDS[name]])], channelId);
      if (!videoIds.length && timestamp - record.searchedAt >= SEARCH_MS) {
        record = { videoIds: [], searchedAt: timestamp, checkedAt: timestamp, state: 'unavailable' };
        // Reserve the search cooldown before calling YouTube, including failed requests.
        await cache.set(key, record, { ttl: 86400 });
        const results = await youtube('search', {
          part: 'snippet', channelId, type: 'video', eventType: 'live',
          videoEmbeddable: 'true', videoSyndicated: 'true', maxResults: '5', order: 'date',
        });
        const ids = results.map(item => item.id?.videoId).filter(id => VIDEO_ID.test(id));
        videoIds = await activeVideos(ids, channelId);
      }
      record = { videoIds, searchedAt: record.searchedAt, checkedAt: timestamp, state: videoIds.length ? 'live' : 'offline' };
      await cache.set(key, record, { ttl: 86400 });
      return record;
    } catch {
      // Cache errors must not trigger an uncached discovery fallback.
      if (record) {
        try { await cache.set(key, { ...record, ...unavailable, checkedAt: timestamp }, { ttl: 86400 }); } catch {}
      }
      return unavailable;
    }
  }
  return async function resolve() {
    if (!pending) {
      pending = Promise.all(Object.entries(CHANNELS).map(async ([name, id]) => [name, await resolveChannel(name, id)]))
        .then(entries => ({ channels: Object.fromEntries(entries) }))
        .finally(() => { pending = undefined; });
    }
    return pending;
  };
}

let resolver;
async function handler(req, res) {
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=60');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (new URL(req.url, 'https://localhost').search) return res.status(400).json({ error: 'Query parameters are not supported' });
  try {
    if (!resolver) resolver = createResolver({ cache: getCache({ namespace: 'ahel-el-quran-live' }), apiKey: process.env.YOUTUBE_API_KEY });
    return res.status(200).json(await resolver());
  }
  catch { return res.status(503).json({ error: 'Live broadcasts are temporarily unavailable' }); }
}
module.exports = handler;
module.exports.createResolver = createResolver;
module.exports.CHANNELS = CHANNELS;
