/* Maasdijk record page — renders data/feeds/maasdijk.json.
   Hero stats, one site card per kas, one timeline + day table per kas. Plotly for the charts.
   Timeline (6 Sep, ADR 0006): solid = reconstruction on observed KNMI weather to the last observed
   day; dotted = the latest issue from that seam through +3 days (run-in + forecast, issue weather);
   dots = measured; hollow dots = the lead-1 forecast on scored days. Range buttons + slider, default
   the last 30 days plus the forecast; hourly traces replace daily ones under 14 days.
   Colours from tokens.css; no inline styles beyond what Plotly needs. */
(function () {
  var TEAL = "#21808D", DEEP = "#1B474D", MUTED = "#626C71", RULE = "#D5D2C8", PAPER = "#FFFFFD", SHORT = "#A33A2C", AMBER = "#C8821C";
  var FONT = { family: "Inter, sans-serif", size: 12, color: "#13343B" };
  var HOURLY_BELOW_DAYS = 14, DEFAULT_DAYS = 30;
  var BASE = { paper_bgcolor: PAPER, plot_bgcolor: PAPER, font: FONT, margin: { l: 48, r: 24, t: 12, b: 40 },
    hoverlabel: { font: { family: "Inter, sans-serif", size: 12 }, bgcolor: "#fff", bordercolor: RULE },
    yaxis: { gridcolor: RULE, zerolinecolor: RULE, linecolor: RULE, title: "°C", fixedrange: true },
    legend: { orientation: "h", x: 0, y: 1.18, font: { size: 11 } } };
  var CONFIG = { displaylogo: false, modeBarButtonsToRemove: ["lasso2d", "select2d", "autoScale2d"], responsive: true, scrollZoom: false };
  function el(id) { return document.getElementById(id); }
  function nl(n, d) { if (n === null || n === undefined || Number.isNaN(n)) return "—"; return Number(n).toLocaleString("nl-NL", { minimumFractionDigits: d, maximumFractionDigits: d }); }
  function sgn(n, d) { if (n === null || n === undefined) return "—"; return (n > 0 ? "+" : "") + nl(n, d); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
  function col(rows, i) { return rows.map(function (r) { return r[i]; }); }
  function addDays(iso, n) { var d = new Date(iso.slice(0, 10) + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  function spanDays(range) { return (new Date(range[1]) - new Date(range[0])) / 864e5; }

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

  function traces(k) {
    var iss = k.issue || { runin: [], hourly: [], daily: [] };
    var seam = k.last_observed_day;
    // issue path from the seam: run-in hours after the last observed day, then the forecast
    var issueHourly = iss.runin.filter(function (r) { return r[0].slice(0, 10) > seam; }).concat(iss.hourly);
    var issueDaily = {};
    issueHourly.forEach(function (r) { var d = r[0].slice(0, 10); if (r[0].slice(11) === "00:00") d = addDays(d, -1); (issueDaily[d] = issueDaily[d] || []).push(r[1]); });
    var idays = Object.keys(issueDaily).sort().map(function (d) { var v = issueDaily[d]; return [d, v.reduce(function (a, b) { return a + b; }, 0) / v.length, Math.max.apply(null, v), v.length]; })
      .filter(function (r) { return r[3] >= 12; });
    var lead1 = k.scored;
    var H = { rec: "%{x}<br>model %{y:.1f} °C<extra></extra>", out: "%{x}<br>outside %{y:.1f} °C<extra></extra>", meas: "%{x}<br>measured %{y:.1f} °C<extra></extra>",
      fc: "%{x}<br>forecast %{y:.1f} °C<extra></extra>", fcOut: "%{x}<br>forecast outside %{y:.1f} °C<extra></extra>", l1: "%{x}<br>day-ahead forecast %{y:.1f} °C<extra></extra>" };
    return {
      daily: [
        { x: col(k.reconstructed, 0), y: col(k.reconstructed, 1), name: "model, daily mean (observed weather)", mode: "lines", line: { color: TEAL, width: 1.8 }, hovertemplate: H.rec },
        { x: col(k.reconstructed, 0), y: col(k.reconstructed, 3), name: "outside, daily mean", mode: "lines", line: { color: MUTED, width: 1, dash: "dash" }, hovertemplate: H.out },
        { x: col(idays, 0), y: col(idays, 1), name: "forecast, daily mean (issue weather)", mode: "lines", line: { color: TEAL, width: 1.8, dash: "dot" }, hovertemplate: H.fc },
        { x: col(k.measured, 0), y: col(k.measured, 1), name: "measured, afdeling " + k.scored_afdeling, mode: "markers", marker: { color: DEEP, size: 6 }, hovertemplate: H.meas },
        { x: lead1.map(function (r) { return r.date; }), y: lead1.map(function (r) { return r.pred_mean; }), name: "day-ahead forecast, scored", mode: "markers", marker: { color: PAPER, size: 7, line: { color: AMBER, width: 1.6 } }, hovertemplate: H.l1 }
      ],
      hourly: [
        { x: col(k.reconstructed_hourly, 0), y: col(k.reconstructed_hourly, 1), name: "model, hourly (observed weather)", mode: "lines", line: { color: TEAL, width: 1.4 }, hovertemplate: H.rec },
        { x: col(k.reconstructed_hourly, 0), y: col(k.reconstructed_hourly, 2), name: "outside, hourly", mode: "lines", line: { color: MUTED, width: 0.8, dash: "dash" }, hovertemplate: H.out },
        { x: col(issueHourly, 0), y: col(issueHourly, 1), name: "forecast, hourly (issue weather)", mode: "lines", line: { color: TEAL, width: 1.4, dash: "dot" }, hovertemplate: H.fc },
        { x: col(issueHourly, 0), y: col(issueHourly, 2), name: "forecast outside, hourly", mode: "lines", line: { color: MUTED, width: 0.8, dash: "dot" }, hovertemplate: H.fcOut },
        { x: col(k.measured_hourly, 0), y: col(k.measured_hourly, 1), name: "measured, hourly, afdeling " + k.scored_afdeling, mode: "lines", line: { color: DEEP, width: 1.2 }, hovertemplate: H.meas },
        { x: lead1.map(function (r) { return r.date + "T12:00"; }), y: lead1.map(function (r) { return r.pred_mean; }), name: "day-ahead forecast, daily mean, scored", mode: "markers", marker: { color: PAPER, size: 7, line: { color: AMBER, width: 1.6 } }, hovertemplate: H.l1 }
      ],
      end: issueHourly.length ? issueHourly[issueHourly.length - 1][0].slice(0, 10) : seam,
      seam: seam
    };
  }

  function layout(k, t, range) {
    var seamX = addDays(t.seam, 1) + "T00:00";
    return Object.assign({}, BASE, { height: 360,
      xaxis: { gridcolor: RULE, zerolinecolor: RULE, linecolor: RULE, range: range,
        rangeselector: { buttons: [
          { count: 7, label: "7 d", step: "day", stepmode: "backward" }, { count: 30, label: "30 d", step: "day", stepmode: "backward" },
          { count: 90, label: "90 d", step: "day", stepmode: "backward" }, { step: "all", label: "all" }],
          x: 0, y: 1.02, xanchor: "left", yanchor: "bottom", font: { size: 11 }, bgcolor: PAPER, activecolor: "#EAE7DE", bordercolor: RULE, borderwidth: 1 },
        rangeslider: { visible: true, thickness: 0.08, bgcolor: PAPER, bordercolor: RULE, borderwidth: 1 } },
      shapes: [{ type: "line", x0: seamX, x1: seamX, y0: 0, y1: 1, yref: "paper", line: { color: AMBER, width: 1, dash: "dot" } }],
      annotations: [{ x: seamX, y: 1, yref: "paper", yanchor: "bottom", xanchor: "left", showarrow: false, text: "last observed day", font: { size: 10, color: AMBER } }],
      legend: { orientation: "h", x: 0, y: -0.36, font: { size: 11 } } });
  }

  function chart(k, i) {
    var t = traces(k), id = "chart-" + i;
    var def = [addDays(t.end, -DEFAULT_DAYS - 3), addDays(t.end, 1)];
    var mode = "daily";
    Plotly.newPlot(id, t.daily, layout(k, t, def), CONFIG).then(function (gd) {
      gd.on("plotly_relayout", function (e) {
        var r = gd.layout.xaxis.range; if (!r) return;
        var want = spanDays(r) <= HOURLY_BELOW_DAYS ? "hourly" : "daily";
        if (want === mode) return;
        mode = want;
        Plotly.react(id, t[mode], Object.assign({}, gd.layout, { xaxis: Object.assign({}, gd.layout.xaxis, { range: r, autorange: false }) }), CONFIG);
      });
    });
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
