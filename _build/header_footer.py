"""Generates the shared v2 header + footer HTML for a page.

v2: the topnav is EMPTY in markup — assets/nav.js fills it at load time from
assets/cases/registry.js and the <body> data attributes:
  root    relative path to the site root ("." / ".." / "../..")
  case    workspace id (farm32 | chrysant | hic) — omit on non-workspace pages
  module  current module id (overview|design|calibrate|plan|operate)
  page    non-workspace page id (workspaces|platform|about|roadmap)

Usage: HEADER("Title", root="../..", case="farm32", module="plan"); FOOTER(root)
"""


def _attrs(root, case=None, module=None, page=None):
    a = f'data-root="{root}"'
    if case:
        a += f' data-case="{case}" data-module="{module or "overview"}"'
    else:
        a += f' data-page="{page or ""}"'
    return a


def HEADER(title, root=".", case=None, module=None, page=None, extra_head=""):
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>{title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Inter:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{root}/assets/tokens.css" />
{extra_head}
</head>
<body {_attrs(root, case, module, page)}>

<header class="topbar">
  <a class="brand" href="{root}/index.html">
    <svg class="brand-mark" viewBox="0 0 40 40" width="28" height="28" aria-hidden="true">
      <circle cx="20" cy="20" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
      <g stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <line x1="20" y1="3" x2="20" y2="9"/><line x1="20" y1="31" x2="20" y2="37"/>
        <line x1="3" y1="20" x2="9" y2="20"/><line x1="31" y1="20" x2="37" y2="20"/>
        <line x1="8" y1="8" x2="12" y2="12"/><line x1="28" y1="28" x2="32" y2="32"/>
        <line x1="8" y1="32" x2="12" y2="28"/><line x1="28" y1="12" x2="32" y2="8"/>
      </g>
    </svg>
    <div>
      <div class="brand-title">SOLARA</div>
      <div class="brand-sub">Sustainability Operations &amp; Lifecycle Analysis Report Automation</div>
    </div>
  </a>
  <nav class="topnav"></nav>
</header>

<main class="container">
"""


def FOOTER(root="."):
    return f"""
</main>

<footer class="site">
  <div>SOLARA · Internal preview v2 · July 2026</div>
  <div class="right">Powered by Springtide Strategy</div>
</footer>

<script src="{root}/assets/cases/registry.js"></script>
<script src="{root}/assets/nav.js"></script>
</body>
</html>
"""
