# solara.farm demo — v2 (case-first)

Static site (GitHub Pages, `www.solara.farm`). The landing page shows six
cards by **facility type × lifecycle stage** (indoor new build · existing
facility · greenhouse existing ×2 · greenhouse study · pending). Cards open a
workspace (Farm32 · Chrysanthemum · Skyberries · Six-crop study) with
Design/Calibrate → Plan → Operate for that case's sites.

Copy style guide (2026-07): neutral and brief. Heroes are kicker + short
title + at most two plain sentences; no superlatives ("leading"), no
precision boasts ("to the cent") in body copy. Validation claims, sources,
and disclaimers go in the per-page `.footnote` block above the footer.

## Layers — what to edit for what

| You want to change… | Edit… |
|---|---|
| Page copy / section text | that page's `index.html` — between the `<!-- CONTENT -->` markers |
| A number, site, KPI, data slot, benchmark row | `assets/cases/<case>.js` (hand-maintained: farm32 · chrysant · hic (=Skyberries) · flora) |
| Sources / disclaimers for a page | that page's `.footnote` block (above the footer). The six-crop study's thesis citation lives ONLY there — never in generated data files |
| Model results (plans, scenarios, sweeps, stochastic) | ledgers in `../../SOLARA-Plan-Prototype/data/*.json`, then run `build_site.py` there — it regenerates `assets/cases/<case>.data.js` |
| Model logic | `../../SOLARA-Plan-Prototype/solara_plan/*.py` (one model per file; each has asserts) |
| Look & feel | `assets/tokens.css` only — pages have **no** `<style>` blocks. *Known exception: the four legacy Design pages under `farm32/design/` (v1 carry-overs) keep their own scoped styles until they are next redesigned; they are self-contained, so editing them still can't break anything else.* |
| Chart behavior | `assets/js/solara_case.js` — one documented render function per block |
| Sardinia interactive planner (sidebar, ISO weeks, schedule, CSV) | `assets/js/financial_planner.js` — client-side rewrite of the Streamlit planner in `SOLARA-Plan-Prototype/reference/`; defaults are the sidebar input values in `farm32/plan/sardinia.html` |
| Navigation / workspaces | `assets/cases/registry.js` (list) + `assets/nav.js` (builder) |
| Live feed values | `data/feeds/<site>.json` — Operate re-renders on reload |

## Cache busting

All local asset references carry a version query (`tokens.css?v=2`). Browsers
cache these files aggressively; **when you change any file under `assets/`,
bump the version everywhere** so visitors (and you) never see a stale copy:

```bash
# e.g. v=4 → v=5 across all pages
LC_ALL=C find . -name "*.html" -not -path "./_build/*" -exec sed -i '' 's/?v=4/?v=5/g' {} +
```

For local work, serve with cache disabled (the plain `python3 -m http.server`
sends no cache headers and causes exactly this confusion):
`scratchpad/serve_nocache.py` pattern — or just keep DevTools open with
"Disable cache" ticked.

## Page anatomy

Every page declares its identity on `<body>`:

```html
<body data-root=".." data-case="farm32" data-module="plan">
```

`nav.js` builds the topbar (module links + workspace switcher) from those
attributes and `registry.js`. Non-workspace pages (landing, platform, about,
roadmap) use `data-page` instead of `data-case`.

## Recipes

**Add a site to a workspace** — append an entry to `sites:[]` in
`assets/cases/<case>.js` (label, type, journey, status, meta rows, lifecycle).
It appears on the overview and in the benchmark table immediately; `pending`
states render automatically.

**Add a workspace** — add an entry in `assets/cases/registry.js`, create
`assets/cases/<id>.js`, and a `<id>/index.html` overview page (copy `hic/` as
the minimal template). Model-driven pages also need `<id>.data.js` from
`build_site.py`.

**Swap a price curve / scenario** — edit the ledger JSON in
`SOLARA-Plan-Prototype/data/`, then:

```bash
cd ../../SOLARA-Plan-Prototype && .venv/bin/python build_site.py
```

**Connect a live feed** — write `data/feeds/<site>.json` in the feed schema
(see `data/feeds/sardinia.json`); point the site's `operate.feed` at it in the
case file. Overwriting that file on a schedule = the dashboard is live.

**Feed schema**

```json
{ "site": "sardinia", "updated_iso": "2026-07-14T09:00:00+02:00",
  "source": "static-snapshot | sensor-feed",
  "metrics": [ { "key": "t_air", "label": "Air temperature", "value": 24.5,
                 "unit": "°C", "target": 24.0, "status": "ok" } ] }
```

## Workspace access codes

Every workspace (Farm32, chrysanthemum, Skyberries, six-crop study) is gated
by `assets/lock.js`: a per-workspace access code, checked client-side against
a salted SHA-256 hash in `registry.js` (`lock: { hash }`). The unlock is
remembered per browser (`localStorage`), so a code is entered once, not on
every visit. The landing and marketing pages stay open.

- **Set/change a code**: `python3 _build/hash_code.py <case-id> <new-code>` →
  paste the hash into that workspace's `lock` entry. **Never commit the code
  itself** — share it with the partner directly and keep it in your password
  manager.
- **Security level — be honest with yourself**: this is a demo gate, not
  encryption. It keeps casual visitors out; a technical person can still read
  the underlying files. Anything genuinely secret needs real hosting auth
  (planned alongside the v3 live feeds — e.g. Cloudflare Access).

## Honesty labels

Every non-measured number carries a pill: `validated` (reproduces an external
source exactly) · `demo data` (plausible, made for the demo) · `illustrative`
(shape is the point, not the value) · `pending` (slot exists, data doesn't yet).
Keep that discipline when editing.
