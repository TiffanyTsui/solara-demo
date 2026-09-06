/* Maasdijk record page — renders data/feeds/maasdijk.json.
   Hero stats, one site card per kas, one timeline + day table per kas. Plotly for the charts.
   Timeline (6 Sep, ADR 0006): assets/js/timeline.js, shared with the Made page — solid = the
   reconstruction on observed KNMI weather to the last observed day; dotted = the latest issue from
   that seam through +3 days; dots = measured; hollow dots = the lead-1 forecast on scored days.
   Default view the last 30 days plus the forecast (a record page); hourly under 14 days.
   Colours from tokens.css; no inline styles beyond what Plotly needs. */
(function () {
  var HOURLY_BELOW_DAYS = 14, DEFAULT_DAYS = 30;
  function el(id) { return document.getElementById(id); }
  function nl(n, d) { if (n === null || n === undefined || Number.isNaN(n)) return "—"; return Number(n).toLocaleString("nl-NL", { minimumFractionDigits: d, maximumFractionDigits: d }); }
  function sgn(n, d) { if (n === null || n === undefined) return "—"; return (n > 0 ? "+" : "") + nl(n, d); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

  function hero(f) {
    var maes = f.kassen.map(function (k) { return k.score.all.mean_mae; });
    var lo = Math.min.apply(null, maes), hi = Math.max.apply(null, maes);
    var scoredDays = f.kassen.map(function (k) { return k.scored.length; });
    var fcs = f.kassen.map(function (k) { return k.forecast_score; }).filter(Boolean);
    var fourth;
    if (fcs.length) {
      var fl = Math.min.apply(null, fcs.map(function (s) { return s.total_mae; })), fh = Math.max.apply(null, fcs.map(function (s) { return s.total_mae; }));
      fourth = '<div class="hero-stat"><div class="hero-num">' + nl(fl, 2) + " – " + nl(fh, 2) + ' °C</div><div class="hero-label">day-ahead forecast error per compartment, on the scored days</div></div>';
    } else {
      var first = f.kassen[0].issue ? f.kassen[0].issue.issued_utc.slice(0, 10) : f.forecast_since;
      fourth = '<div class="hero-stat"><div class="hero-num">forecast running</div><div class="hero-label">issued daily since ' + esc(first) + "; scoring starts with the first measured export (" +
        Math.max.apply(null, scoredDays) + " of " + f.headline_min_days + " days scored)</div></div>";
    }
    el("hero-stats").innerHTML =
      '<div class="hero-stat"><div class="hero-num">' + nl(lo, 2) + " – " + nl(hi, 2) + ' °C</div><div class="hero-label">daily-mean error per compartment, over every measured day, on observed weather</div></div>' +
      '<div class="hero-stat"><div class="hero-num">' + nl(f.spread_5_9, 2) + ' °C</div><div class="hero-label">measured difference between two compartments of one building, same days — the floor</div></div>' +
      '<div class="hero-stat"><div class="hero-num">' + f.period[0].slice(0, 10) + " → " + f.period[1].slice(0, 10) + '</div><div class="hero-label">reconstructed, every hour, on observed weather; extended each morning</div></div>' + fourth;
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
      if (k.forecast_score) rows.push(["Day-ahead forecast", nl(k.forecast_score.total_mae, 2) + " °C error over " + k.forecast_score.days + " days: weather " + nl(k.forecast_score.weather_mae, 2) + ", model " + nl(k.forecast_score.model_mae, 2)]);
      else if (k.issue) rows.push(["Day-ahead forecast", "issued " + k.issue.issued_utc.replace("T", " ") + " UTC · " + k.scored.length + " scored day" + (k.scored.length === 1 ? "" : "s")]);
      return '<div class="site-card"><h3>' + esc(k.label.replace('Maasdijk ', '')) + ' <span class="tag-pill design">transferred model</span></h3>' +
        '<div class="site-loc">' + esc(k.street) + " · Maasdijk</div>" +
        '<div class="site-meta">' + rows.map(function (r) { return '<div class="row"><span class="k">' + r[0] + "</span><span>" + r[1] + "</span></div>"; }).join("") + "</div></div>";
    }).join("");
  }

  function dayTable(k) {
    // one row per reconstructed-and-measured day; the forecast columns fill on scored days (ADR 0006 split)
    var sc = {}; k.scored.forEach(function (r) { sc[r.date] = r; });
    var head = "<tr><th>day</th><th>measured</th><th>model</th><th>model share</th><th>forecast</th><th>weather share</th><th>total</th><th>measured max</th><th>model max</th><th>Δ max</th><th>forecast max</th><th>total max</th></tr>";
    var body = k.joined.map(function (r) {
      var dm = r[3] - r[1], dx = r[4] - r[2], s = sc[r[0]];
      var cell = function (v, d, bad) { return '<td class="num' + (bad ? " bad" : "") + '">' + (v === null || v === undefined ? "—" : (d < 0 ? sgn(v, -d) : nl(v, d))) + "</td>"; };
      return "<tr><td>" + r[0] + "</td>" + cell(r[1], 2) + cell(r[3], 2) + cell(dm, -2, Math.abs(dm) > 1.5) +
        cell(s ? s.pred_mean : null, 2) + cell(s ? s.weather_mean : null, -2, s && Math.abs(s.weather_mean) > 1.5) + cell(s ? s.total_mean : null, -2, s && Math.abs(s.total_mean) > 1.5) +
        cell(r[2], 1) + cell(r[4], 1) + cell(dx, -1, Math.abs(dx) > 3) + cell(s ? s.pred_max : null, 1) + cell(s ? s.total_max : null, -1, s && Math.abs(s.total_max) > 3) + "</tr>";
    }).join("");
    return '<details class="daytable"><summary>Day by day — ' + k.score.all.days + " measured days, " + k.scored.length + " with a day-ahead forecast</summary>" +
      '<div class="table-scroll"><table class="data"><thead>' + head + "</thead><tbody>" + body + "</tbody></table></div></details>";
  }

  function chart(k, i) {
    SOLARA_TIMELINE.mount("chart-" + i, k, { defaultDays: DEFAULT_DAYS, hourlyBelowDays: HOURLY_BELOW_DAYS,
      measuredSuffix: "afdeling " + k.scored_afdeling,
      labels: { model: "model, daily mean (observed weather)", modelH: "model, hourly (observed weather)" } });
  }

  function blocks(f) {
    el("kas-blocks").innerHTML = f.kassen.map(function (k, i) {
      var issued = k.issue ? " · issue " + k.issue.issued_utc.replace("T", " ") + " UTC" : "";
      return '<div class="chart-block"><div class="chart-head"><h3>' + esc(k.label.replace('Maasdijk ', '')) + " — the model against the sensor in afdeling " + k.scored_afdeling + "</h3>" +
        '<div class="chart-sub">Solid line: the model on observed weather, to the last observed day. Dotted: the latest forecast issue from that day through three days ahead. Dots: the sensor, on days an export exists. Hollow dots: what the day-ahead forecast said, on scored days. Under 14 days the lines turn hourly. Dashed: outside air' + issued + ".</div></div>" +
        '<div id="chart-' + i + '"></div>' + dayTable(k) + "</div>";
    }).join("");
    if (window.Plotly) f.kassen.forEach(chart);
  }

  fetch("../data/feeds/maasdijk.json", { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (f) {
    hero(f); cards(f); blocks(f);
    el("footnote").textContent = "Springtide Strategy · SOLARA · " + f.weather + " · forecast: " + f.forecast_weather + " · model " + f.source.split(":")[1].trim() + " · written " + f.updated_iso.slice(0, 16).replace("T", " ") + " UTC";
  }).catch(function (e) { el("hero-stats").innerHTML = '<p class="muted">The Maasdijk feed is not reachable.</p>'; });
})();
