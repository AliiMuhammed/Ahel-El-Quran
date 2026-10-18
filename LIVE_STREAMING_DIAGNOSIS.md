# Production livestream discovery diagnosis — 18 October 2026

**Confirmed cause; minimal fix prepared locally, not deployed.**

## Production inspection

The existing `ahel-el-quran` Hobby project serves deployment `dpl_9uW2vigzk8hWpLgRvffbW9wujC4k` from `master`, merge commit `1a4dd1bdffdf20e4b2edb3cab903f4892614ebdb`. Its endpoint returned HTTP 200 with empty IDs and `offline` for both channels. Vercel's dashboard shows `YOUTUBE_API_KEY` as a Secret scoped to **Production and Preview**. No value was displayed and no setting was changed.

The 13:14:13 UTC Function invocation shows two `search.list` calls, Runtime Cache reads/writes, and **no `videos.list` call**. Thus search supplied no valid candidate IDs; video validation did not reject these streams. Subsequent checks retained the empty result during the hourly search cooldown. No application errors were logged for that invocation.

The Vercel connector and existing local API credentials returned HTTP 403 for the requested team. Inspection used the existing authenticated dashboard browser session. The owner then supplied the existing key privately in the local ignored `.env.production.local`. Diagnostics loaded it directly into the Node process, without printing it. No Production credential was retrieved, rotated or modified.

## Real YouTube API evidence

All diagnostic requests succeeded with HTTP 200 and no quota/authentication error.

| Request variant | Makkah | Madinah |
| --- | --- | --- |
| Existing `eventType=live`, embedding/syndication filters, `order=date`, 5 results | 0 | 0 |
| Remove only `videoSyndicated` | 0 | Not repeated |
| Remove only `videoEmbeddable` | 0 | Not repeated |
| Remove only `order=date` | 0 | Not repeated |
| Remove embedding/syndication filters and ordering; 50 live results | 0 | 0 |
| Also remove `eventType`; 50 channel video results | 50, none live | 50, none live |

All live-only responses had no `nextPageToken`, so pagination could not recover their missing results. The unrestricted channel searches did have subsequent pages; an unbounded crawl of thousands of older videos was intentionally avoided.

One batched `videos.list` returned:

| Video | Verified channel | Public / embeddable | Live metadata |
| --- | --- | --- | --- |
| `eC4LfEVxvKg` | `UCos52azQNBgW63_9uDJoPDA` | true / true | `live`, started `2026-09-13T17:04:58Z`, no end |
| `Rs7St51oDDc` | `UCROKYPep-UuODNwyipe6JMw` | true / true | `live`, started `2026-07-28T17:24:40Z`, no end |

Both satisfy every existing resolver validation condition. Both also played through real embedded YouTube players in the browser. Directly navigating to an embed without a Referer produced expected error 153; normal iframe integration with an origin played successfully.

Documented `channels.list` identified both official upload playlists. Their first 50 items were fetched and validated with `videos.list`: neither batch contained an active broadcast. Adding that bounded uploads path would not fix this observed failure, so it was not added.

**Conclusion:** the current API's live-search results omit these long-running, otherwise playable official broadcasts. Neither the two restrictive filters nor ordering alone explains the failure. The server's search-only discovery and hour-long negative cache amplify this external discovery omission into a false-offline page. Google's internal reason for the omission is not exposed; it is not established that all channel search results everywhere omit these IDs.

## Minimal local correction

`api/live-streams.js` now includes the two API-verified IDs as **candidates**, batched with cached IDs in the existing five-minute `videos.list` validation. They are never returned without checking exact official channel ownership, current live status, public visibility, embedding permission, actual start and absence of actual end. No broadcaster restriction is bypassed.

This runs even when the previous search was empty and its hour-long cooldown remains active. An eligible known candidate can therefore recover on the next five-minute validation, plus the existing minute-long response/page caching intervals. Search frequency is unchanged; no new search variant or polling loop was added. The existing negative cache can remain visible until its current five-minute check expires.

The two known candidate IDs provide recovery for the currently confirmed broadcasts; **they are not permanent broadcast URLs**. If those broadcasts end and a replacement is absent from search, automatic discovery remains unable to identify the unknown replacement. The UI retains Arabic offline feedback and official links. New indexed, eligible search candidates still replace ended broadcasts automatically. Guaranteed discovery of every future unindexed stream would require an authoritative broadcaster discovery source or an updated validated candidate; this patch does not promise that guarantee.

The first 50 uploads did not help, and removing all search safety filters did not help, so neither was added to the production resolver. The discovery correction changes no provider, backend project, database, paid service or deployment setting. The subsequently approved UI update hides app fallback controls while a player works and presents Arabic loading/error panels with responsive green actions when unavailable.

## Quota and verification

- Diagnostics: **9 `search.list` calls**, 1 `channels.list`, 2 `playlistItems.list`, and 3 `videos.list` calls. The local corrected resolver then made **2 additional `videos.list` calls**, with **zero searches**, while seeded with a recent empty search cache. Total: **17 real API requests: 9 searches and 8 other endpoint units**. No quota increase was requested. Current allocations and consumed project-wide counters were not read from Google Cloud; successful requests establish usable quota at test time, not the exact remaining allowance.
- Search limits remain hourly per cached channel: roughly 48/day in a single retained region/environment. Low-cost video checks remain five-minute batches (about 576/day across both channels when healthy); cached and known IDs share each batch. Offline/search-candidate validation can add about 48 video units/day. Eviction, simultaneous cold starts and separate Preview traffic can increase usage; the existing cache is not an atomic quota budget.
- Two regression tests failed before the fix and passed after it: recovery from an empty search during the hourly cooldown; and rejection of wrong-owner, non-embeddable, private, upcoming, not-started or ended known candidates.
- **7 Node resolver tests passed. 10 React tests passed.** Existing React termination/replacement tests remain passing.
- Local browser verification used the existing production frontend build, unchanged by this patch, and the modified resolver against the real Google API. A recent offline cache recovered to both verified IDs without searches; both players appeared on the Arabic Live page. Both official streams were also independently observed reaching player state 1 (PLAYING).
- `git diff --check` passed. The initial diagnosis did not rebuild the unchanged frontend. Publication verification below rebuilds the full PR, including the subsequently approved UI changes. Actual Vercel execution of this patch remains unverified until an approved deployment.

## Credential/file safety and Git

`.env.production.local` is Git-ignored. Added `.vercelignore` explicitly excludes `.env*` and environment editor swap files. Added the environment swap pattern to `.gitignore`; a transient editor swap file had appeared while the owner edited the key. No secret contents were read from that swap file. The actual environment file and swap files must stay untracked.

Publication scope: `api/live-streams.js`, `tests/live-streams.test.cjs`, `.gitignore`, `LIVE_STREAMING_SETUP.md`, new `.vercelignore` and this report, plus the approved `src/Pages/Live Tv/Live.jsx`, `Live.test.jsx` and `style/live.css` UI changes. Initial diagnosis was based on `05aeb876675d1a9b131c0775055c73ee32989516`. Publication is prepared on `fix/youtube-live-discovery`, created from latest `origin/master` (`1a4dd1bdffdf20e4b2edb3cab903f4892614ebdb`). The owner subsequently approved including the Live-page UI changes in this same PR: fallback actions only appear when unavailable, with revised Arabic loading/error panels and responsive styling.

The initial diagnosis made no remote changes. The owner subsequently authorized committing this narrow fix and opening a PR against `master`. Merging, initiating deployments, Production writes, credential changes and paid resources remain outside this publication step.

References: [search.list filters](https://developers.google.com/youtube/data/reference/rest/v3/search/list), [videos resource](https://developers.google.com/youtube/data/reference/rest/v3/videos), [playlistItems.list](https://developers.google.com/youtube/data/reference/rest/v3/playlistItems/list), [quota costs](https://developers.google.com/youtube/data/determine_quota_cost).


## Publication verification and post-merge checklist

Publication verification uses an export of the staged PR tree: the expanded 12 React tests plus 7 resolver tests, production build, a fresh real-API validation of both official candidates (2 video requests, no searches), and checks for the private key in source/diff/logs/build output. No key or local environment file is copied into the export. Publication results are recorded in the PR. The UI tests cover healthy players hiding fallback controls, per-channel failure, retry recovery, initial loading, ended broadcasts and late player events.

After owner review and merge:

- Check Vercel's existing Git integration for a Production deployment of the new `master` merge SHA. Wait for that deployment; do not start a duplicate deployment. A branch push may produce an existing-integration Preview deployment; it is not a Production promotion.
- Fetch `https://ahel-el-quran.vercel.app/api/live-streams`: HTTP 200, both channels `live`, and IDs validated against their exact official channel, public/live/embedding metadata. Allow the existing five-minute Runtime Cache check and one-minute CDN/page intervals to expire before declaring a stale response a failure.
- Open `https://ahel-el-quran.vercel.app/live`; start both Makkah and Madinah players. Confirm actual live playback and the existing Arabic layout. Confirm the app fallback buttons/links are hidden once each player is ready and return only for a failed/offline channel; YouTube’s own player controls remain intact.
- Reuse local simulated-ended/offline/error regressions; never terminate or modify a real broadcast. Confirm ended or non-embeddable IDs are rejected, replacement discovery is bounded, and official viewing links remain available when playback fails.
- Inspect Production Function logs and Runtime Cache: requests execute in the configured region, cached results are reused, healthy playback needs no searches, and retries do not create a search loop. Existing instrumentation may show request metadata but not Google response bodies; do not log credential-bearing request URLs.
- Check browser source, JS bundles, endpoint JSON and deployment artifacts for key exposure without printing the key. Confirm `YOUTUBE_API_KEY` remains server-only and `.env*` / environment swap files were not uploaded.
- Check the actual Google Cloud project's YouTube quota counters. The expected normal path uses five-minute video batches, not per-viewer searches; remember separate Preview traffic can also use the existing key. Do not raise quotas or enable paid resources automatically.
