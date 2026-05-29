"""Generates the shared header + footer HTML for a given active nav.
Run helper: import and call HEADER(title), FOOTER().
"""

HEADER = lambda title, extra_head="": f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>{title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Inter:wght@400;500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/tokens.css" />
{extra_head}
</head>
<body>

<header class="topbar">
  <a class="brand" href="/">
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
      <div class="brand-sub">Sustainability intelligence platform</div>
    </div>
  </a>
  <nav class="topnav">
    <a data-nav="/design" href="/design/">Design</a>
    <a data-nav="/operate" href="/operate/">Operate</a>
    <a data-nav="/platform" href="/platform/">Platform</a>
    <a data-nav="/about" href="/about/">About</a>
  </nav>
</header>

<main class="container">
"""

FOOTER = """
</main>

<footer class="site">
  <div>SOLARA · Internal preview · May 2026</div>
  <div class="right">Springtide Strategy</div>
</footer>

<script src="/assets/nav.js"></script>
</body>
</html>
"""
