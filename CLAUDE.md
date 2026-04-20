# CLAUDE.md

OpenArt influencer-marketing dashboard. Vanilla React + Vite SPA, no backend, all data inlined as JS arrays.

## Stack
- React 18 + Vite (no React Router — navigation is state in `App.jsx`)
- Styling: CSS-in-JS via inline styles + CSS variables in `src/styles/global.css`
- No state libraries, no fetching, no tests

## Repo map
- `src/App.jsx` — root. Single `page` state + `navigate(target, param, extra)` function drives all routing. Back-stack tracked via `*Source` state fields.
- `src/pages/` — top-level views:
  - `Landing` → 3 tiles (By Campaign / By Timeline / By Platform)
  - `Timeline` → month cards → `MonthCrossView`
  - `Platform` → 3 platform overview cards → `PlatformDetail`
  - `CampaignsCrossView` → cross-platform "All Campaigns" landing (entry point for "By Campaign"); searchable list → `CampaignCrossView`
  - `CampaignCrossView` → single-campaign cross-platform summary (X+IG+YT tiles)
  - `MonthCrossView` → single-month cross-platform summary
  - `PlatformDetail` → one platform's cumulative + per-campaign inline detail (via dropdown)
- `src/components/`
  - `CampaignXDetail` / `CampaignIGDetail` / `CampaignYTDetail` — shared leaf views; the single source of truth for a (campaign, platform) breakdown
  - `PlatformAura` — perimeter glow animation, tinted per platform
  - `Particles` — canvas particles, accepts `platform` prop for tint
  - `Bar`, `StatCard`, `CompareCard`, `SectionTitle`, `PageHeader`, `PlatformSwitcher`, `CampaignDropdown`, `AgencyBadge`
- `src/data/`
  - `campaigns.js` — X (Twitter) data + `CAMPAIGN_META` + `MONTHS`/`MONTH_ORDER` registries
  - `campaigns_ig.js` — IG data keyed by campaign id (`IG_CAMPAIGNS`)
  - `campaigns_yt.js` — YT data keyed by campaign id (`YT_CAMPAIGNS`)
  - `platformUtils.js` — `PLATFORM_COLORS`, `xStats`/`igStats`/`ytStats`, `igAgencyBreakdown`, campaign-id lists
  - `utils.js` — `fmt`, `fmtD`, `cpm`, `median`, `sumV`, `sumP`

## Data model
- Campaign ids are short keys (`sd2`, `oaw`, `cb`, `oa`, `nb`, `vl`, etc.). Meta in `CAMPAIGN_META`.
- Every `CAMPAIGN_META` entry has `months: [...]` listing every month the campaign ran. Single-month campaigns have one entry; multi-month ones (e.g. `nb` spans Feb+Mar, `aipa` spans Mar+Apr) list all months.
- **Multi-month campaigns**: `X_STATS_MAP[id].byMonth[monthId]` in `platformUtils.js` holds the per-month data slice. `xStats(id, monthId)` returns the slice when `monthId` is passed, else the cumulative. `campaignStats(id, monthId)` in `CampaignXDetail.jsx` has per-campaign branches (see `sliceNB`/`sliceAIPA`).
- When adding a new campaign or extending one across months, follow `.claude/skills/update_campaign/SKILL.md` — otherwise preview vs. drill-down totals will disagree.
- Platform coverage: only `sd2`, `oaw` have all three platforms; `cb` has X+IG; everything else is X-only.
- Campaign item shape (X): `{ name, views, price, comments?, reposts?, likes?, bookmarks?, link? }`. IG adds `agency`. YT drops engagement fields.

## Color coding (keep consistent)
- `--c-views` (mint) — impressions/views everywhere
- `--c-spend` (gold) — spend/cost
- `--c-cpm` (purple) — CPM
- `--c-qrt` (cyan) — QRT-specific
- `--c-median` (pink) — medians
- `--cpm-good/ok/bad` — CPM thresholds (<5 / <15 / ≥15)
- Platform colors (from `PLATFORM_COLORS`) are ONLY for platform branding (aura, switcher, tile borders, gradient titles). Never swap the coherent data colors for a platform color.

## CPM thresholds
good <$5, ok <$15, bad ≥$15. CPE = price ÷ (comments + reposts + likes + bookmarks).

## Navigation model
Routing uses a history stack in `App.jsx`: `navigate(target, param, extra)` pushes, `onBack` pops, `onHome` clears to landing. Every page receives `{ onBack, onHome, canBack }` via `PageNav` at top-left.

Flows converge on `PlatformDetail(platform, monthId?, initialCampaign?)`:
- `ByCampaign > Campaign > X` → `PlatformDetail(x, null, campaignId)` — full campaign cumulative across all months.
- `ByPlatform > X > All` → `PlatformDetail(x, null, null)` — platform cumulative across all campaigns.
- `ByTimeline > Month > X` → `PlatformDetail(x, monthId, null)` — month-filtered X breakdown.

Never render single-campaign detail by a duplicated inline block — use `CampaignXDetail` / `CampaignIGDetail` / `CampaignYTDetail`. The cumulative X view is `XCumulativeView` (also month-aware via `monthId` prop).

## Conventions
- Inline styles over CSS classes for page-specific layout; CSS classes for reusable primitives (`.glass-card`, `.data-card`, `.back-btn`, `.campaign-tab`, `.month-card`, `.info-banner`, `.section-title`, `.inf-link`, `.fade-up`, `.fade-in`, `.s1`–`.s5`).
- Animation delays via `.s1`…`.s5` classes (0.08s steps).
- Money formatting via `fmtD`; big numbers via `fmt`; CPM via `cpm(spend, views)` returns a string.
- Back buttons: `<button className="back-btn fade-up" onClick={onBack}>← Back</button>` at top-left of the content container. Keep styling consistent.

## Build / run
- `npm run dev` — dev server
- `npm run build` — production build

## Preferences
- Terse output; no trailing summaries unless asked.
- No comments in code unless the *why* is non-obvious.
- No new files unless needed; prefer editing existing.
- Don't add abstractions, feature flags, or error handling for cases that can't happen.
- The existing `campaignStats()` function in `CampaignDashboard.jsx` is load-bearing — don't refactor it unless asked. A near-duplicate lives in `components/CampaignXDetail.jsx` for the extracted leaf view.
- Only `sd2`, `oaw`, `cb` can have IG data; only `sd2`, `oaw` can have YT data. When adding new campaigns, update `IG_CAMPAIGNS`/`YT_CAMPAIGNS` only if the campaign actually has data on that platform.
