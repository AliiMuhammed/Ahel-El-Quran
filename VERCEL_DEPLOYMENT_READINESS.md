# Ahel El Quran — Vercel deployment readiness

Verified locally on 18 October 2026. **READY WITH DOCUMENTED LIMITATIONS.**

## A. Project inspection

- Actual clone: `/home/https_ali_muhammed/Documents/Ahel-El-Quran`. The requested `/home/https_ali_muhammed/Documents/Ahel-El-QuranAhel-El-Quran` does not exist. The existing clone's origin is `https://github.com/AliiMuhammed/Ahel-El-Quran`; no additional clone was created.
- Branch: `master`. Commit: `e3cede5e1138cd88aaf609ed031f4e16610eb721`. Local `master` matches the locally cached `origin/master` (0 ahead, 0 behind); remote branch freshness was not checked with a fetch.
- Initial owner change: `package-lock.json`, containing 410 deleted lines for optional dependency entries. Preserved; preparation adds only root Node engine metadata to that owner version.
- React/React DOM 18.2.0, Create React App (`react-scripts` 5.0.1), React Router DOM 6.18.0 (`createBrowserRouter`), Redux 4.2.1, Bootstrap 5.3.2, React Bootstrap 2.9.1, Axios 1.6.0. No separate backend.
- Node **24.x** is pinned through `package.json` engines. Local installation, tests and build used Node 24.19.0 and npm 11.17.0. Lockfile format is v3. There was no original Node/npm pin; these are the verified versions, not a claim that all older versions fail. Use the npm bundled with Node 24; no global npm replacement is needed.
- No local `.env` files, application environment-variable references, embedded API keys, private tokens, private keys or backend credentials were found in the inspected project. The providers used here do not require a key for these requests. This source review is not a full historical secret audit.
- CRA builds for `/`; imported assets are bundled beneath `/static/media`. CSS already sets RTL. `public/index.html` now declares Arabic. Netlify's catch-all remains intact and is not used by Vercel.

## B. Changes made

| File | Purpose |
| --- | --- |
| `vercel.json` | CRA preset, reproducible install, production output and static-first SPA routing |
| `package.json`, `package-lock.json` | Pin Node 24.x; preserve existing dependencies and owner lockfile edits |
| `.gitignore` | Ignore all `.env` variants and local `.vercel/` configuration |
| `public/index.html` | Correct document language to Arabic; preserve RTL CSS/layout |
| `src/Pages/Single Reader/Reader.jsx` | Resolve a cold reader URL by its name using existing cached data or MP3Quran; show loading/error feedback and retain the existing player |
| `src/Redux/Actions/Location.js`, `src/Redux/Reducers/location-reducer.js` | Track permission loading/error and bound geolocation waiting to 10 seconds |
| `src/Pages/Home/components/prayers times/Prayers.jsx` | Recover after denied/unavailable location and show an Arabic prayer-provider error |
| `src/Pages/Azkar/Azkar.jsx`, `src/Pages/Home/components/Azkar.jsx` | Use verified HTTPS equivalents for provider audio, including previously cached HTTP URLs |
| `src/Pages/Single Reader/Reader.test.jsx`, `src/Pages/Home/components/prayers times/Prayers.test.jsx` | Focused regressions for the navigation and permission fixes |
| `VERCEL_DEPLOYMENT_READINESS.md` | This report and deployment checklist |

`vercel.json` serves existing files first, protects `/static` misses, permits the existing dynamic reader/profile routes (including names containing dots), rejects other filename-shaped misses, and sends remaining application URLs to `index.html`. Unknown application URLs still render the original React NotFound page. Missing assets are not rewritten to the application shell.

**Build-command correction:** plain `npm run build` passed locally, but `CI=true npm run build` failed because CRA turns the existing lint warnings into errors. The Vercel command is therefore **`CI=false npm run build`**. This keeps lint warnings visible and retains compilation/lint errors as errors; it avoids unrelated component refactoring. Tests were separately run with `CI=true`. No dependencies were upgraded or added.

## C. Verification

| Check | Result |
| --- | --- |
| `npm ci` | Passed twice, including after engine metadata changes; 1,575 packages installed |
| `npm run build` before preparation | Passed with warnings |
| `CI=true npm run build` before preparation | Failed on existing ESLint warnings; reproduced and addressed by the scoped Vercel command above |
| `CI=false npm run build` after source changes | Passed; 30 generated files, approximately 30.6 MB including source maps |
| Existing automated tests | No tests existed; the baseline test command reported no tests found |
| `CI=true npm test -- --watchAll=false --runInBand` | **4/4 passed across 2 suites** after first reproducing the failures |
| Vercel configuration | Validated against the official JSON schema; upstream mixed-draft schema meta-validation had to be skipped in the installed validator |
| Production assets | All 27 manifest URLs returned their exact generated file bytes; 8 representative missing JS/image/CSS/audio/font/JSON/static URLs returned 404 |
| Browser direct navigation and refresh | Passed for `/`, `/quran`, a real `/reader/:readerName`, `/azkar`, `/radio`, `/live`, `/aboutUs`, `/contactUs`, `/login`, `/sign-up` |
| Profile and original 404 | Guest profile redirects home; demo signup/login and authenticated `/profile/:name` direct navigation/refresh passed; unknown application route renders original NotFound |
| Arabic/responsive presentation | RTL and Arabic text confirmed; desktop 1440px and mobile 390px screenshots visually inspected; five mobile pages had no horizontal overflow; mobile menu open/navigation/close passed; Cairo and Amiri fonts loaded |
| Browser runtime | No uncaught application JavaScript errors observed; injected network failures produced the expected resource errors |
| Permission/provider failures | Denied geolocation displays an Arabic error and permits retry; granted simulated Cairo coordinates render six prayer cards; injected prayer/Quran API failures show Arabic feedback |
| Recitation | Cold reader URL resolves and sampled recitation audio reaches browser media readiness after a click |

The local server served the **production build** using the rules in `vercel.json`; it was temporary verification tooling, not a new application backend. This checks local routing behavior, not Vercel's deployed edge implementation. Build/dependency directories remain ignored. Temporary logs, browser scripts and screenshots are under `/tmp/ahel-vercel-audit/` and are not repository additions.

### External integrations and remaining limits

- **Aladhan:** HTTPS JSON succeeded with `Access-Control-Allow-Origin: *`; browser requests succeeded for granted Cairo coordinates. Permission denial no longer leaves the prayer section loading indefinitely.
- **AlQuran Cloud:** sampled ayah and tafsir requests succeeded over HTTPS with permissive CORS; real homepage content rendered and sampled audio returned partial MPEG content.
- **MP3Quran:** HTTPS reciter/radio lists succeeded in HTTP and browser checks, including their HTTPS redirect to `www`; responses allowed cross-origin access. The sampled API returned 243 reciters and 177 radio channels. Reciter servers and radio URLs in these responses were HTTPS.
- **Hisn Muslim:** category/detail requests succeeded over HTTPS with permissive CORS. The JSON still advertises HTTP audio; sampled HTTPS equivalents returned 206 `audio/mpeg`, and rendered category audio used HTTPS after the correction. Every individual recording was not played.
- **Radio limitation:** `https://backup.qurango.net/radio/ibrahim_alakdar` returned MPEG audio bytes to a direct request, but Chromium blocked its media request with `net::ERR_BLOCKED_BY_ORB` and media format error code 4. The list/interface loads; successful radio playback is **not verified**. Other stations/devices were not exhaustively tested. Provider and URLs were preserved.
- **YouTube limitation:** both existing embeds (`moQtMet7F7w`, `-mr6TD6YxR8`) loaded YouTube's player but reported that the live recording was unavailable. Owner-selected current broadcast URLs are needed if working live TV is required; no substitute videos were invented. Google Maps rendered in the contact page.
- **Notifications/Adhan:** source review confirms browser Notification permission and an open page are required. Browser autoplay policy may block scheduled audio without prior user interaction; background/closed-page delivery and a real prayer-time notification were not verified. No service worker or backend was introduced.
- No hardcoded application localhost URLs or explicit HTTP request endpoints were found. HTTPS provider CORS headers were sampled with a prospective HTTPS Origin as well as tested from localhost; the eventual Vercel origin and browser/device permissions still need a smoke check after deployment.
- **Dependency debt:** npm reported **106 advisories: 14 low, 48 moderate, 39 high, 5 critical**, including direct dependency chains for Axios, React Router, CRA and Swiper. Counts include build tooling/transitives and do not establish exploitability in this app. No `npm audit fix`, forced upgrade or migration was applied. This preparation is not a security clearance; dependency remediation remains separate work.
- CRA reports existing ESLint warnings, an outdated Browserslist dataset and a Babel preset dependency warning. Reproducible installation and the configured build passed despite those warnings.

### Demo account limitation

Accounts, plaintext passwords, profile images and favorites remain in this browser origin's `localStorage`. They are demo data, can be inspected/edited by scripts or anyone using the browser, and are not secure server accounts. They are not synchronized between browsers/devices; the new Vercel origin will not automatically share the existing Netlify origin's data. Existing owner/browser data was not cleared.

**Do not use real passwords or sensitive personal information.** Recommended small notice for a separately approved copy change:

> هذا حساب تجريبي على هذا المتصفح فقط. لا تستخدم كلمة مرور حقيقية أو بيانات شخصية حساسة.

No account backend, database or authentication secrets were added, and no major UI change was made.

## D. Recommended Vercel setup and import checklist

1. Review the local preparation changes **and the pre-existing lockfile changes**. The owner subsequently authorized publication on `codex/vercel-preparation`; merging that branch into `master` remains a separate step. Once approved, the owner can commit/push and merge it to `master`. Importing GitHub's current `master` before these changes reach it will omit this preparation.
2. In Vercel, select **Add New → Project**, import the existing `AliiMuhammed/Ahel-El-Quran` repository, and confirm the account scope. Use `ali-muhammed-ahmeds-projects` **only after the owner confirms it is the intended Hobby account**. No account/team was accessed or confirmed during preparation.
3. Confirm these settings (the build/install/output settings are also in `vercel.json`):

| Setting | Value |
| --- | --- |
| Project name | `ahel-el-quran` |
| Plan | Hobby; keep the personal/non-commercial project within included quotas |
| Framework Preset | Create React App |
| Root Directory | `./` |
| Node.js | `24.x` |
| Install Command | `npm ci` |
| Build Command | `CI=false npm run build` |
| Output Directory | `build` |
| Environment variables | None required by the app; `CI=false` is scoped in the command, so no dashboard variable is needed |
| Production branch | `master`, after reviewed preparation reaches it |

4. When the owner chooses to deploy, inspect the build log and then test the generated HTTPS `.vercel.app` URL: homepage, direct reader/profile URL, refresh, missing asset 404, mobile menu, content, recitation and permission denial/grant. Recheck radio/live availability and notification behavior on a normal target browser/device. No custom domain or paid add-on is needed for the basic import.
5. Keep Netlify unchanged. Do not add functions, databases, integrations, paid plans or environment secrets for this static application.

Official references: [CRA on Vercel](https://vercel.com/docs/frameworks/frontend/create-react-app), [supported Node versions](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions), [Vercel configuration](https://vercel.com/docs/project-configuration/vercel-json), [Hobby plan](https://vercel.com/docs/plans/hobby). Hobby is intended for personal/non-commercial use and remains subject to usage limits; zero subscription cost is not a promise of unlimited usage.

## E. Git status at the end of local preparation

The following is the preparation snapshot, before the owner subsequently authorized committing and pushing a new branch.

Modified tracked files:

- `.gitignore`
- `package.json`
- `package-lock.json` (includes the preserved owner change)
- `public/index.html`
- `src/Pages/Azkar/Azkar.jsx`
- `src/Pages/Home/components/Azkar.jsx`
- `src/Pages/Home/components/prayers times/Prayers.jsx`
- `src/Pages/Single Reader/Reader.jsx`
- `src/Redux/Actions/Location.js`
- `src/Redux/Reducers/location-reducer.js`

New, untracked files:

- `vercel.json`
- `src/Pages/Single Reader/Reader.test.jsx`
- `src/Pages/Home/components/prayers times/Prayers.test.jsx`
- `VERCEL_DEPLOYMENT_READINESS.md`

All changes remain uncommitted. Final diff/whitespace review performed. `netlify.toml` is unchanged; build, dependencies and private configuration are not staged or tracked. No commits, branch switches, pushes, merges, history rewrites, Vercel project creation/linking, deployment, Netlify changes or paid-service enablement occurred. Network activity was limited to dependency installation/audit, documentation research and read-only provider/browser checks.

## F. Deployment readiness

**READY WITH DOCUMENTED LIMITATIONS.** The static install/build/routing checks pass locally. Review and merge the preparation branch before importing `master`. Demo authentication, dependency advisories, radio playback, unavailable YouTube broadcasts and real deployment/device checks remain as documented above. The application is **not deployed to Vercel**.

Skills/tools used: Ponytail; Superpowers planning, systematic debugging, test-driven checks and completion verification; Vercel deployment guidance. Shell/npm/Git inspection, Playwright Chromium, workspace dependency discovery, official documentation browsing and Valyu search were actually used. No Vercel project-management/deployment tool was invoked.

## Authorized Git publication follow-up

After the local-only preparation, the owner requested a new branch and push. These preparation changes, including the preserved owner lockfile edits, are being committed and pushed to `origin/codex/vercel-preparation`, based on `e3cede5e1138cd88aaf609ed031f4e16610eb721`. No merge, pull request, Vercel linking or deployment is included in this authorization.
