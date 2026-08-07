/* SOLARA v2 case render library.
   One documented render function per data-driven block; pages only contain
   thin glue calls. Data comes from:
     window.SOLARA_CASE       hand-maintained  (assets/cases/<id>.js)
     window.SOLARA_CASE_DATA  generated        (assets/cases/<id>.data.js,
                              rebuilt by SOLARA-Plan-Prototype/build_site.py)
   Charts need Plotly (CDN) loaded first. All colors follow tokens.css. */

(function () {
  var FONT = { family: "Inter, system-ui, sans-serif", size: 12, color: "#3D4F50" };
  var TEAL = "#1B474D", TEAL2 = "#21808D", TEAL3 = "#3FA9B5",
      PV = "#E0A52A", SHORT = "#A33A2C", RULE = "#D5D2C8", PAPER = "#FFFFFD",
      BATT = "#7A4B9C", LOAD = "#2D6066", MUTED = "#626C71";
  var BASE = {
    paper_bgcolor: PAPER, plot_bgcolor: PAPER, font: FONT,
    margin: { l: 54, r: 54, t: 16, b: 42 },
    hoverlabel: { font: { family: "Inter, sans-serif", size: 12 }, bgcolor: "#fff", bordercolor: RULE },
    xaxis: { gridcolor: RULE, zerolinecolor: RULE, linecolor: RULE },
    yaxis: { gridcolor: RULE, zerolinecolor: RULE, linecolor: RULE },
    legend: { orientation: "h", x: 0, y: 1.14, font: { size: 11 } },
  };
  var CONFIG = { displaylogo: false, modeBarButtonsToRemove: ["lasso2d", "select2d", "autoScale2d"], responsive: true };

  function fmt(n, d) {
    d = d || 0;
    if (n === null || n === undefined || Number.isNaN(n)) return "—";
    return Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  }
  function el(id) { return document.getElementById(id); }
  function setText(id, v) { var e = el(id); if (e) e.textContent = v; }

  /* status → tag-pill html. Statuses: live, validated, demo, illustrative,
     pending, design, connecting. */
  function pill(status, label) {
    var cls = { live: "live", validated: "validated", demo: "", illustrative: "illustrative",
                pending: "pending", design: "design", connecting: "pending" }[status] || "";
    return "<span class=\"tag-pill " + cls + "\">" + (label || status) + "</span>";
  }

  /* ---- workspace overview: site cards -------------------------------- */
  /* renderSiteCards("site-cards")
     Renders SOLARA_CASE.sites as cards: meta rows, lifecycle strip, links. */
  function renderSiteCards(id) {
    var C = window.SOLARA_CASE;
    var root = document.body.dataset.root || ".";
    el(id).innerHTML = C.sites.map(function (s) {
      var rows = (s.meta || []).map(function (r) {
        return "<div class=\"row\"><span class=\"k\">" + r[0] + "</span><span>" + r[1] + "</span></div>";
      }).join("");
      var steps = (s.lifecycle || []).map(function (st) {
        return "<div class=\"lc-step " + st.state + "\" title=\"" + (st.note || "") + "\">" + st.label + "</div>";
      }).join("");
      var links = (s.links || []).map(function (l) {
        return "<a class=\"btn btn-ghost\" href=\"" + root + "/" + l.href + "\">" + l.label + "</a>";
      }).join("");
      return "<div class=\"site-card " + (s.status === "pending" ? "pending" : "") + "\">" +
        "<h3>" + s.label + " " + pill(s.status) + "</h3>" +
        "<div class=\"site-loc\">" + s.location + " · " + s.type + " · " + s.journey + "</div>" +
        "<div class=\"site-meta\">" + rows + "</div>" +
        (steps ? "<div class=\"lc-strip\">" + steps + "</div>" : "") +
        (links ? "<div class=\"site-links\">" + links + "</div>" : "") +
        "</div>";
    }).join("");
  }

  /* ---- data slots table ----------------------------------------------- */
  /* renderSlotTable("slots-body", slots?)
     Rows of {stream, source, status, note} — defaults to SOLARA_CASE.data_slots. */
  function renderSlotTable(id, slots) {
    slots = slots || (window.SOLARA_CASE || {}).data_slots || [];
    el(id).innerHTML = slots.map(function (s) {
      return "<tr><td><strong>" + s.stream + "</strong>" +
        (s.note ? "<span class=\"slot-src\">" + s.note + "</span>" : "") + "</td>" +
        "<td>" + s.source + "</td><td>" + pill(s.status, s.status_label) + "</td></tr>";
    }).join("");
  }

  /* ---- benchmark table (Operate) -------------------------------------- */
  /* renderBenchmark("bench-body")
     SOLARA_CASE.benchmark = {metrics:[{key,label,unit}], rows:{siteId:{key:val|"pending"}}}
     Sites without data render as pending cells — a new data delivery fills a
     column by editing the case file only. */
  function renderBenchmark(id) {
    var C = window.SOLARA_CASE, B = C.benchmark;
    el(id).innerHTML = B.metrics.map(function (m) {
      var cells = C.sites.map(function (s) {
        var v = (B.rows[s.id] || {})[m.key];
        if (v === undefined || v === "pending") {
          return "<td>" + pill("pending") + "</td>";
        }
        return "<td class=\"num\">" + v + "</td>";
      }).join("");
      return "<tr><td><strong>" + m.label + "</strong>" +
        (m.unit ? "<span class=\"slot-src\">" + m.unit + "</span>" : "") + "</td>" + cells + "</tr>";
    }).join("");
  }
  function renderBenchmarkHead(id) {
    var C = window.SOLARA_CASE;
    el(id).innerHTML = "<th>Metric</th>" + C.sites.map(function (s) {
      return "<th>" + s.label + "</th>";
    }).join("");
  }

  /* ---- Operate forecast strip (indoor-climate forecast + heat alert) --- */
  /* renderForecastStrip("fc-banner", "fc-chart", "fc-days", url)
     Reads a data/feeds/<site>.json forecast snapshot written by the site-model
     pipeline: alert banner (level + reasons), a 48 h indoor/outdoor line
     chart, and per-day mean/max chips. Actor-less by contract: temperatures
     only. Needs Plotly for the chart. */
  function renderForecastStrip(bannerId, chartId, daysId, url) {
    fetch(url, { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (f) {
      var lvl = (f.alert && f.alert.level) || "none";
      var col = { none: TEAL2, warning: PV, critical: SHORT }[lvl];
      var label = { none: "no alert", warning: "warning", critical: "critical" }[lvl];
      el(bannerId).innerHTML =
        '<div style="border-left:4px solid ' + col + ';padding:10px 14px;background:' + col + '14">' +
        '<strong style="color:' + col + ';text-transform:uppercase;letter-spacing:.03em">' +
        "heat alert: " + label + "</strong>" +
        ((f.alert && f.alert.reasons && f.alert.reasons.length)
          ? "<div style=\"margin-top:4px\">" + f.alert.reasons.join(" · ") + "</div>" : "") +
        '<div class="muted" style="font-size:.8rem;margin-top:4px">issued ' + f.updated_iso +
        " UTC · " + f.note + "</div></div>";
      if (window.Plotly && f.series) {
        Plotly.newPlot(chartId, [
          { x: f.series.t, y: f.series.indoor, name: "Indoor (simulated)",
            line: { color: TEAL2, width: 2.4 } },
          { x: f.series.t, y: f.series.outdoor, name: "Outdoor (forecast)",
            line: { color: MUTED, width: 1.4, dash: "dash" } },
        ], Object.assign({}, BASE, {
          height: 300, yaxis: Object.assign({}, BASE.yaxis, { title: "°C" }),
          shapes: [28, 31].map(function (y, i) {
            return { type: "line", xref: "paper", x0: 0, x1: 1, y0: y, y1: y,
                     line: { color: i ? SHORT : PV, width: 1, dash: "dot" } };
          }),
        }), CONFIG);
      }
      el(daysId).innerHTML = (f.days || []).map(function (d) {
        return '<span class="tag-pill" style="margin-right:8px">' + d.date +
          " · mean " + fmt(d.mean, 1) + " · max " + fmt(d.max, 1) + " °C</span>";
      }).join("");
    }).catch(function () {
      el(bannerId).innerHTML = "<p class=\"muted\">Forecast feed not reachable (" + url + ").</p>";
    });
  }

  /* ---- Operate feed tiles (live-ready) -------------------------------- */
  /* renderFeed("feed-meta", "feed-tiles", url)
     Reads a data/feeds/<site>.json snapshot: shows source + updated timestamp,
     then one metric row per entry. Swapping the file swaps the dashboard. */
  function renderFeed(metaId, tilesId, url) {
    fetch(url, { cache: "no-cache" }).then(function (r) { return r.json(); }).then(function (f) {
      el(metaId).innerHTML =
        pill(f.source === "sensor-feed" ? "live" : "demo",
             f.source === "sensor-feed" ? "live feed" : "static snapshot · live-ready") +
        "<span>last updated " + f.updated_iso + "</span>" +
        "<span>source: " + url.split("/").pop() + "</span>";
      el(tilesId).innerHTML = f.metrics.map(function (m) {
        var dot = { ok: "ok", good: "good", warn: "warn" }[m.status] || "good";
        return "<div class=\"metric-row\">" +
          "<div><div class=\"metric-name\">" + m.label + "</div>" +
          (m.target !== undefined ? "<div class=\"metric-sub\">Target " + m.target + " " + (m.unit || "") + "</div>" : "") + "</div>" +
          "<div style=\"text-align:right\"><div class=\"metric-val\">" + m.value + " " + (m.unit || "") + "</div>" +
          "<div class=\"metric-sub\"><span class=\"status-dot " + dot + "\"></span>" + (m.status_label || m.status) + "</div></div>" +
          "</div>";
      }).join("");
    }).catch(function () {
      el(tilesId).innerHTML = "<p class=\"muted\">Feed file not reachable (" + url + ").</p>";
    });
  }

  /* ---- winter band shapes (weekly charts) ------------------------------ */
  function winterShapes(winter) {
    var shapes = [], start = null;
    for (var i = 0; i < winter.length; i++) {
      if (winter[i] && start === null) start = i + 1;
      if ((!winter[i] || i === winter.length - 1) && start !== null) {
        var end = winter[i] ? winter.length : i;
        shapes.push({ type: "rect", xref: "x", yref: "paper", x0: start - 0.5, x1: end + 0.5,
                      y0: 0, y1: 1, fillcolor: "rgba(45,96,102,0.07)", line: { width: 0 }, layer: "below" });
        start = null;
      }
    }
    return shapes;
  }

  /* ---- Farm32 basil weekly charts -------------------------------------- */
  /* renderBasilPlanChart("chart-plan", scenario)
     Bars: beds planted/week (optimized); line: occupancy vs bed cap; winter shaded. */
  function renderBasilPlanChart(id, s) {
    var P = window.SOLARA_CASE_DATA.plan;
    var weeks = P.scenarios[0].optimized.plan.map(function (_, i) { return i + 1; });
    Plotly.react(id, [
      { name: "Beds planted (optimized)", type: "bar", x: weeks, y: s.optimized.plan,
        marker: { color: TEAL2 }, hovertemplate: "W%{x}: %{y} beds planted<extra></extra>" },
      { name: "Beds in use", type: "scatter", mode: "lines", x: weeks, y: s.optimized.occupancy,
        yaxis: "y2", line: { color: TEAL, width: 2 },
        hovertemplate: "W%{x}: %{y} of " + P.meta.beds + " beds in use<extra></extra>" },
    ], Object.assign({}, BASE, {
      height: 360,
      shapes: winterShapes(P.winter).concat([
        { type: "line", xref: "paper", yref: "y2", x0: 0, x1: 1, y0: P.meta.beds, y1: P.meta.beds,
          line: { color: SHORT, width: 1.4, dash: "dash" } }]),
      xaxis: Object.assign({}, BASE.xaxis, { title: "Planting week", dtick: 4 }),
      yaxis: Object.assign({}, BASE.yaxis, { title: "Beds planted / week", range: [0, P.meta.max_plant_per_week * 1.25] }),
      yaxis2: { title: "Beds in use", overlaying: "y", side: "right", range: [0, P.meta.beds * 1.25],
                gridcolor: "transparent", linecolor: RULE },
      annotations: [{ xref: "paper", yref: "y2", x: 0.99, y: P.meta.beds, text: "cap " + P.meta.beds,
                      showarrow: false, yshift: 9, font: { size: 10, color: SHORT } }],
    }), CONFIG);
  }

  /* renderBasilMarginChart("chart-margin", scenario)
     Bars: margin €/m² by planting week (red < 0); line: €/kg at harvest. */
  function renderBasilMarginChart(id, s) {
    var P = window.SOLARA_CASE_DATA.plan;
    var weeks = s.margin_per_m2.map(function (_, i) { return i + 1; });
    var durW = Math.floor(P.cycle.base_days / 7);
    var harvestPrice = weeks.map(function (w) { return P.price_by_harvest_week[(w - 1 + durW) % 52]; });
    Plotly.react(id, [
      { name: "Margin per planted m²", type: "bar", x: weeks, y: s.margin_per_m2,
        marker: { color: s.margin_per_m2.map(function (v) { return v >= 0 ? TEAL2 : SHORT; }) },
        hovertemplate: "W%{x}: €%{y:.2f}/m²<extra></extra>" },
      { name: "Price at harvest (€/kg)", type: "scatter", mode: "lines", x: weeks, y: harvestPrice,
        yaxis: "y2", line: { color: PV, width: 2, shape: "hv" },
        hovertemplate: "W%{x} batch sells at €%{y:.2f}/kg<extra></extra>" },
    ], Object.assign({}, BASE, {
      height: 360, shapes: winterShapes(P.winter),
      xaxis: Object.assign({}, BASE.xaxis, { title: "Planting week", dtick: 4 }),
      yaxis: Object.assign({}, BASE.yaxis, { title: "Margin (€/m² planted)", zerolinecolor: MUTED, zerolinewidth: 1.5 }),
      yaxis2: { title: "€/kg at harvest", overlaying: "y", side: "right",
                gridcolor: "transparent", linecolor: RULE, rangemode: "tozero" },
    }), CONFIG);
  }

  /* ---- chrysanthemum weekly charts -------------------------------------- */
  function ywTicks(weeks) {
    var vals = [], text = [];
    weeks.forEach(function (yw, i) {
      if (/-W01$/.test(yw)) { vals.push(i); text.push(yw.slice(0, 4)); }
    });
    return { tickvals: vals, ticktext: text };
  }

  /* renderKappenChart("chart-kappen", year)
     Optimized kappen/week as bars, baseline plan as step line, price €/stem on y2.
     `year` optional ("2026"): restricts the view to that planting year's weeks;
     omitted or "all" shows the full horizon. */
  function renderKappenChart(id, year) {
    var W = window.SOLARA_CASE_DATA.plan.weekly;
    var weeks = Object.keys(W.plans.grower.kappen_by_week);
    if (year && year !== "all") {
      weeks = weeks.filter(function (yw) { return yw.slice(0, 4) === year; });
    }
    var x = weeks.map(function (_, i) { return i; });
    var price = weeks.map(function (yw) { return W.price_by_week[yw] || null; });
    var t = ywTicks(weeks);
    if (year && year !== "all") {
      t = { tickvals: [], ticktext: [] };
      weeks.forEach(function (yw, i) {
        if (i % 4 === 0) { t.tickvals.push(i); t.ticktext.push(yw.slice(5)); }
      });
    }
    Plotly.react(id, [
      { name: "Optimized plan (kappen/wk)", type: "bar", x: x,
        y: weeks.map(function (w) { return W.plans.optimized.kappen_by_week[w]; }),
        marker: { color: TEAL2 }, hovertemplate: "%{customdata}: %{y} kappen<extra>optimized</extra>",
        customdata: weeks },
      { name: "Baseline plan", type: "scatter", mode: "lines", line: { color: TEAL, width: 1.4, shape: "hv" },
        x: x, y: weeks.map(function (w) { return W.plans.grower.kappen_by_week[w]; }),
        hovertemplate: "%{customdata}: %{y} kappen<extra>baseline</extra>", customdata: weeks },
      { name: "Expected price (€/stem)", type: "scatter", mode: "lines", yaxis: "y2",
        line: { color: PV, width: 1.4 }, x: x, y: price,
        hovertemplate: "%{customdata}: €%{y:.2f}/stem<extra></extra>", customdata: weeks },
    ], Object.assign({}, BASE, {
      height: 380,
      xaxis: Object.assign({}, BASE.xaxis, { title: "", tickvals: t.tickvals, ticktext: t.ticktext }),
      yaxis: Object.assign({}, BASE.yaxis, { title: "Kappen planted / week" }),
      yaxis2: { title: "€/stem", overlaying: "y", side: "right", rangemode: "tozero",
                gridcolor: "transparent", linecolor: RULE },
    }), CONFIG);
  }

  /* renderSweepChart("chart-sweep")
     Marginal €-value of raising the weekly planting/harvest rate cap. */
  function renderSweepChart(id) {
    var sweep = window.SOLARA_CASE_DATA.plan.weekly.capacity_sweep.slice(1);
    Plotly.react(id, [{
      type: "bar",
      x: sweep.map(function (r) { return r.max_per_week + "th kap/wk"; }),
      y: sweep.map(function (r) { return r.marginal; }),
      marker: { color: [TEAL, TEAL2, TEAL3, "#7FBFC7"] },
      hovertemplate: "%{x}: +€%{y:,.0f} over the horizon<extra></extra>",
    }], Object.assign({}, BASE, {
      height: 340,
      xaxis: Object.assign({}, BASE.xaxis, { title: "Extra weekly capacity step" }),
      yaxis: Object.assign({}, BASE.yaxis, { title: "Marginal revenue (€, 2025–2029)" }),
    }), CONFIG);
  }

  /* renderStochasticTable("stoch-body", activeKey, keys)
     One row per candidate plan: per-scenario revenue, expected, CVaR, WD share.
     `keys` picks and orders the plans shown — plain strings or {key, label}
     objects (label overrides the data label); `activeKey`'s row is highlighted
     (same treatment as renderFloraComparison). Defaults: all plans, no highlight. */
  function renderStochasticTable(id, activeKey, keys) {
    var S = window.SOLARA_CASE_DATA.plan.stochastic;
    var names = S.scenarios.map(function (s) { return s.name; });
    el(id).innerHTML = (keys || Object.keys(S.plans)).map(function (k) {
      var key = k.key || k;
      var p = S.plans[key];
      var cells = names.map(function (n) {
        return "<td class=\"num\">€" + fmt(p.per_scenario[n]) + "</td>";
      }).join("");
      return "<tr" + (key === activeKey ? " style=\"background:var(--soft)\"" : "") + ">" +
        "<td><strong>" + (k.label || p.label) + "</strong></td>" + cells +
        "<td class=\"num\">€" + fmt(p.expected) + "</td>" +
        "<td class=\"num\">€" + fmt(p.cvar) + "</td>" +
        "<td class=\"num\">" + (p.womens_day_share * 100).toFixed(1) + "%</td></tr>";
    }).join("");
  }

  /* renderStochasticRhythm("chart-rhythm", planKey)
     Selected plan's kappen/week through one Women's-Day run-up (2025-W40 →
     2026-W12), baseline plan as step-line overlay, harvest window wk 05–10
     shaded. Shows what each candidate plan changes on the ground. */
  function renderStochasticRhythm(id, planKey) {
    var S = window.SOLARA_CASE_DATA.plan.stochastic;
    var all = Object.keys(S.plans.grower.kappen_by_week);
    var weeks = all.slice(all.indexOf("2025-W40"), all.indexOf("2026-W12") + 1);
    var x = weeks.map(function (_, i) { return i; });
    var ticks = weeks.map(function (yw, i) { return [i, yw.slice(5)]; })
      .filter(function (t, i) { return i % 4 === 0; });
    var wd0 = weeks.indexOf("2026-W05"), wd1 = weeks.indexOf("2026-W10");
    var traces = [
      { name: "Selected plan (kappen/wk)", type: "bar", x: x,
        y: weeks.map(function (w) { return S.plans[planKey].kappen_by_week[w]; }),
        marker: { color: TEAL2 }, hovertemplate: "%{customdata}: %{y} kappen<extra>selected</extra>",
        customdata: weeks },
    ];
    if (planKey !== "grower") traces.push(
      { name: "Baseline plan", type: "scatter", mode: "lines",
        line: { color: TEAL, width: 1.4, shape: "hv" },
        x: x, y: weeks.map(function (w) { return S.plans.grower.kappen_by_week[w]; }),
        hovertemplate: "%{customdata}: %{y} kappen<extra>baseline</extra>", customdata: weeks });
    Plotly.react(id, traces, Object.assign({}, BASE, {
      height: 300,
      shapes: [{ type: "rect", xref: "x", yref: "paper", x0: wd0 - 0.5, x1: wd1 + 0.5,
                 y0: 0, y1: 1, fillcolor: "rgba(224,165,42,0.14)", line: { width: 0 } }],
      annotations: [{ x: (wd0 + wd1) / 2, y: 1.02, xref: "x", yref: "paper",
                      text: "Women's-Day harvest", showarrow: false,
                      font: { size: 10.5, color: "#8A6A15" } }],
      xaxis: Object.assign({}, BASE.xaxis, { title: "",
        tickvals: ticks.map(function (t) { return t[0]; }),
        ticktext: ticks.map(function (t) { return t[1]; }) }),
      yaxis: Object.assign({}, BASE.yaxis, { title: "Kappen planted / week" }),
    }), CONFIG);
  }

  /* ---- six-crop study (flora) ------------------------------------------ */
  /* Fixed crop palette (index-matched to SOLARA_CASE_DATA.plan.crops). */
  var FLORA_COLORS = [TEAL2, PV, SHORT, LOAD, BATT, TEAL3];
  function floraColor(cropId) {
    var crops = window.SOLARA_CASE_DATA.plan.crops;
    for (var i = 0; i < crops.length; i++) if (crops[i].id === cropId) return FLORA_COLORS[i % FLORA_COLORS.length];
    return MUTED;
  }

  /* renderFloraMatrix("matrix", scenario, "production"|"planting")
     Crop × period m² table; cell shade scales with the m² value. */
  function renderFloraMatrix(id, s, view) {
    var P = window.SOLARA_CASE_DATA.plan;
    var grid = s[view], vmax = 1;
    P.crops.forEach(function (c) {
      var row = grid[c.id] || {};
      Object.keys(row).forEach(function (p) { if (row[p] > vmax) vmax = row[p]; });
    });
    var html = "<thead><tr><th>Crop</th>";
    for (var p = 1; p <= P.periods; p++) html += "<th class=\"num\">P" + p + "</th>";
    html += "<th class=\"num\">Σ m²</th></tr></thead><tbody>";
    P.crops.forEach(function (c) {
      var row = grid[c.id] || {}, total = 0;
      html += "<tr><td style=\"white-space:nowrap\"><span style=\"display:inline-block;width:10px;height:10px;border-radius:2px;background:" +
        floraColor(c.id) + ";margin-right:7px\"></span><strong>" + c.name + "</strong></td>";
      for (var q = 1; q <= P.periods; q++) {
        var v = row[q] || 0; total += v;
        html += v > 0.5
          ? "<td class=\"num\" style=\"background:color-mix(in srgb, " + floraColor(c.id) + " " +
            Math.round(8 + 30 * (v / vmax)) + "%, transparent)\" title=\"" + c.name + " — period " + q +
            ": " + fmt(v) + " m²\">" + fmt(v) + "</td>"
          : "<td class=\"num muted\">·</td>";
      }
      html += "<td class=\"num\"><strong>" + (total > 0.5 ? fmt(total) : "—") + "</strong></td></tr>";
    });
    el(id).innerHTML = html + "</tbody>";
  }

  /* renderFloraResource("chart-ground", scenario, "area"|"labor")
     Utilization per period as bars with the shadow price written above each
     valuable binding bar. Three states: shadow price > 0 (full color + gold
     label), full but zero shadow price (mid-tone — the resource is used up
     yet more of it would not earn more; LP degeneracy makes this legitimate),
     and slack (gray). */
  function renderFloraResource(id, s, kind) {
    var rows = s.resources.filter(function (r) { return r.resource === kind; })
      .sort(function (a, b) { return a.period - b.period; });
    var color = kind === "area" ? TEAL2 : LOAD;
    var midColor = kind === "area" ? "rgba(33,128,141,0.55)" : "rgba(45,96,102,0.55)";
    var unit = kind === "area" ? "m²" : "hours";
    function isFull(r) { return r.used / r.limit >= 0.9999; }
    var ann = [];
    rows.forEach(function (r) {
      if (r.shadow_price > 1e-6) ann.push({
        x: r.period, y: 100 * r.used / r.limit, yshift: 10, showarrow: false,
        text: r.shadow_price.toFixed(2), font: { size: 10, color: PV },
      });
    });
    Plotly.react(id, [{
      type: "bar", x: rows.map(function (r) { return r.period; }),
      y: rows.map(function (r) { return 100 * r.used / r.limit; }),
      marker: { color: rows.map(function (r) {
        if (r.shadow_price > 1e-6) return color;
        return isFull(r) ? midColor : "rgba(98,108,113,0.35)";
      }) },
      customdata: rows.map(function (r) {
        if (r.shadow_price > 1e-6)
          return "binding — shadow price €" + r.shadow_price.toFixed(2) + " per extra unit";
        return isFull(r)
          ? "full — but more " + unit + " here would not earn more"
          : "slack — extra " + unit + " buy nothing here";
      }),
      hovertemplate: "P%{x}: %{y:.1f}% used<br>%{customdata}<extra></extra>",
    }], Object.assign({}, BASE, {
      height: 260, margin: { l: 44, r: 12, t: 26, b: 34 },
      annotations: ann,
      shapes: [{ type: "line", xref: "paper", x0: 0, x1: 1, y0: 100, y1: 100,
                 line: { color: RULE, width: 1, dash: "dash" } }],
      xaxis: Object.assign({}, BASE.xaxis, { title: "Period", dtick: 1 }),
      yaxis: Object.assign({}, BASE.yaxis, { title: "% of limit", range: [0, 118] }),
    }), CONFIG);
  }

  /* renderFloraStochTable("wd-body", activeKey, keys)
     One row per candidate plan of the Women's-Day block: profit under each
     price future, expected, CVaR. `keys` = [{key, label}] picks, orders and
     relabels the rows; activeKey's row is highlighted. */
  function renderFloraStochTable(id, activeKey, keys) {
    var S = window.SOLARA_CASE_DATA.plan.stochastic;
    var names = S.scenarios.map(function (s) { return s.name; });
    el(id).innerHTML = (keys || Object.keys(S.plans)).map(function (k) {
      var key = k.key || k;
      var p = S.plans[key];
      var cells = names.map(function (n) {
        return "<td class=\"num\">€" + fmt(p.per_scenario[n]) + "</td>";
      }).join("");
      return "<tr" + (key === activeKey ? " style=\"background:var(--soft)\"" : "") + ">" +
        "<td><strong>" + (k.label || p.label) + "</strong></td>" + cells +
        "<td class=\"num\">€" + fmt(p.expected) + "</td>" +
        "<td class=\"num\">€" + fmt(p.cvar) + "</td></tr>";
    }).join("");
  }

  /* renderFloraSpikeMix("chart-wd-mix", planKey)
     Period-3 harvest area of the spike crops: selected plan (crop colors)
     vs the base plan (gray), grouped bars. */
  function renderFloraSpikeMix(id, planKey) {
    var P = window.SOLARA_CASE_DATA.plan, S = P.stochastic;
    var names = S.spike_crops.map(function (c) {
      var crop = P.crops.find(function (x) { return x.id === c; });
      return crop ? crop.name : c;
    });
    function mix(key) {
      return S.spike_crops.map(function (c) { return S.plans[key].p3_mix[c] || 0; });
    }
    var traces = [{
      name: "Selected plan", type: "bar", x: names, y: mix(planKey),
      marker: { color: S.spike_crops.map(floraColor) },
      hovertemplate: "%{x}: %{y:,.0f} m² harvested in P" + S.spike_period + "<extra>selected</extra>",
    }];
    if (planKey !== "base") traces.push({
      name: "Base plan", type: "bar", x: names, y: mix("base"),
      marker: { color: "rgba(98,108,113,0.35)" },
      hovertemplate: "%{x}: %{y:,.0f} m² harvested in P" + S.spike_period + "<extra>base</extra>",
    });
    Plotly.react(id, traces, Object.assign({}, BASE, {
      height: 280, barmode: "group",
      margin: { l: 54, r: 12, t: 26, b: 34 },
      yaxis: Object.assign({}, BASE.yaxis, { title: "m² harvested in P" + S.spike_period }),
      xaxis: Object.assign({}, BASE.xaxis, { title: "" }),
    }), CONFIG);
  }

  /* renderFloraComparison("cmp-body", scenarios, activeName)
     Model vs published profit per scenario, active row bolded. */
  function renderFloraComparison(id, scenarios, active) {
    el(id).innerHTML = scenarios.map(function (s) {
      var d = s.profit - s.published;
      var match = Math.abs(d) < 1 ? "exact" : (100 * d / s.published).toFixed(2) + "%";
      return "<tr" + (s.name === active ? " style=\"background:var(--soft)\"" : "") + ">" +
        "<td><strong>" + s.label + "</strong><span class=\"slot-src\">" + s.desc + "</span></td>" +
        "<td class=\"num\">€" + fmt(s.profit) + "</td>" +
        "<td class=\"num\">€" + fmt(s.published) + "</td>" +
        "<td class=\"num\">" + match + "</td></tr>";
    }).join("");
  }

  window.SOLARA_UI = {
    fmt: fmt, pill: pill, setText: setText,
    renderSiteCards: renderSiteCards,
    renderSlotTable: renderSlotTable,
    renderBenchmark: renderBenchmark, renderBenchmarkHead: renderBenchmarkHead,
    renderFeed: renderFeed,
    renderForecastStrip: renderForecastStrip,
    renderBasilPlanChart: renderBasilPlanChart, renderBasilMarginChart: renderBasilMarginChart,
    renderKappenChart: renderKappenChart, renderSweepChart: renderSweepChart,
    renderStochasticTable: renderStochasticTable,
    renderStochasticRhythm: renderStochasticRhythm,
    renderFloraMatrix: renderFloraMatrix, renderFloraResource: renderFloraResource,
    renderFloraComparison: renderFloraComparison, floraColor: floraColor,
    renderFloraStochTable: renderFloraStochTable, renderFloraSpikeMix: renderFloraSpikeMix,
    COLORS: { TEAL: TEAL, TEAL2: TEAL2, TEAL3: TEAL3, PV: PV, SHORT: SHORT, BATT: BATT, LOAD: LOAD },
  };
})();
