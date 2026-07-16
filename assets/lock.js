/* SOLARA workspace access gate (demo-grade).
   Workspaces with a `lock` entry in registry.js show a passcode screen until
   the visitor enters the matching code; the unlock is remembered per browser
   (localStorage), so a code is entered once, not on every visit. The code
   itself never appears in the repo — only a salted SHA-256 hash (generate one
   with _build/hash_code.py).

   Load order: include this immediately after registry.js, right after <body>,
   so the veil is up before anything paints.

   Honesty note: this is an access curtain for demos, not encryption — the
   underlying files remain technically readable. Data that must be secret
   needs real hosting auth (roadmap: with the v3 live feeds). */
(function () {
  var body = document.body;
  var caseId = body.dataset.case;
  if (!caseId) return;
  var ws = (window.SOLARA_REGISTRY || []).find(function (r) { return r.id === caseId; });
  if (!ws || !ws.lock) return;

  var KEY = "solara-unlock-" + caseId;
  try { if (localStorage.getItem(KEY) === ws.lock.hash) return; } catch (e) {}

  var root = body.dataset.root || ".";
  var veil = document.createElement("div");
  veil.className = "lock-veil";
  veil.innerHTML =
    '<div class="lock-card">' +
    '<svg viewBox="0 0 40 40" width="30" height="30" aria-hidden="true" style="color:var(--teal)">' +
    '<circle cx="20" cy="20" r="10" fill="none" stroke="currentColor" stroke-width="2"/>' +
    '<g stroke="currentColor" stroke-width="2" stroke-linecap="round">' +
    '<line x1="20" y1="3" x2="20" y2="9"/><line x1="20" y1="31" x2="20" y2="37"/>' +
    '<line x1="3" y1="20" x2="9" y2="20"/><line x1="31" y1="20" x2="37" y2="20"/>' +
    '<line x1="8" y1="8" x2="12" y2="12"/><line x1="28" y1="28" x2="32" y2="32"/>' +
    '<line x1="8" y1="32" x2="12" y2="28"/><line x1="28" y1="12" x2="32" y2="8"/></g></svg>' +
    '<div class="kicker" style="margin-top:14px">Restricted workspace</div>' +
    '<h2>' + ws.label + '</h2>' +
    '<p>Enter your access code — asked once per browser.</p>' +
    '<form class="lock-form">' +
    '<input type="password" autocomplete="off" placeholder="Access code" aria-label="Access code" />' +
    '<button class="btn" type="submit">Unlock</button>' +
    '</form>' +
    '<div class="lock-err">That code doesn’t match — check with Springtide and try again.</div>' +
    '<a class="lock-back" href="' + root + '/index.html">← All workspaces</a>' +
    '</div>';
  body.appendChild(veil);
  body.style.overflow = "hidden";

  var form = veil.querySelector("form");
  var input = veil.querySelector("input");
  var err = veil.querySelector(".lock-err");
  setTimeout(function () { input.focus(); }, 50);

  function sha256hex(text) {
    var data = new TextEncoder().encode(text);
    return crypto.subtle.digest("SHA-256", data).then(function (buf) {
      return Array.from(new Uint8Array(buf)).map(function (b) {
        return b.toString(16).padStart(2, "0");
      }).join("");
    });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    sha256hex("solara:" + caseId + ":" + input.value.trim()).then(function (hex) {
      if (hex === ws.lock.hash) {
        try { localStorage.setItem(KEY, ws.lock.hash); } catch (e2) {}
        veil.remove();
        body.style.overflow = "";
      } else {
        err.style.display = "block";
        input.select();
      }
    });
  });
})();
