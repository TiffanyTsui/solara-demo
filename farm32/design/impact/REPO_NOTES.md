# REPO_NOTES — committing Module 04 to `design/impact/`

This project is the WORKING "Module 04 · Environmental Impact" sub-page. It was built and
QA'd locally against `http://localhost:8742/` with the **local** asset paths below. Before
committing into the solara-demo repo at `design/impact/index.html` (a sub-page two levels
deep), change the paths marked with `<!-- REPO PATH: ... -->` comments in `index.html`.

## Files and where they go

| Local file (this dir)        | Destination in repo                          | Action on commit |
|------------------------------|----------------------------------------------|------------------|
| `index.html`                 | `design/impact/index.html`                   | Commit; fix the 3 paths below |
| `app.js`                     | `design/impact/app.js`                       | Commit as-is (page-local) |
| `data.js`                    | `design/impact/data.js`                      | Commit as-is (generated) |
| `build_data.py`              | `design/impact/build_data.py`                | Commit as-is (writes data.js next to itself) |
| `style.css`                  | `design/impact/style.css`                    | Commit as-is (page-local) |
| `tokens.css`                 | **DO NOT COMMIT** — repo already has `assets/tokens.css` | Use the repo's shared sheet instead |
| `nav.js`                     | **DO NOT COMMIT** — repo already has `assets/nav.js`     | Use the repo's shared script instead |

`app.js`, `data.js`, `style.css` and `build_data.py` are page-local and sit alongside
`index.html` inside `design/impact/`, so the relative `./app.js`, `./data.js`,
`./style.css` references are already correct — no change needed.

## Exact path changes in `index.html` (3 lines)

1. **Shared design-system stylesheet** — in `<head>`:
   - LOCAL (current):  `<link rel="stylesheet" href="tokens.css" />`
   - REPO (change to): `<link rel="stylesheet" href="../../assets/tokens.css" />`

2. **nav.js script** — before `</body>`:
   - LOCAL (current):  `<script src="nav.js"></script>`
   - REPO (change to): `<script src="../../assets/nav.js"></script>`

3. **Page-local stylesheet** — no change. `<link rel="stylesheet" href="style.css" />`
   stays `./style.css` (ships in `design/impact/`). The REPO-PATH comment above it is
   only a reminder that it stays local.

## Note on `style.css` shell duplication

`style.css` ends with a block titled **"REPO SUB-PAGE SHELL — layout classes from the
SOLARA repo assets/tokens.css"**. These rules (`.topnav`, `.crumbs`, `.page-hero`,
`.container`, `footer.site`, `.chart-block`, `.chart-head`, `.chart-sub`, `.brand-*`,
`.icon-btn`) exist so the page renders correctly in LOCAL QA, where the linked local
`tokens.css` (the Space design-system sheet) omits page-chrome classes. The repo's
`assets/tokens.css` already defines these identically, so once committed this block is a
harmless duplicate. It may be left in place or trimmed — leaving it in keeps the page
self-contained and robust.

## Homepage status update (separate file, in `sd_main.html` / repo `index.html`)

Module 04's card on the homepage currently carries the `coming` class and a "Scoped"
status. When this page goes live, update that card to match the other working modules:
remove `coming` and set `<div class="status live">Live · demo data</div>`.

## Regenerating data

`python build_data.py` writes `data.js` next to the script (path is now resolved relative
to the script's own location, not a hard-coded absolute path). It must print:
`Max relative reconstruction error vs golden record: 2.69e-16`.
