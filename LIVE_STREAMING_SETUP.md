# Reliable Makkah and Madinah broadcasts

Prepared locally on 18 October 2026 in `/home/https_ali_muhammed/Documents/Ahel-El-Quran`, on `codex/vercel-preparation` from commit `82d5c3e`. The duplicated path supplied in the request does not exist. Changes were initially left uncommitted after local verification; the owner subsequently authorized committing and pushing them to the same `codex/vercel-preparation` branch. No services, credentials or deployments were created or changed.

**Production follow-up:** the owner has since configured the key in Vercel and supplied it privately for local diagnostics. See [LIVE_STREAMING_DIAGNOSIS.md](LIVE_STREAMING_DIAGNOSIS.md) for the confirmed search omission and local correction. The initial setup instructions below remain reference material. Automatic discovery needs a private `YOUTUBE_API_KEY`. Without it, both sections show an Arabic unavailable message, Retry, and official viewing links. No key value has been requested in chat or configured in Production by the agent.

## Research and broadcaster restrictions

- Aloula's official TV pages are [Quran TV](https://aloula.sba.sa/live/quran) and [Sunnah TV](https://aloula.sba.sa/live/sunna). These are television broadcasts, distinct from Quran Radio. The inspected player Share control supplied the page URL. No published third-party embed player, documented public stream-discovery API, or permission to redistribute the underlying media was identified. Absence of a frame-blocking header is not an embedding licence.
- [Aloula's terms](https://aloula.sba.sa/info/terms_of_use) reserve rights in its content and restrict copying/public redistribution without permission, subject to stated exceptions. Consequently the application links to Aloula and does not iframe the whole portal, extract HLS URLs, proxy media, or bypass restrictions. This is a technical integration finding, not a legal clearance for rebroadcasting.
- The official YouTube pages were inspected, including their verification badges, broadcaster descriptions and canonical channel IDs:

| Section | Official channel | Fixed channel ID |
| --- | --- | --- |
| Makkah | [SaudiQuranTv](https://www.youtube.com/@SaudiQuranTv/streams) | `UCos52azQNBgW63_9uDJoPDA` |
| Madinah | [SaudiSunnahTv](https://www.youtube.com/@SaudiSunnahTv/streams) | `UCROKYPep-UuODNwyipe6JMw` |

Runtime discovery uses only these IDs. It does not search by loose keywords or scrape YouTube pages. Videos must belong to the corresponding channel, be public, currently live, embeddable, started, and not ended. YouTube's standard player remains in control of playback, branding, ads and restrictions. Regional, age, account and future broadcaster restrictions can still prevent playback; the application does not circumvent them.

## Implementation and automatic recovery

- `api/live-streams.js`: one Node Vercel Function, using the server environment variable only. It calls documented `search.list` with `eventType=live`, `videoEmbeddable=true`, `videoSyndicated=true` and an allowlisted channel. It validates candidates with `videos.list`, including `actualEndTime`, before returning video IDs. The Production follow-up adds two API-verified official candidate IDs to each five-minute validation because live search omitted both broadcasts; those candidates receive identical ownership/live/embedding checks.
- `src/Pages/Live Tv/Live.jsx` and `youtubePlayer.js`: retain the Arabic Makkah/Madinah headings and existing responsive player dimensions. YouTube IFrame API ended/error events retire invalid streams; the page requests current metadata and mounts an eligible replacement when available. It never intentionally replays an ID it has observed ending during that page visit. Transient player errors can retry the same stream. Existing navigation and other pages are unchanged.
- The page checks the fixed endpoint once per minute while visible. Retry/player events are throttled to one metadata request per 30 seconds per page. No visitor-selected channel, search or cache-busting parameter is accepted by the endpoint.
- Known streams are checked at most once per five minutes per cached channel. A new discovery search is allowed at most once per hour per channel while its shared cache entry is retained. The cooldown is recorded before the search, including failed searches. When a long-running stream ends after that cooldown, discovery can run on the next metadata check; known candidates are revalidated even during this cooldown, so an empty search can recover within the five-minute check plus polling/cache latency. An unknown replacement still depends on search visibility and its hourly cooldown; known IDs are not permanent URLs.
- Offline, missing-key, provider-error and player-error states retain Arabic feedback, Retry and the official Aloula/YouTube links. Recovery mounts a new player automatically. It attempts to resume playback if the visitor had already played the previous stream, but browser autoplay policy may still require another click on Play.

One dependency was added: `@vercel/functions@3.10.1`, for a cache shared across function instances. There is no database, standalone application server, cron, paid streaming provider or media proxy. `vercel.json` adds a 30-second function bound, one region (`iad1`), and protection against unknown API URLs falling through to the SPA. Imported assets and the existing SPA routes remain unchanged.

## Caching, quota and cost

[Vercel Runtime Cache](https://vercel.com/docs/caching/runtime-cache) stores the two small records for up to 24 hours; metadata is refreshed on the shorter intervals above. A 60-second CDN response cache reduces invocations. The cache is regional and shared across projects on a Hobby team, so application-specific keys/namespaces are used. It is separate between Preview and Production.

Google's [current quota documentation](https://developers.google.com/youtube/data/determine_quota_cost) states a default **100 `search.list` calls/day**, with a separate **10,000-unit daily allowance for other endpoints**; `videos.list` costs one unit. Check the owner's actual project quotas, since allocations can change. This implementation needs no OAuth or access to broadcaster accounts.

For one retained regional cache/environment, the hourly search cooldown allows approximately **48 discovery searches/day** across both channels, and five-minute checks plus discovery validation use roughly **624 or fewer video-list units/day** under continuous normal operation. Healthy ongoing streams usually require fewer searches. All viewers share these results.

These are steady-state estimates, not a distributed hard quota guarantee: eviction, simultaneous cold misses and multiple environments/projects can increase calls. Requests within one resolver instance are coalesced. Cache operation errors do not trigger an uncached search fallback. The SDK can fall back to process-local caching outside its supported Runtime Cache environment; actual shared-cache behavior must be checked in the eventual Vercel deployment. Google’s configured project quota is the final hard bound; exhaustion produces graceful unavailability, not quota increases. Prefer configuring the key for Production only initially.

**Expected subscription cost: $0 within assigned YouTube quota and Vercel Hobby usage allowances.** Functions, CDN and Runtime Cache consume platform usage; neither this implementation nor Hobby promises unlimited uptime or traffic. [Hobby is free and subject to usage limits](https://vercel.com/docs/plans/hobby). No billing, paid resource, quota increase or external storage account was enabled.

## Owner setup — stop here until ready

These are instructions for the owner; none were executed:

1. Open [Google Cloud Console](https://console.cloud.google.com/). Select a dedicated project, or create one if desired. Do not enable billing or paid services for this task; stop if the console or organization requires a billing change.
2. In **APIs & Services → Library**, enable **YouTube Data API v3**. Review the project's actual daily quotas.
3. In **Credentials**, create an API key. Under **API restrictions**, choose **Restrict key → YouTube Data API v3**. Do not leave API access unrestricted. A browser HTTP-referrer restriction is unsuitable for this server-side key; do not invent a fixed Vercel Hobby egress IP. Keep the value private. See [Google's key restriction guidance](https://docs.cloud.google.com/api-keys/docs/add-restrictions-api-keys).
4. When the Vercel project exists and configuration is approved, open **Settings → Environment Variables**. Add **`YOUTUBE_API_KEY`**, mark it sensitive where available, and select **Production** initially. Do not use `REACT_APP_YOUTUBE_API_KEY`, put the value in frontend code/requests, commit an environment file, or send it in chat.
5. A later approved deployment/redeployment is required to activate that environment value. Afterward, check `/api/live-streams` for live IDs, Runtime Cache hits, Google quota usage and the `/live` players. Verify the response and JavaScript bundles contain no key. Do not enable automatic Preview use of the same Google quota until its combined budget has been considered.

The owner subsequently authorized a commit and push to `codex/vercel-preparation`. Merging to `master`, deployment, Vercel linking, Google project creation and credential configuration remain outside that authorization. The integration remains at the credential-setup boundary.

## Local verification

- `npm ci`: passed with the updated lockfile. Existing CRA/dependency warnings remain; dependency remediation was outside this Live-page task.
- `CI=false npm run build`: final production build passed, with the existing CRA lint/dependency warnings.
- `CI=true npm test -- --watchAll=false --runInBand`: **10/10 passed** across three suites, including six Live-page tests and the four existing reader/location regressions.
- `node --test tests/live-streams.test.cjs`: **5/5 passed** for official/live/embed filtering, response caching/coalescing, termination/replacement, offline/error cooldown, cache outage, and method/query/key safety.
- In Chromium, actual current official broadcasts `eC4LfEVxvKg` and `Rs7St51oDDc` both reached YouTube's **PLAYING** state. These IDs are test evidence, not production defaults.
- Browser tests simulated an ended broadcast without touching the real service, verified retirement of the old iframe, then simulated discovery replacing an old broadcast with the actual current stream. API responses were supplied by the test harness; the YouTube players and media were real.
- Missing configuration produced usable Arabic fallback links. Blocking the YouTube SDK showed an Arabic error, and Retry loaded the real player after network recovery. Mobile 390px retained RTL and had no horizontal overflow. No uncaught application JavaScript errors were observed; a third-party Google advertising request reported a CORS/network error without preventing playback.
- **Not verified:** an authenticated Google Data API request, Vercel-hosted function routing/shared cache, real production-origin restrictions, or a naturally occurring broadcaster rollover. Those require owner setup and a later approved deployment. Automated API tests use simulated Google responses, not a substitute claim of live API success.

Verification scripts/screenshots are under `/tmp/ahel-live-research/`; no production test hooks were added. Browser event interception and fixture responses exist only in that temporary test harness.

Primary API references: [search.list](https://developers.google.com/youtube/data/reference/rest/v3/search/list), [videos.list](https://developers.google.com/youtube/data/reference/rest/v3/videos/list), [IFrame Player API](https://developers.google.com/youtube/iframe_api_reference), [YouTube developer policies](https://developers.google.com/youtube/terms/developer-policies), [Vercel Node Functions](https://vercel.com/docs/functions/runtimes/node-js).

Tools/skills used: Ponytail, Superpowers brainstorming/debugging/testing/verification, Vercel Functions and Runtime Cache guidance; Valyu, official web documentation, npm/Git inspection and Playwright Chromium. No cloud-management or deployment tools were used.
