const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createResolver, CHANNELS } = require('../api/live-streams');
const ids = { makkah: 'makkahlive1', madinah: 'madinahliv1' };
function setup() {
 let time = 2000000000000;
 const store = new Map();
 const cache = { get: async key => store.get(key), set: async (key, value) => store.set(key, structuredClone(value)) };
 const calls = [];
 const live = (id, channelId) => ({ id, snippet: { channelId, liveBroadcastContent: 'live', title: 'Official live' }, status: { embeddable: true, privacyStatus: 'public' }, liveStreamingDetails: { actualStartTime: '2026-01-01T00:00:00Z' } });
 const videos = new Map(Object.entries(CHANNELS).map(([name, channelId]) => [ids[name], live(ids[name], channelId)]));
 let failure = false;
 const fetcher = async url => {
  const u = new URL(url); calls.push(u);
  if (failure) return { ok: false, status: 403 };
  const items = u.pathname.endsWith('/search') ? [...videos.values()].filter(v => v.snippet.channelId === u.searchParams.get('channelId')).map(v => ({ id: { videoId: v.id } })) : u.searchParams.get('id').split(',').map(id => videos.get(id)).filter(Boolean);
  return { ok: true, json: async () => ({ items }) };
 };
 const resolve = createResolver({ cache, fetcher, now: () => time, apiKey: 'test-server-secret' });
 return { resolve, cache, calls, videos, live, advance: ms => { time += ms; }, fail: () => { failure = true; } };
}

test('discovers only official live, public, embeddable videos and caches requests', async () => {
 const s = setup();
 s.videos.set('endedvideo1', { ...s.live('endedvideo1', CHANNELS.makkah), liveStreamingDetails: { actualEndTime: '2026-10-01' } });
 s.videos.set('privatevid1', { ...s.live('privatevid1', CHANNELS.makkah), status: { embeddable: false, privacyStatus: 'public' } });
 const [data] = await Promise.all([s.resolve(), s.resolve(), s.resolve()]);
 assert.deepEqual(data.channels.makkah.videoIds, [ids.makkah]);
 assert.deepEqual(data.channels.madinah.videoIds, [ids.madinah]);
 assert.equal(s.calls.length, 4);
 await Promise.all([s.resolve(), s.resolve()]);
 assert.equal(s.calls.length, 4);
 const search = s.calls.find(u => u.pathname.endsWith('/search'));
 assert.equal(search.searchParams.get('part'), 'snippet');
 assert.equal(search.searchParams.get('eventType'), 'live');
 assert.equal(search.searchParams.get('videoEmbeddable'), 'true');
 assert(!JSON.stringify(data).includes('test-server-secret'));
});

test('checks ended broadcasts and discovers a replacement after the search cooldown', async () => {
 const s = setup(); await s.resolve(); s.advance(3600001);
 s.videos.get(ids.makkah).liveStreamingDetails.actualEndTime = '2026-10-18';
 s.videos.set('newmakkah01', s.live('newmakkah01', CHANNELS.makkah));
 const result = await s.resolve();
 assert.deepEqual(result.channels.makkah.videoIds, ['newmakkah01']);
});

test('offline discovery and API failures respect the search cooldown', async () => {
 const s = setup(); s.videos.clear(); await s.resolve(); const count = s.calls.length;
 s.advance(300001); await s.resolve();
 assert.equal(s.calls.length, count);
 s.advance(3600001); s.fail(); const result = await s.resolve();
 assert.equal(result.channels.makkah.state, 'unavailable');
 const searches = s.calls.filter(u => u.pathname.endsWith('/search')).length;
 s.advance(300001); await s.resolve();
 assert.equal(s.calls.filter(u => u.pathname.endsWith('/search')).length, searches);
});

test('cache outage fails closed without spending YouTube quota', async () => {
 let calls = 0;
 const resolve = createResolver({ cache: { get: async () => { throw Error('cache offline'); } }, apiKey: 'test', fetcher: () => { calls++; throw Error('must not call'); } });
 const result = await resolve();
 assert.equal(result.channels.makkah.state, 'unavailable');
 assert.equal(calls, 0);
});


test('rejects arbitrary discovery parameters and handles an unconfigured key without leaking data', async () => {
 const handler = require('../api/live-streams');
 function response() { return { headers: {}, setHeader(k, v) { this.headers[k] = v; }, status(code) { this.code = code; return this; }, json(body) { this.body = body; return this; } }; }
 const bad = response(); await handler({ method: 'GET', url: '/api/live-streams?channelId=attacker' }, bad); assert.equal(bad.code, 400);
 const post = response(); await handler({ method: 'POST', url: '/api/live-streams' }, post); assert.equal(post.code, 405);
 const oldKey = process.env.YOUTUBE_API_KEY; delete process.env.YOUTUBE_API_KEY;
 try { const res = response(); await handler({ method: 'GET', url: '/api/live-streams' }, res); assert.equal(res.code, 200); assert.equal(res.body.channels.makkah.state, 'unavailable'); }
 finally { if (oldKey !== undefined) process.env.YOUTUBE_API_KEY = oldKey; }
});
