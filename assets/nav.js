/* SOLARA v2 topbar builder.
   Each page declares on <body>:
     data-root   relative path to the site root ("." / ".." / "../..")
     data-case   workspace id from registry.js (omit on non-workspace pages)
     data-module current module id ("overview" | "design" | "calibrate" | "plan" | "operate")
   This script fills <nav class="topnav"> with the module links, the workspace
   switcher, and the global links — one place to change navigation for every page.
   Requires assets/cases/registry.js to be loaded first. */
(function () {
  var nav = document.querySelector(".topnav");
  if (!nav) return;
  var body = document.body;
  var root = body.dataset.root || ".";
  var caseId = body.dataset.case || null;
  var module = body.dataset.module || "";
  var REG = window.SOLARA_REGISTRY || [];

  // Design and Calibrate are the same lifecycle stage (new build vs existing):
  // when switching workspaces, map one onto the other if needed.
  var EQUIV = { design: "calibrate", calibrate: "design" };

  function moduleIn(ws, modId) {
    var hit = ws.modules.find(function (m) { return m.id === modId; });
    if (!hit && EQUIV[modId]) {
      hit = ws.modules.find(function (m) { return m.id === EQUIV[modId]; });
    }
    return hit || ws.modules[0];
  }

  var html = "";
  var ws = caseId ? REG.find(function (r) { return r.id === caseId; }) : null;

  if (ws) {
    try { localStorage.setItem("solara-case", caseId); } catch (e) {}
    html += ws.modules.map(function (m) {
      var active = m.id === module ? " class=\"active\"" : "";
      return "<a" + active + " href=\"" + root + "/" + ws.id + "/" + m.path + "\">" + m.label + "</a>";
    }).join("");

    var items = REG.filter(function (r) { return r.id !== caseId; }).map(function (r) {
      var target = moduleIn(r, module);
      return "<a href=\"" + root + "/" + r.id + "/" + target.path + "\">" + r.label +
        "<span class=\"ws-sub\">" + r.sub + "</span></a>";
    }).join("");
    html +=
      "<details class=\"ws-chip\"><summary><span class=\"ws-dot\"></span>" + ws.label + "</summary>" +
      "<div class=\"ws-menu\">" + items +
      "<a class=\"ws-all\" href=\"" + root + "/index.html\">All workspaces →</a>" +
      "</div></details>";
  } else {
    var page = body.dataset.page || "";
    [["workspaces", "index.html", "Workspaces"],
     ["platform", "platform/index.html", "Platform"],
     ["roadmap", "roadmap/index.html", "Roadmap"]].forEach(function (it) {
      var active = page === it[0] ? " class=\"active\"" : "";
      html += "<a" + active + " href=\"" + root + "/" + it[1] + "\">" + it[2] + "</a>";
    });
  }
  nav.innerHTML = html;

  // Close the switcher when clicking elsewhere.
  document.addEventListener("click", function (e) {
    var chip = document.querySelector(".ws-chip[open]");
    if (chip && !chip.contains(e.target)) chip.removeAttribute("open");
  });
})();
