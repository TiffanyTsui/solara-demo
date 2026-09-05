/* Maasdijk record page — renders data/feeds/maasdijk.json.
   Hero stats, one site card per kas, one chart + day table per kas. Plotly for the charts.
   Colours from tokens.css; no inline styles beyond what Plotly needs. */
(function () {
  var TEAL = "#21808D", DEEP = "#1B474D", MUTED = "#626C71", RULE = "#D5D2C8", PAPER = "#FFFFFD", SHORT = "#A33A2C";
  var FONT = { family: "Inter, sans-serif", size: 12, color: "#13343B" };
  var BASE = { paper_bgcolor: PAPER, plot_bgcolor: PAPER, font: FONT, margin: { l: 48, r: 24, t: 12, b: 40 },
    hoverlabel: { font: { family: "Inter, sans-serif", size: 12 }, bgcolor: "#fff", bordercolor: RULE },
    xaxis: { gridcolor: RULE, zerolinecolor: RULE, linecolor: RULE }, yaxis: { gridcolor: RULE, zerolinecolor: RULE, linecolor: RULE, title: "°C" },
    legend: { orientation: "h", x: 0, y: 1.16, font: { size: 11 } } };
  var CONFIG = { displaylogo: false, modeBarButtonsToRemove: ["lasso2d", "select2d", "autoScale2d"], responsive: true };
  function el(id) { return document.getElementById(id); }
  function nl(n, d) { if (n === null || n === undefined || Number.isNaN(n)) return "—"; return Number(n).toLocaleString("nl-NL", { minimumFractionDigits: d, maximumFractionDigits: d }); }
  function sgn(n, d) { return (n > 0 ? "+" : "") + nl(n, d); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

  function hero(f) {
    var maes = f.kassen.map(function (k) { return k.score.all.mean_mae; });
    var lo = Math.min.apply(null, maes), hi = Math.max.apply(null, maes);
    el("hero-stats").innerHTML =
      '<div class="hero-stat"><div class="hero-num">' + nl(lo, 2) + " – " + nl(hi, 2) + ' °C</div><div class="hero-label">daily-mean error per compartment, over every measured day</div></div>' +
      '<div class="hero-stat"><div class="hero-num">' + nl(f.spread_5_9, 2) + ' °C</div><div class="hero-label">measured difference between two compartments of one building, same days — the floor</div></div>' +
      '<div class="hero-stat"><div class="hero-num">' + f.period[0].slice(0, 10) + " → " + f.period[1].slice(0, 10) + '</div><div class="hero-label">reconstructed, every hour, on observed weather</div></div>';
  }

  function cards(f) {
    el("site-cards").innerHTML = f.kassen.map(function (k) {
      var s = k.score.all;
      var rows = [
        ["Gutter height", nl(k.gutter_m, 2) + " m — the grower's figure"],
        ["Footprint", nl(k.area_m2, 0) + " m² · " + nl(k.long_m, 0) + " × " + nl(k.short_m, 0) + " m · built " + k.bouwjaar],
        ["Compartments", k.holds],
        ["Scored against", "afdeling " + k.scored_afdeling + ", " + s.days + " days"],
        ["Daily mean", nl(s.mean_mae, 2) + " °C error, bias " + sgn(s.mean_bias, 2)],
        ["Daily maximum", nl(s.max_mae, 2) + " °C error, bias " + sgn(s.max_bias, 2)]
      ];
      if (k.score.winter) rows.push(["Winter · summer", nl(k.score.winter.mean_mae, 2) + " · " + nl(k.score.summer.mean_mae, 2) + " °C daily mean"]);
      return '<div class="site-card"><h3>' + esc(k.label.replace('Maasdijk ', '')) + ' <span class="tag-pill design">transferred model</span></h3>' +
        '<div class="site-loc">' + esc(k.street) + " · Maasdijk</div>" +
        '<div class="site-meta">' + rows.map(function (r) { return '<div class="row"><span class="k">' + r[0] + "</span><span>" + r[1] + "</span></div>"; }).join("") + "</div></div>";
    }).join("");
  }

  function blocks(f) {
    el("kas-blocks").innerHTML = f.kassen.map(function (k, i) {
      return '<div class="chart-block"><div class="chart-head"><h3>' + esc(k.label.replace('Maasdijk ', '')) + " — the model against the sensor in afdeling " + k.scored_afdeling + "</h3>" +
        '<div class="chart-sub">Daily means. Line: the model, every day of the run. Dots: what the sensor measured, on the days an export exists. Dashed: outside air.</div></div>' +
        '<div id="chart-' + i + '"></div>' +
        '<details class="daytable"><summary>Day by day — ' + k.score.all.days + " measured days</summary>" +
        '<table class="data"><thead><tr><th>day</th><th>measured mean</th><th>model mean</th><th>Δ</th><th>measured max</th><th>model max</th><th>Δ</th></tr></thead><tbody>' +
        k.joined.map(function (r) {
          var dm = r[3] - r[1], dx = r[4] - r[2];
          return "<tr><td>" + r[0] + '</td><td class="num">' + nl(r[1], 2) + '</td><td class="num">' + nl(r[3], 2) + '</td><td class="num ' + (Math.abs(dm) > 1.5 ? "bad" : "") + '">' + sgn(dm, 2) +
            '</td><td class="num">' + nl(r[2], 1) + '</td><td class="num">' + nl(r[4], 1) + '</td><td class="num ' + (Math.abs(dx) > 3 ? "bad" : "") + '">' + sgn(dx, 1) + "</td></tr>";
        }).join("") + "</tbody></table></details></div>";
    }).join("");
    f.kassen.forEach(function (k, i) {
      if (!window.Plotly) return;
      Plotly.newPlot("chart-" + i, [
        { x: k.reconstructed.map(function (r) { return r[0]; }), y: k.reconstructed.map(function (r) { return r[1]; }), name: "model, daily mean", mode: "lines", line: { color: TEAL, width: 1.8 }, hovertemplate: "%{x}<br>model %{y:.1f} °C<extra></extra>" },
        { x: k.reconstructed.map(function (r) { return r[0]; }), y: k.reconstructed.map(function (r) { return r[3]; }), name: "outside, daily mean", mode: "lines", line: { color: MUTED, width: 1, dash: "dash" }, hovertemplate: "%{x}<br>outside %{y:.1f} °C<extra></extra>" },
        { x: k.measured.map(function (r) { return r[0]; }), y: k.measured.map(function (r) { return r[1]; }), name: "measured, afdeling " + k.scored_afdeling, mode: "markers", marker: { color: DEEP, size: 6 }, hovertemplate: "%{x}<br>measured %{y:.1f} °C<extra></extra>" }
      ], Object.assign({}, BASE, { height: 320 }), CONFIG);
    });
  }

  fetch("../data/feeds/maasdijk.json", { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (f) {
    hero(f); cards(f); blocks(f);
    el("footnote").textContent = "Springtide Strategy · SOLARA · " + f.weather + " · model " + f.source.split(":")[1].trim() + " · written " + f.updated_iso.slice(0, 16).replace("T", " ") + " UTC";
  }).catch(function (e) { el("hero-stats").innerHTML = '<p class="muted">The Maasdijk feed is not reachable.</p>'; });
})();
