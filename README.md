# solara.farm demo — v2 (case-first)

Static site (GitHub Pages, `www.solara.farm`). The landing page shows six
cards by **facility type × lifecycle stage** (indoor new build · existing
facility · greenhouse existing ×2 · greenhouse study · pending). Cards open a
workspace (Farm32 · Chrysanthemum · Skyberries · Crop mix study) with
Design/Calibrate → Plan → Operate for that case's sites.

Version history: [`CHANGELOG.md`](CHANGELOG.md). Current release **v2.0**.

## Copy style guide (2026-07)

Neutral and brief. Heroes are kicker + short title + at most two plain
sentences; no superlatives ("leading"), no precision boasts ("to the cent")
in body copy. Validation claims, sources, and disclaimers go in the per-page
`.footnote` block above the footer.

Four rules added in v2.0 — these are what make the cases shareable outside:

1. **Actor-less.** Never "the grower", "his plan", or anything naming whose
   data this is. The plan you compare against is **the baseline plan**; prices
   are **estimated prices**. Keep a case's origin vague unless it is published
   (the crop mix study is the one exception — it cites its thesis, in the
   footnote only).
2. **No statistical jargon in body copy.** Say "three price futures", "average
   outcome", "if prices disappoint" — never stochastic MILP, expected value,
   CVaR₂₅, or `p=.30`. The math is welcome in the page footnote, where it buys
   credibility instead of confusion.
3. **State the basis of every figure.** A euro number without a horizon is a
   trap: label totals ("4-yr total") and give the per-year average next to it.
4. **Headline the finding, not the topic** — "The Women's-Day price peak is
   certain — how high it goes is not", not "Women's Day analysis". Answer
   cards state the decision and its price, then name the judgment that stays
   with the reader.

## Layers — what to edit for what

| You want to change… | Edit… |
|---|---|
| Page copy / section text | that page's `index.html` — between the `<!-- CONTENT -->` markers |
| A number, site, KPI, data slot, benchmark row | `assets/cases/<case>.js` (hand-maintained: farm32 · chrysant · hic (=Skyberries) · flora) |
| Sources / disclaimers for a page | that page's `.footnote` block (above the footer). The crop mix study's thesis citation lives ONLY there — never in generated data files |
| Model results (plans, scenarios, sweeps, stochastic) | ledgers in `../../SOLARA-Plan-Prototype/data/*.json`, then run `build_site.py` there — it regenerates `assets/cases/<case>.data.js` |
| Model logic | `../../SOLARA-Plan-Prototype/solara_plan/*.py` (one model per file; each has asserts) |
| Look & feel | `assets/tokens.css` only — pages have **no** `<style>` blocks. *Known exception: the four legacy Design pages under `farm32/design/` (v1 carry-overs) keep their own scoped styles until they are next redesigned; they are self-contained, so editing them still can't break anything else.* |
| Chart behavior | `assets/js/solara_case.js` — one documented render function per block |
| Sardinia interactive planner (sidebar, ISO weeks, schedule, CSV) | `assets/js/financial_planner.js` — client-side rewrite of the Streamlit planner in `SOLARA-Plan-Prototype/reference/`; defaults are the sidebar input values in `farm32/plan/sardinia.html` |
| Navigation / workspaces | `assets/cases/registry.js` (list) + `assets/nav.js` (builder) |
| Live feed values | `data/feeds/<site>.json` — Operate re-renders on reload |

## Cache busting

All local asset references carry a version query (currently `tokens.css?v=5`).
Browsers cache these files aggressively; **when you change any file under
`assets/`, bump the version everywhere** so visitors (and you) never see a
stale copy. Do this as part of releasing, not per edit:

```bash
# e.g. v=5 → v=6 across all pages
LC_ALL=C find . -name "*.html" -not -path "./_build/*" -exec sed -i '' 's/?v=5/?v=6/g' {} +
```

Skipping this is the single most likely way to demo a stale site: the pages
are fine, but a visitor who saw an earlier version keeps their cached
`solara_case.js` and sees old charts against new copy.

For local work, serve with cache disabled (the plain `python3 -m http.server`
sends no cache headers and causes exactly this confusion):
`scratchpad/serve_nocache.py` pattern — or just keep DevTools open with
"Disable cache" ticked.

## Chart & interaction conventions

**Scenario/plan tabs.** Every case that compares candidates uses the same
pattern — a `div.controls` holding `<label>` + `<div class="toggle">`, buttons
injected from the data, and one `render()` in the page glue that re-fills
every dependent block. Styling is entirely `.toggle` / `.toggle-btn.active`
in `tokens.css`; never add CSS for this. Live examples: the scenario toggle
in `flora/plan/`, the Year and Plan toggles in `chrysant/plan/`.

**Uncertainty blocks.** Both planning cases share one shape, in this order:
`case-head` → lede naming the three futures in plain words → plan tabs →
`chart-block.split` (outcome cards | what-this-plan-changes chart) →
comparison table with the active row highlighted → a note under the table
explaining how the percentages are meant → `answer-card` stating the trade.
Copy that shape rather than inventing a new one.

**Bar charts of a constrained resource carry three states, not two.** Binding
*and* valuable (full color + the shadow price in gold), full but worth nothing
at the margin (mid-tone, no number), and slack (gray). The middle state is
real — a period can be 100% used while an extra m² earns nothing, because the
surrounding periods are the true limit. Collapsing it into "slack" tells the
reader something false. Percentages on hover carry one decimal, so 99.6%
never reads as 100%.

**Generated vs hand-written.** Anything under `assets/cases/<id>.data.js` is
solver output — change the ledger or the model and re-run `build_site.py`.
If a label is wrong there, fix it in the generator too, or the next rebuild
puts it back.

## Page anatomy

Every page declares its identity on `<body>`:

```html
<body data-root=".." data-case="farm32" data-module="plan">
```

`nav.js` builds the topbar (module links + workspace switcher) from those
attributes and `registry.js`. Non-workspace pages (landing, platform, about,
roadmap) use `data-page` instead of `data-case`.

`about/index.html` still exists but is **deliberately unlinked** (removed from
`nav.js` and the landing page in v2.0) while SOLARA is in validation and the
organizational setup is open. Re-add its nav entry when there is something
settled to say.

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

Every workspace (Farm32, chrysanthemum, Skyberries, crop mix study) is gated
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
