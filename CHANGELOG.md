# Changelog

Notable changes to the solara.farm demo site. Versions correspond to git
history; `v1.1` = commit `d83907f` (2026-07-14).

---

## v2.0.1 — 2026-07-20 — fix: Morocco LCA page rendered empty

### Fixed

- **`farm32/design/impact/` (Environmental Impact / LCA) showed static markup
  with no charts, KPIs or tables.** When the page was rewritten for the
  case-first restructure its theme-toggle button was dropped, but the legacy
  `app.js` — moved across unchanged — still wired a click listener to
  `[data-theme-toggle]`. That selector returned `null`, the `TypeError` aborted
  the whole IIFE on line 17, and **every initializer below it never ran**:
  both Chart.js canvases, the KPI strip, the results and comparison tables,
  and the hero answer. Guarded the wiring (`if (!t) return`) — the v2 design
  ships no per-page theme switch, so the initial theme is set and the listener
  skipped.
- Failure mode worth remembering: one unguarded `querySelector(...)`
  `.addEventListener` at the *top* of an IIFE silently kills everything after
  it. The page looked "styled but empty" rather than throwing visibly.

### Changed

- Asset pins `?v=5` → `?v=6`, since `app.js` changed. Without this, anyone who
  already loaded the broken page keeps the broken cached copy.

---

## v2.0 — 2026-07-20 — case-first demo · planning under uncertainty

The site stopped being one linear Design→Plan→Operate walkthrough and became
**a set of workspaces**, one per real case, each at its own lifecycle stage.
Two of them now answer a question the v1 site could not: *what is a risk
worth, before the season starts?*

### Added

**Architecture**
- **Case-first landing page** — six cards by facility type × lifecycle stage,
  each opening a workspace with its own Design/Calibrate → Plan → Operate.
- **Four workspaces**: Farm32 (Basil, Morocco + Italy), Chrysanthemum,
  Crop mix study, Skyberries.
- `assets/js/solara_case.js` — shared render library; one documented function
  per data-driven block, so pages hold only thin glue calls.
- `assets/cases/registry.js` + per-case `<id>.js` (hand-maintained) and
  `<id>.data.js` (**generated** by `SOLARA-Plan-Prototype/build_site.py` —
  never hand-edited).
- `assets/lock.js` + `_build/hash_code.py` — per-workspace access codes
  (salted SHA-256, remembered per browser). Demo gate, not encryption.
- `assets/js/financial_planner.js` — Sardinia interactive weekly planner
  (client-side rewrite of the Streamlit prototype).
- `data/feeds/<site>.json` — live-feed schema; Operate re-renders on reload.
- `README.md` — architecture, editing rules, recipes, honesty labels.

**Chrysanthemum workspace** (weekly planting, 42 bays, 2025–2029)
- Weekly planting MILP **validated against the baseline plan** (€22.24M)
  before optimizing.
- **Contract harvest floor** (≥2–3 kappen/week) the baseline plan lacked —
  priced as two scenarios of the same model (costs €148,800 over four years).
- **Capacity sweep** — value of the 7th–10th kap/week (+€170,007 for the 7th),
  with diminishing steps explained.
- **Women's-Day uncertainty block** — three price futures, candidate-plan
  tabs, mean-CVaR "cautious" plan, per-plan planting-rhythm chart.
- **Per-year view** — All · 2025–2028 toggle on the plan chart, with a
  harvest-revenue readout per year.

**Crop mix study** (six crops × thirteen periods)
- Reproduces the published planning study; five scenarios validated against
  the published results; shadow prices match the published tables.
- **Women's-Day uncertainty block** — the existing but previously unwired
  stochastic model (`solara_plan/stochastic.py`) is now generated into
  `flora.data.js` and rendered: four candidate plans (base, best-on-average,
  cautious, flexible roster) scored under three price futures, with the
  period-3 harvest mix per plan.

### Changed

- **Copy voice** — actor-less throughout: the existing plan is the
  **"baseline plan"**; no gendered references; the data's origin stays vague.
- **Uncertainty explained without statistical jargon** — "three price
  futures", "average outcome", "if prices disappoint" replace stochastic MILP,
  expected value, CVaR₂₅ in body copy. The math moves to page footnotes.
- **Method sections** rewritten for professional non-technical readers
  (linear programming + stochastic modeling in plain terms).
- **Landing cards** renamed to a single `Crop — Country` pattern; the crop mix
  card reframed as the forward look for growers who gain flexibility over
  what they grow.
- **Footer** → "Powered by Springtide Strategy" site-wide.
- **About page** removed from the nav and landing page (file kept, unlinked)
  while the entity is in validation.
- **Asset pins `?v=4` → `?v=5`** — required, since `solara_case.js`,
  `flora.data.js`, `nav.js` and `registry.js` all changed.

### Fixed

- **Resource charts (crop mix)** — a period at 99.64% was displayed as "100%
  used" by whole-number rounding; the hover now carries one decimal.
- **Full-but-zero-shadow-price periods** now render as a distinct third bar
  state instead of looking identical to slack. Period 6 really is full while
  an extra m² earns nothing (LP degeneracy) — the solver was correct; only
  the display conflated "full" with "worth more".

### Notes

- The model layer lives outside this repo in `SOLARA-Plan-Prototype/`
  (**not version-controlled here**). `build_site.py` regenerates every
  `assets/cases/<case>.data.js`.
- Scenario probabilities on both uncertainty blocks are working assumptions,
  not fitted. The crop mix study's *prices* are real auction data (2004–2006
  period averages), but a single averaged observation per period cannot yield
  likelihoods — per-year price history would turn the three futures into
  measured frequencies.

---

## v1.1 — 2026-07-14 — SOLARA Plan module

Design → Plan → Operate walkthrough with the first planting-plan module.

## v1.0 and earlier

Solara Demo 2.0, energy-management page, EF page based on the HAS study,
scenario data.
