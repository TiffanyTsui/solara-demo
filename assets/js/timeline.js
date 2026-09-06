/* SOLARA record timeline — one module for every site page (Maasdijk, Made; 6 Sep, ADR 0006).
   Reads a site record as written by solara-calibrate validate/record_feed.py:
     hindcast / hindcast_hourly   the model on observed weather, to the last observed day (solid)
     issue.runin + issue.hourly   the latest frozen issue from that seam, three days ahead (dotted)
     measured / measured_hourly   the sensor, mean of the site's afdelingen (dark)
     scored                       lead-1 forecasts on scored days (hollow markers)
   Two layers on purpose: prepare() turns the record into plain series — no chart library in it —
   and render() is the only place Plotly is called, so a later build can swap the library by
   replacing render(). Range buttons + slider; hourly series replace daily ones below a span.
   Labels come from opts.labels (English default; the Made page passes Dutch). */
window.SOLARA_TIMELINE = (function () {
  var TEAL = "#21808D", DEEP = "#1B474D", MUTED = "#626C71", RULE = "#D5D2C8", PAPER = "#FFFFFD", AMBER = "#C8821C", INK = "#13343B";
  var EN = {
    model: "model, daily mean (observed weather)", outside: "outside, daily mean", issue: "forecast, daily mean (issue weather)",
    measured: "measured", lead1: "day-ahead forecast, scored",
    modelH: "model, hourly (observed weather)", outsideH: "outside, hourly", issueH: "forecast, hourly (issue weather)",
    issueOutH: "forecast outside, hourly", measuredH: "measured, hourly", lead1H: "day-ahead forecast, daily mean, scored",
    hModel: "model", hOutside: "outside", hMeasured: "measured", hForecast: "forecast", hForecastOut: "forecast outside", hLead1: "day-ahead forecast",
    seam: "last observed day", all: "all", d: "d"
  };
  var DEFAULTS = { defaultDays: 30, hourlyBelowDays: 14, height: 360, marks: [], labels: EN, measuredSuffix: "" };

  function col(rows, i) { return rows.map(function (r) { return r[i]; }); }
  function addDays(iso, n) { var d = new Date(iso.slice(0, 10) + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  function spanDays(range) { return (new Date(range[1]) - new Date(range[0])) / 864e5; }

  /* prepare(record, opts) → { daily: [series], hourly: [series], seam, end, start }
     series = { kind, name, x, y, hover } with kind ∈ model | outside | issue | issueOut | measured | lead1. */
  function prepare(k, opts) {
    var o = Object.assign({}, DEFAULTS, opts || {}), L = Object.assign({}, EN, o.labels || {});
    var iss = k.issue || { runin: [], hourly: [] }, seam = k.last_observed_day;
    var issueHourly = iss.runin.filter(function (r) { return r[0].slice(0, 10) > seam; }).concat(iss.hourly);
    var byDay = {};
    issueHourly.forEach(function (r) { var d = r[0].slice(0, 10); if (r[0].slice(11) === "00:00") d = addDays(d, -1); (byDay[d] = byDay[d] || []).push(r[1]); });
    var idays = Object.keys(byDay).sort().map(function (d) { var v = byDay[d]; return [d, v.reduce(function (a, b) { return a + b; }, 0) / v.length, Math.max.apply(null, v), v.length]; })
      .filter(function (r) { return r[3] >= 12; });
    var lead1 = k.scored || [], ms = o.measuredSuffix ? " " + o.measuredSuffix : "";
    var hc = k.hindcast || [], hh = k.hindcast_hourly || [], md = k.measured || [], mh = k.measured_hourly || [];
    return {
      daily: [
        { kind: "model", name: L.model, x: col(hc, 0), y: col(hc, 1), hover: L.hModel },
        { kind: "outside", name: L.outside, x: col(hc, 0), y: col(hc, 3), hover: L.hOutside },
        { kind: "issue", name: L.issue, x: col(idays, 0), y: col(idays, 1), hover: L.hForecast },
        { kind: "measured", name: L.measured + ms, x: col(md, 0), y: col(md, 1), hover: L.hMeasured },
        { kind: "lead1", name: L.lead1, x: lead1.map(function (r) { return r.date; }), y: lead1.map(function (r) { return r.pred_mean; }), hover: L.hLead1 }
      ],
      hourly: [
        { kind: "model", name: L.modelH, x: col(hh, 0), y: col(hh, 1), hover: L.hModel },
        { kind: "outside", name: L.outsideH, x: col(hh, 0), y: col(hh, 2), hover: L.hOutside },
        { kind: "issue", name: L.issueH, x: col(issueHourly, 0), y: col(issueHourly, 1), hover: L.hForecast },
        { kind: "issueOut", name: L.issueOutH, x: col(issueHourly, 0), y: col(issueHourly, 2), hover: L.hForecastOut },
        { kind: "measured", name: L.measuredH + ms, x: col(mh, 0), y: col(mh, 1), hover: L.hMeasured },
        { kind: "lead1", name: L.lead1H, x: lead1.map(function (r) { return r.date + "T12:00"; }), y: lead1.map(function (r) { return r.pred_mean; }), hover: L.hLead1 }
      ],
      seam: seam,
      start: hc.length ? hc[0][0] : seam,
      end: issueHourly.length ? issueHourly[issueHourly.length - 1][0].slice(0, 10) : seam
    };
  }

  /* ---- Plotly below this line only ---------------------------------------------------- */
  var STYLE = {
    model: { mode: "lines", line: { color: TEAL, width: 1.8 } },
    outside: { mode: "lines", line: { color: MUTED, width: 1, dash: "dash" } },
    issue: { mode: "lines", line: { color: TEAL, width: 1.8, dash: "dot" } },
    issueOut: { mode: "lines", line: { color: MUTED, width: 0.8, dash: "dot" } },
    measured: { mode: "markers", marker: { color: DEEP, size: 6 } },
    lead1: { mode: "markers", marker: { color: PAPER, size: 7, line: { color: AMBER, width: 1.6 } } }
  };
  var HOURLY_STYLE = { model: { line: { width: 1.4 } }, issue: { line: { width: 1.4 } }, outside: { line: { width: 0.8 } }, measured: { mode: "lines", line: { color: DEEP, width: 1.2 }, marker: undefined } };

  function toTrace(s, hourly) {
    var st = JSON.parse(JSON.stringify(STYLE[s.kind]));
    if (hourly && HOURLY_STYLE[s.kind]) {
      var h = HOURLY_STYLE[s.kind];
      if (h.mode) st.mode = h.mode;
      if (h.line) st.line = Object.assign({}, st.line || {}, h.line);
      if ("marker" in h && h.marker === undefined) delete st.marker;
    }
    return Object.assign({ x: s.x, y: s.y, name: s.name, hovertemplate: "%{x}<br>" + s.hover + " %{y:.1f} °C<extra></extra>" }, st);
  }

  function layout(t, o, range) {
    var L = Object.assign({}, EN, o.labels || {}), seamX = addDays(t.seam, 1) + "T00:00";
    var shapes = [{ type: "line", x0: seamX, x1: seamX, y0: 0, y1: 1, yref: "paper", line: { color: AMBER, width: 1, dash: "dot" } }];
    var ann = [{ x: seamX, y: 1, yref: "paper", yanchor: "bottom", xanchor: "left", showarrow: false, text: L.seam, font: { size: 10, color: AMBER } }];
    (o.marks || []).forEach(function (m) {
      var x = m.x.length > 10 ? m.x : m.x + "T00:00";
      shapes.push({ type: "line", x0: x, x1: x, y0: 0, y1: 1, yref: "paper", line: { color: MUTED, width: 1, dash: "dashdot" } });
      ann.push({ x: x, y: 1, yref: "paper", yanchor: "bottom", xanchor: "right", showarrow: false, text: m.text, font: { size: 10, color: MUTED } });
    });
    return {
      paper_bgcolor: PAPER, plot_bgcolor: PAPER, font: { family: "Inter, sans-serif", size: 12, color: INK },
      margin: { l: 48, r: 24, t: 12, b: 40 }, height: o.height,
      hoverlabel: { font: { family: "Inter, sans-serif", size: 12 }, bgcolor: "#fff", bordercolor: RULE },
      yaxis: { gridcolor: RULE, zerolinecolor: RULE, linecolor: RULE, title: "°C", fixedrange: true },
      xaxis: { gridcolor: RULE, zerolinecolor: RULE, linecolor: RULE, range: range,
        rangeselector: { buttons: [
          { count: 7, label: "7 " + L.d, step: "day", stepmode: "backward" }, { count: 30, label: "30 " + L.d, step: "day", stepmode: "backward" },
          { count: 90, label: "90 " + L.d, step: "day", stepmode: "backward" }, { step: "all", label: L.all }],
          x: 0, y: 1.02, xanchor: "left", yanchor: "bottom", font: { size: 11 }, bgcolor: PAPER, activecolor: "#EAE7DE", bordercolor: RULE, borderwidth: 1 },
        rangeslider: { visible: true, thickness: 0.08, bgcolor: PAPER, bordercolor: RULE, borderwidth: 1 } },
      shapes: shapes, annotations: ann,
      legend: { orientation: "h", x: 0, y: -0.36, font: { size: 11 } }
    };
  }

  function render(id, t, opts) {
    var o = Object.assign({}, DEFAULTS, opts || {});
    var CONFIG = { displaylogo: false, modeBarButtonsToRemove: ["lasso2d", "select2d", "autoScale2d"], responsive: true, scrollZoom: false };
    var def = [addDays(t.end, -o.defaultDays - 3), addDays(t.end, 1)];
    var mode = spanDays(def) <= o.hourlyBelowDays ? "hourly" : "daily";
    var traces = function (m) { return t[m].map(function (s) { return toTrace(s, m === "hourly"); }); };
    return Plotly.newPlot(id, traces(mode), layout(t, o, def), CONFIG).then(function (gd) {
      gd.on("plotly_relayout", function () {
        var r = gd.layout.xaxis.range; if (!r) return;
        var want = spanDays(r) <= o.hourlyBelowDays ? "hourly" : "daily";
        if (want === mode) return;
        mode = want;
        Plotly.react(id, traces(mode), Object.assign({}, gd.layout, { xaxis: Object.assign({}, gd.layout.xaxis, { range: r, autorange: false }) }), CONFIG);
      });
      return gd;
    });
  }

  function mount(id, record, opts) { return render(id, prepare(record, opts), opts); }

  return { prepare: prepare, render: render, mount: mount, addDays: addDays, labels: { en: EN } };
})();
