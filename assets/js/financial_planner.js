/* SOLARA interactive crop & profit planner.
   Rewrite of reference/gemini-code-FinancialPlanning_Basil.py (Streamlit) as a
   static, client-side page module: the sidebar inputs drive an instant
   recompute of the planting schedule, financials, occupancy, and table.

   ISO-week logic (the part the Streamlit version got wrong):
     - W1 is the week containing the year's first Thursday (ISO-8601);
       a year has 52 OR 53 weeks (2026 has 53). We loop over the real count.
     - A batch planted in week w starts on that week's Monday; its harvest week
       is the ISO week of (planting Monday + growing days) — which can be
       W01+ of the NEXT ISO year. Labels always carry the ISO year ("2027-W01")
       so week numbers are unambiguous.
     - A section is occupied from its planting week up to (not including) its
       harvest week: cleared and replanted within the harvest week.

   Usage: FinancialPlanner.init() on a page that provides the input ids in
   FIELDS and the output containers (see farm32/plan/sardinia.html).
   Needs Plotly. Styling: tokens.css only. */

(function () {
  var MS_WEEK = 7 * 86400000;

  /* ---------- ISO-8601 helpers (UTC-based, timezone-safe) ---------- */
  function isoDow(d) { return (d.getUTCDay() + 6) % 7 + 1; }           // Mon=1..Sun=7
  function mondayOfISOWeek(year, week) {
    var jan4 = new Date(Date.UTC(year, 0, 4));                         // Jan 4 is always in W1
    var mon1 = new Date(jan4.getTime() - (isoDow(jan4) - 1) * 86400000);
    return new Date(mon1.getTime() + (week - 1) * MS_WEEK);
  }
  function isoWeekOf(d) {
    var t = new Date(d.getTime() + (4 - isoDow(d)) * 86400000);        // Thursday of d's week
    var isoYear = t.getUTCFullYear();
    var week = Math.floor((t - Date.UTC(isoYear, 0, 1)) / 86400000 / 7) + 1;
    return { year: isoYear, week: week };
  }
  function weeksInISOYear(y) { return isoWeekOf(new Date(Date.UTC(y, 11, 28))).week; }
  function ywLabel(yw) { return yw.year + "-W" + String(yw.week).padStart(2, "0"); }
  function dateLabel(d) {
    return d.toLocaleDateString("en-GB", { timeZone: "UTC", day: "numeric", month: "short" });
  }
  function weekIndex(monday) { return Math.round(monday.getTime() / MS_WEEK); }

  /* ---------- model ---------- */
  var FIELDS = ["year", "sections", "area", "density", "success", "growdays",
                "perweek", "winterstart", "winterend", "extradays",
                "price", "costplant", "energybase", "energywinter"];

  function readParams() {
    var p = {};
    FIELDS.forEach(function (f) { p[f] = parseFloat(document.getElementById("fp-" + f).value) || 0; });
    return p;
  }

  function isWinter(w, p, weeks) {
    var a = p.winterstart, b = p.winterend;
    if (a < 1 || b < 1) return false;
    a = Math.min(a, weeks); b = Math.min(b, weeks);
    return a <= b ? (w >= a && w <= b) : (w >= a || w <= b);
  }

  /* One row per ISO planting week of the chosen year. */
  function simulate(p) {
    var weeks = weeksInISOYear(p.year);
    var rows = [];
    for (var w = 1; w <= weeks; w++) {
      var winter = isWinter(w, p, weeks);
      var growDays = p.growdays + (winter ? p.extradays : 0);
      var plantMon = mondayOfISOWeek(p.year, w);
      var harvestDate = new Date(plantMon.getTime() + growDays * 86400000);
      var harvestYW = isoWeekOf(harvestDate);

      var plants = p.area * p.density * p.perweek;
      var sold = plants * (p.success / 100);
      var revenue = sold * p.price;
      var costPlants = plants * p.costplant;
      var rate = p.energybase + (winter ? p.energywinter : 0);
      var costEnergy = growDays * rate * p.perweek;

      rows.push({
        w: w, label: p.year + "-W" + String(w).padStart(2, "0"),
        winter: winter, plantMon: plantMon, growDays: growDays,
        harvestDate: harvestDate, harvestLabel: ywLabel(harvestYW),
        sold: sold, revenue: revenue,
        cost: costPlants + costEnergy,
        profit: revenue - costPlants - costEnergy,
        startIdx: weekIndex(plantMon),
        // occupied up to (not including) the harvest week — cleared & replanted
        // within the harvest week, matching the grower convention
        endIdx: weekIndex(mondayOfISOWeek(harvestYW.year, harvestYW.week)),
      });
    }
    // occupancy over the whole horizon (spills into the next ISO year)
    var occ = {};
    rows.forEach(function (r) {
      for (var i = r.startIdx; i < r.endIdx; i++) occ[i] = (occ[i] || 0) + p.perweek;
    });
    var occRows = Object.keys(occ).map(Number).sort(function (a, b) { return a - b; })
      .map(function (i) {
        var mon = new Date(i * MS_WEEK);
        return { label: ywLabel(isoWeekOf(mon)), used: occ[i] };
      });
    return { rows: rows, occ: occRows, weeks: weeks };
  }

  /* ---------- rendering ---------- */
  var FONT = { family: "Inter, system-ui, sans-serif", size: 12, color: "#3D4F50" };
  var TEAL2 = "#21808D", TEAL = "#1B474D", SHORT = "#A33A2C",
      RULE = "#D5D2C8", PAPER = "#FFFFFD", MUTED = "#626C71";
  var BASE = {
    paper_bgcolor: PAPER, plot_bgcolor: PAPER, font: FONT,
    margin: { l: 56, r: 24, t: 16, b: 74 },
    hoverlabel: { font: { family: "Inter, sans-serif", size: 12 }, bgcolor: "#fff", bordercolor: RULE },
    xaxis: { gridcolor: RULE, zerolinecolor: RULE, linecolor: RULE },
    yaxis: { gridcolor: RULE, zerolinecolor: RULE, linecolor: RULE },
    legend: { orientation: "h", x: 0, y: 1.15, font: { size: 11 } },
  };
  var CONFIG = { displaylogo: false, modeBarButtonsToRemove: ["lasso2d", "select2d", "autoScale2d"], responsive: true };
  var fmt = function (n, d) {
    return Number(n).toLocaleString("en-US", { minimumFractionDigits: d || 0, maximumFractionDigits: d || 0 });
  };

  function render() {
    var p = readParams();
    var sim = simulate(p);
    var rows = sim.rows;

    var revenue = rows.reduce(function (s, r) { return s + r.revenue; }, 0);
    var profit = rows.reduce(function (s, r) { return s + r.profit; }, 0);
    var over = sim.occ.filter(function (o) { return o.used > p.sections; });

    document.getElementById("fp-kpi-profit").textContent = "€" + fmt(profit);
    document.getElementById("fp-kpi-margin").textContent = revenue > 0 ? fmt(profit / revenue * 100, 1) + "%" : "—";
    document.getElementById("fp-kpi-revenue").textContent = "€" + fmt(revenue);
    document.getElementById("fp-kpi-weeks").textContent = sim.weeks;
    var capBox = document.getElementById("fp-kpi-cap-box");
    document.getElementById("fp-kpi-cap").textContent = over.length ? over.length + " wks" : "OK";
    capBox.className = over.length ? "kpi warn" : "kpi";
    document.getElementById("fp-kpi-cap-sub").textContent = over.length
      ? "over the " + p.sections + "-section cap — reduce sections/week"
      : "peak " + (sim.occ.length ? Math.max.apply(null, sim.occ.map(function (o) { return o.used; })) : 0) +
        " of " + p.sections + " sections";

    // Profit per planting week
    Plotly.react("fp-chart-profit", [{
      type: "bar", x: rows.map(function (r) { return r.label; }),
      y: rows.map(function (r) { return r.profit; }),
      marker: { color: rows.map(function (r) { return r.profit >= 0 ? TEAL2 : SHORT; }) },
      customdata: rows.map(function (r) { return r.harvestLabel; }),
      hovertemplate: "Plant %{x} → harvest %{customdata}<br>Profit €%{y:,.0f}<extra></extra>",
    }], Object.assign({}, BASE, {
      height: 330,
      xaxis: Object.assign({}, BASE.xaxis, { tickangle: -60, dtick: 4 }),
      yaxis: Object.assign({}, BASE.yaxis, { title: "Profit per weekly batch (€)", zerolinecolor: MUTED, zerolinewidth: 1.5 }),
    }), CONFIG);

    // Occupancy vs cap (horizon incl. next-year spill)
    Plotly.react("fp-chart-occ", [{
      type: "bar", x: sim.occ.map(function (o) { return o.label; }),
      y: sim.occ.map(function (o) { return o.used; }),
      marker: { color: sim.occ.map(function (o) { return o.used > p.sections ? SHORT : TEAL; }) },
      hovertemplate: "%{x}: %{y} sections in use<extra></extra>",
    }], Object.assign({}, BASE, {
      height: 330,
      shapes: [{ type: "line", xref: "paper", x0: 0, x1: 1, y0: p.sections, y1: p.sections,
                 line: { color: SHORT, width: 1.4, dash: "dash" } }],
      annotations: [{ xref: "paper", x: 0.99, y: p.sections, text: "cap " + p.sections,
                      showarrow: false, yshift: 9, font: { size: 10, color: SHORT } }],
      xaxis: Object.assign({}, BASE.xaxis, { tickangle: -60, dtick: 4 }),
      yaxis: Object.assign({}, BASE.yaxis, { title: "Sections in use" }),
    }), CONFIG);

    // Schedule table
    document.getElementById("fp-table-body").innerHTML = rows.map(function (r) {
      return "<tr" + (r.profit < 0 ? ' style="color:var(--short)"' : "") + ">" +
        "<td>" + r.label + (r.winter ? " ❄" : "") + "</td>" +
        "<td>" + dateLabel(r.plantMon) + "</td>" +
        "<td class=\"num\">" + r.growDays + "</td>" +
        "<td>" + r.harvestLabel + " · " + dateLabel(r.harvestDate) + "</td>" +
        "<td class=\"num\">" + fmt(r.sold) + "</td>" +
        "<td class=\"num\">€" + fmt(r.revenue) + "</td>" +
        "<td class=\"num\">€" + fmt(r.cost) + "</td>" +
        "<td class=\"num\">€" + fmt(r.profit) + "</td></tr>";
    }).join("");

    window.FinancialPlanner._last = { rows: rows, params: p };
  }

  function downloadCSV() {
    var last = window.FinancialPlanner._last;
    if (!last) return;
    var head = "plant_week,plant_date,growing_days,harvest_week,harvest_date,units_sold,revenue_eur,cost_eur,profit_eur";
    var lines = last.rows.map(function (r) {
      return [r.label, r.plantMon.toISOString().slice(0, 10), r.growDays, r.harvestLabel,
              r.harvestDate.toISOString().slice(0, 10),
              r.sold.toFixed(0), r.revenue.toFixed(2), r.cost.toFixed(2), r.profit.toFixed(2)].join(",");
    });
    var blob = new Blob([head + "\n" + lines.join("\n")], { type: "text/csv" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "production_schedule_" + last.params.year + ".csv";
    a.click();
    URL.revokeObjectURL(a.href);
  }

  function init() {
    FIELDS.forEach(function (f) {
      document.getElementById("fp-" + f).addEventListener("input", render);
    });
    var btn = document.getElementById("fp-csv");
    if (btn) btn.addEventListener("click", downloadCSV);
    render();
  }

  window.FinancialPlanner = { init: init, _last: null };
})();
