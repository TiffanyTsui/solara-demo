/* SOLARA shared chart engine — used by /design/energy, /design/solar, /operate */

const FONT = { family: "Inter, system-ui, sans-serif", size: 12, color: "#3D4F50" };
const TEAL = "#1B474D";
const TEAL2 = "#21808D";
const TEAL3 = "#3FA9B5";
const PV = "#E0A52A";
const LOAD = "#2D6066";
const BATT = "#7A4B9C";
const SHORT = "#A33A2C";
const RULE = "#D5D2C8";
const PAPER = "#FFFFFD";

const BASE_LAYOUT = {
  paper_bgcolor: PAPER,
  plot_bgcolor: PAPER,
  font: FONT,
  margin: { l: 56, r: 24, t: 18, b: 44 },
  hoverlabel: { font: { family: "Inter, sans-serif", size: 12 }, bgcolor: "#fff", bordercolor: RULE },
  xaxis: { gridcolor: RULE, zerolinecolor: RULE, linecolor: RULE },
  yaxis: { gridcolor: RULE, zerolinecolor: RULE, linecolor: RULE },
  legend: { orientation: "h", x: 0, y: 1.12, font: { size: 11 } },
};

const CONFIG = {
  displaylogo: false,
  modeBarButtonsToRemove: ["lasso2d", "select2d", "autoScale2d"],
  responsive: true,
};

function fmt(n, d = 0) {
  if (n === undefined || n === null || Number.isNaN(n)) return "—";
  return Number(n).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
}

let DATA = null;
let currentVariant = "staggered";

function _dataUrl() {
  // Resolve data/results.json relative to this script's URL so it works under any base path.
  try {
    const scripts = document.getElementsByTagName('script');
    for (const s of scripts) {
      if (s.src && s.src.includes('solara_charts.js')) {
        return new URL('../../data/results.json', s.src).href;
      }
    }
  } catch (e) {}
  return 'data/results.json';
}

async function loadData() {
  if (DATA) return DATA;
  const r = await fetch(_dataUrl(), { cache: "no-cache" });
  DATA = await r.json();
  return DATA;
}

function bindVariantToggle(onChange) {
  document.querySelectorAll(".toggle-btn[data-variant]").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".toggle-btn[data-variant]").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      currentVariant = btn.dataset.variant;
      if (onChange) onChange(currentVariant);
    });
  });
}

/* ===== Facility 3D ===== */
function zoneBoxMesh(x0, x1, y0, y1, z0, z1, color, name, opacity) {
  const x = [x0, x1, x1, x0, x0, x1, x1, x0];
  const y = [y0, y0, y1, y1, y0, y0, y1, y1];
  const z = [z0, z0, z0, z0, z1, z1, z1, z1];
  const i = [0, 0, 4, 4, 0, 0, 1, 1, 2, 2, 3, 3];
  const j = [1, 2, 5, 6, 1, 5, 2, 6, 3, 7, 0, 4];
  const k = [2, 3, 6, 7, 5, 4, 6, 5, 7, 6, 4, 7];
  return {
    type: "mesh3d", name, x, y, z, i, j, k, color, opacity,
    flatshading: true,
    hovertemplate: `${name}<br>Footprint: ${((x1 - x0) * (y1 - y0)).toFixed(0)} m\u00b2<br>Volume: ${((x1 - x0) * (y1 - y0) * (z1 - z0)).toFixed(0)} m\u00b3<extra></extra>`,
    lighting: { ambient: 0.55, diffuse: 0.85, specular: 0.05, roughness: 0.9, fresnel: 0.05 },
    lightposition: { x: 100, y: 200, z: 200 },
    showscale: false,
  };
}
function wireframeEdges(x0, x1, y0, y1, z0, z1, color, name) {
  const corners = [
    [x0, y0, z0], [x1, y0, z0], [x1, y1, z0], [x0, y1, z0],
    [x0, y0, z1], [x1, y0, z1], [x1, y1, z1], [x0, y1, z1],
  ];
  const edges = [[0,1],[1,2],[2,3],[3,0],[4,5],[5,6],[6,7],[7,4],[0,4],[1,5],[2,6],[3,7]];
  const xs = [], ys = [], zs = [];
  edges.forEach(([a, b]) => {
    xs.push(corners[a][0], corners[b][0], null);
    ys.push(corners[a][1], corners[b][1], null);
    zs.push(corners[a][2], corners[b][2], null);
  });
  return { type:"scatter3d", mode:"lines", name, x:xs, y:ys, z:zs,
    line:{color, width:3}, hoverinfo:"skip", showlegend:false };
}
function renderFacility3D(containerId) {
  const W = 13, L = 25, H = 6;
  const zoneA = zoneBoxMesh(0, W, 0, L, 0, H, TEAL2, "Zone A", 0.55);
  const zoneB = zoneBoxMesh(W, 2 * W, 0, L, 0, H, TEAL3, "Zone B", 0.55);
  const edgesA = wireframeEdges(0, W, 0, L, 0, H, TEAL, "Zone A edges");
  const edgesB = wireframeEdges(W, 2 * W, 0, L, 0, H, TEAL, "Zone B edges");
  const ledPts = { x: [], y: [], z: [] };
  for (let zx = 0; zx < 2; zx++) {
    const xStart = zx * W;
    for (let ix = 1; ix <= 3; ix++) for (let iy = 1; iy <= 5; iy++) {
      ledPts.x.push(xStart + (ix * W) / 4);
      ledPts.y.push((iy * L) / 6);
      ledPts.z.push(H - 0.4);
    }
  }
  const leds = { type:"scatter3d", mode:"markers", name:"LED fixtures",
    x:ledPts.x, y:ledPts.y, z:ledPts.z,
    marker:{ size:3.2, color:PV, symbol:"square", opacity:0.9 },
    hovertemplate:"LED fixture<br>114.3 W/m\u00b2 \u00b7 3.5 \u00b5mol/J<extra></extra>",
    showlegend:false };
  const ground = { type:"mesh3d", name:"Ground",
    x:[-1.5, 2*W+1.5, 2*W+1.5, -1.5], y:[-1.5,-1.5, L+1.5, L+1.5], z:[0,0,0,0],
    i:[0,0], j:[1,2], k:[2,3],
    color:"#E8E3D4", opacity:0.5, showlegend:false, hoverinfo:"skip",
    lighting:{ambient:1.0, diffuse:0} };

  const annotations = [
    { x: W, y: -5, z: 0, text: "<b>26 m</b> east\u2013west", showarrow: false,
      font: { color: TEAL, size: 12, family: "DM Sans, sans-serif" } },
    { x: 2 * W + 6, y: L / 2, z: 0, text: "<b>25 m</b> north\u2013south", showarrow: false,
      font: { color: TEAL, size: 12, family: "DM Sans, sans-serif" } },
    { x: 0, y: L, z: H, text: "<b>Zone A</b> \u00b7 325 m\u00b2<br>photoperiod 02\u201320", showarrow: true,
      ax: -90, ay: -50, arrowhead: 2, arrowcolor: TEAL2,
      font: { color: TEAL, size: 11, family: "DM Sans, sans-serif" }, align: "left" },
    { x: 1.5 * W, y: L, z: H, text: "<b>Zone B</b> \u00b7 325 m\u00b2<br>photoperiod 08\u201302", showarrow: true,
      ax: 30, ay: -110, arrowhead: 2, arrowcolor: TEAL3,
      font: { color: TEAL, size: 11, family: "DM Sans, sans-serif" }, align: "left" },
  ];

  const layout = {
    paper_bgcolor: PAPER, plot_bgcolor: PAPER, font: FONT,
    margin: { l: 0, r: 0, t: 30, b: 0 }, height: 380, showlegend: false,
    scene: {
      aspectmode: "data", bgcolor: PAPER,
      camera: { eye: { x: 1.65, y: -1.85, z: 1.05 }, up: { x: 0, y: 0, z: 1 } },
      xaxis: { title: "east \u2192 (m)", gridcolor: RULE, zerolinecolor: RULE, backgroundcolor: PAPER, showbackground: true, range: [-6, 34], tickfont: { size: 10 } },
      yaxis: { title: "north \u2192 (m)", gridcolor: RULE, zerolinecolor: RULE, backgroundcolor: PAPER, showbackground: true, range: [-8, 32], tickfont: { size: 10 } },
      zaxis: { title: "height (m)", gridcolor: RULE, zerolinecolor: RULE, backgroundcolor: PAPER, showbackground: true, range: [0, 14], tickfont: { size: 10 } },
      annotations,
    },
  };
  Plotly.react(containerId, [ground, zoneA, zoneB, edgesA, edgesB, leds], layout, CONFIG);
}

/* ===== Monthly bar (load + PV used + unmet, plus shortfall-hours line) ===== */
function renderMonthly(containerId, d) {
  const months = d.monthly.map((m) => m.month);
  const loadMWh = d.monthly.map((m) => m.load_mwh);
  const pvMWh = d.monthly.map((m) => m.pv_used_mwh);
  const unmetMWh = d.monthly.map((m) => m.unmet_mwh);
  const shortHrs = d.monthly.map((m) => m.shortfall_hours);
  const layout = {
    ...BASE_LAYOUT, barmode: "group", height: 380,
    margin: { l: 64, r: 72, t: 18, b: 44 },
    xaxis: { ...BASE_LAYOUT.xaxis, title: "" },
    yaxis: { ...BASE_LAYOUT.yaxis, title: "Energy (MWh)" },
    yaxis2: { title: { text: "Shortfall hours", standoff: 20 }, overlaying: "y", side: "right",
      gridcolor: "transparent", linecolor: RULE, zerolinecolor: RULE, automargin: true },
    legend: { ...BASE_LAYOUT.legend, y: 1.1 },
  };
  const traces = [
    { name: "Load", type: "bar", x: months, y: loadMWh, marker: { color: LOAD } },
    { name: "PV used to serve load", type: "bar", x: months, y: pvMWh, marker: { color: PV } },
    { name: "Unmet energy", type: "bar", x: months, y: unmetMWh, marker: { color: SHORT } },
    { name: "Shortfall hours", type: "scatter", mode: "lines+markers", x: months, y: shortHrs,
      yaxis: "y2", line: { color: TEAL, width: 2 }, marker: { size: 7, color: TEAL } },
  ];
  Plotly.react(containerId, traces, layout, CONFIG);
}

/* ===== Monthly load only (for energy module) ===== */
function renderMonthlyLoad(containerId, d) {
  const months = d.monthly.map((m) => m.month);
  const loadMWh = d.monthly.map((m) => m.load_mwh);
  const layout = {
    ...BASE_LAYOUT, height: 340,
    xaxis: { ...BASE_LAYOUT.xaxis, title: "" },
    yaxis: { ...BASE_LAYOUT.yaxis, title: "Electricity load (MWh)" },
  };
  Plotly.react(containerId, [
    { name: "Monthly facility load", type: "bar", x: months, y: loadMWh, marker: { color: LOAD } }
  ], layout, CONFIG);
}

/* ===== Daily mean profile (load + breakdown) — for energy module ===== */
function renderDailyLoadBreakdown(containerId, d) {
  // Synthetic breakdown by component using the same total daily load curve.
  // LED ~ photoperiod block, HVAC ~ midday hump, fans/pumps ~ constant.
  const dm = d.daily_mean;
  const x = Array.from({ length: 24 }, (_, i) => i);
  // Approximate decomposition fractions:
  //  - LED: 60% when load > 60kW (photoperiod active), else 0
  //  - HVAC: 25-35%, peaks midday with ambient T
  //  - Fans/pumps/CO2: ~5% constant background
  const total = dm.load_kw;
  const fans = total.map(v => Math.max(8, 0.06 * v));
  // HVAC shape: tent function peaking at hour 14
  const hvacShape = x.map(h => Math.exp(-((h-14)**2)/40));
  const hvacScale = Math.max(...total) * 0.28 / Math.max(...hvacShape);
  const hvac = hvacShape.map(s => s * hvacScale);
  // LED = remainder
  const led = total.map((v,i) => Math.max(0, v - fans[i] - hvac[i]));

  const layout = {
    ...BASE_LAYOUT, height: 340,
    xaxis: { ...BASE_LAYOUT.xaxis, title: "Hour of day", tickmode: "array",
      tickvals: [0,4,8,12,16,20,23] },
    yaxis: { ...BASE_LAYOUT.yaxis, title: "Mean power (kW)" },
    barmode: "stack",
  };
  Plotly.react(containerId, [
    { name: "LED canopy", type: "bar", x, y: led, marker: { color: PV } },
    { name: "HVAC (cool + dehum)", type: "bar", x, y: hvac, marker: { color: TEAL3 } },
    { name: "Fans, pumps, CO\u2082", type: "bar", x, y: fans, marker: { color: TEAL2 } },
    { name: "Total load", type: "scatter", mode: "lines", x, y: total,
      line: { color: TEAL, width: 2.2 } },
  ], layout, CONFIG);
}

/* ===== Worst week (dispatch + SoC) — solar module ===== */
function renderWorstWeek(containerId, d) {
  const w = d.worst_week;
  const x = Array.from({ length: w.load_kw.length }, (_, i) => i);
  const startHour = w.start_hour;
  const tickIdx = [0, 24, 48, 72, 96, 120, 144, 167];
  const tickVals = tickIdx.map((i) => `D${Math.floor(i / 24) + 1} ${(i % 24).toString().padStart(2, "0")}:00`);
  const layout = {
    ...BASE_LAYOUT, height: 380,
    xaxis: { ...BASE_LAYOUT.xaxis, title: `Hour from worst-week start (annual hour ${startHour})`,
      tickvals: tickIdx, ticktext: tickVals },
    yaxis: { ...BASE_LAYOUT.yaxis, title: "Power (kW)" },
    yaxis2: { title: "Battery SoC (%)", overlaying: "y", side: "right", range: [0, 100],
      gridcolor: "transparent", linecolor: RULE, zerolinecolor: RULE },
  };
  const traces = [
    { name: "Load", type: "scatter", mode: "lines", x, y: w.load_kw, line: { color: LOAD, width: 1.6 } },
    { name: "PV → load", type: "scatter", mode: "lines", x, y: w.pv_to_load_kw,
      line: { color: PV, width: 1.6 }, fill: "tozeroy", fillcolor: "rgba(224,165,42,0.22)" },
    { name: "Battery → load", type: "scatter", mode: "lines", x, y: w.batt_to_load_kw, line: { color: BATT, width: 1.6 } },
    { name: "Shortfall", type: "scatter", mode: "lines", x, y: w.shortfall_kw,
      line: { color: SHORT, width: 1.8 }, fill: "tozeroy", fillcolor: "rgba(163,58,44,0.28)" },
    { name: "Battery SoC", type: "scatter", mode: "lines", x, y: w.soc_frac.map((v) => v * 100),
      yaxis: "y2", line: { color: TEAL, width: 1.4, dash: "dot" } },
  ];
  Plotly.react(containerId, traces, layout, CONFIG);
}

/* ===== Daily mean (dispatch) — solar module ===== */
function renderDaily(containerId, d) {
  const dm = d.daily_mean;
  const x = Array.from({ length: 24 }, (_, i) => i);
  const layout = {
    ...BASE_LAYOUT, height: 320,
    xaxis: { ...BASE_LAYOUT.xaxis, title: "Hour of day", tickmode: "array", tickvals: [0,4,8,12,16,20,23] },
    yaxis: { ...BASE_LAYOUT.yaxis, title: "Mean power (kW)" },
  };
  const traces = [
    { name: "Load", type: "scatter", mode: "lines", x, y: dm.load_kw, line: { color: LOAD, width: 2 } },
    { name: "PV", type: "scatter", mode: "lines", x, y: dm.pv_kw,
      line: { color: PV, width: 2 }, fill: "tozeroy", fillcolor: "rgba(224,165,42,0.18)" },
    { name: "Battery → load", type: "scatter", mode: "lines", x, y: dm.batt_to_load_kw, line: { color: BATT, width: 1.6 } },
    { name: "Shortfall", type: "scatter", mode: "lines", x, y: dm.shortfall_kw, line: { color: SHORT, width: 1.6 } },
  ];
  Plotly.react(containerId, traces, layout, CONFIG);
}

/* ===== Heatmap (365 × 24 shortfall) — solar module ===== */
function renderHeatmap(containerId, d) {
  const heat = d.heatmap_365x24;
  const days = heat.length;
  const z = Array.from({ length: 24 }, () => new Array(days).fill(0));
  for (let day = 0; day < days; day++) for (let hr = 0; hr < 24; hr++) z[hr][day] = heat[day][hr];
  const layout = {
    ...BASE_LAYOUT, height: 320,
    margin: { l: 50, r: 12, t: 10, b: 40 },
    xaxis: { ...BASE_LAYOUT.xaxis, title: "Day of year", showgrid: false },
    yaxis: { ...BASE_LAYOUT.yaxis, title: "Hour", autorange: "reversed", showgrid: false, dtick: 6 },
  };
  const trace = {
    type: "heatmap", z,
    colorscale: [[0, "#F4F2EC"], [0.001, "#F4D9C5"], [0.25, "#E89B6E"], [0.55, "#C25E3E"], [1, "#7A1F12"]],
    showscale: true,
    colorbar: { title: { text: "kW unmet", font: { size: 11 } }, thickness: 10, len: 0.9 },
    hovertemplate: "Day %{x}<br>Hour %{y}<br>Unmet: %{z:.1f} kW<extra></extra>",
  };
  Plotly.react(containerId, [trace], layout, CONFIG);
}

/* ===== Design-space sweep — solar module ===== */
function renderSweep(containerId, d) {
  const rows = d.sweep;
  const pvs = [...new Set(rows.map((r) => r.pv_kwp))].sort((a, b) => a - b);
  const batts = [...new Set(rows.map((r) => r.battery_kwh))].sort((a, b) => a - b);
  const z = batts.map((b) => pvs.map((p) => {
    const r = rows.find((rr) => rr.pv_kwp === p && rr.battery_kwh === b);
    return r ? r.shortfall_hours : null;
  }));
  const layout = {
    ...BASE_LAYOUT, height: 420,
    xaxis: { ...BASE_LAYOUT.xaxis, title: "PV capacity (kWp)", tickmode: "array", tickvals: pvs },
    yaxis: { ...BASE_LAYOUT.yaxis, title: "Battery energy (kWh)", tickmode: "array", tickvals: batts },
    annotations: [{
      x: 480, y: 600, text: "Farm32 design", showarrow: true, arrowhead: 2, arrowcolor: TEAL,
      ax: 80, ay: -50, font: { color: TEAL, size: 12, family: "DM Sans, sans-serif" },
      bgcolor: "#fff", bordercolor: TEAL, borderwidth: 1, borderpad: 4,
    }],
  };
  const trace = {
    type: "heatmap", x: pvs, y: batts, z,
    colorscale: [[0, "#1B474D"], [0.05, "#20808D"], [0.2, "#88B6BB"], [0.5, "#E0A52A"], [1, "#7A1F12"]],
    colorbar: { title: { text: "Shortfall<br>hours / yr", font: { size: 11 } }, thickness: 10, len: 0.9 },
    hovertemplate: "PV %{x} kWp · Battery %{y} kWh<br>Shortfall: %{z} h/yr<extra></extra>",
  };
  const contour = {
    type: "contour", x: pvs, y: batts, z,
    contours: { coloring: "lines", showlabels: true, start: 0, end: 6000, size: 500 },
    line: { color: "rgba(15,27,28,0.45)", width: 1 },
    showscale: false, hoverinfo: "skip",
  };
  Plotly.react(containerId, [trace, contour], layout, CONFIG);
}

window.SOLARA = {
  loadData, bindVariantToggle, fmt,
  renderFacility3D,
  renderMonthly, renderMonthlyLoad, renderDailyLoadBreakdown,
  renderWorstWeek, renderDaily, renderHeatmap, renderSweep,
  getVariant: () => currentVariant,
  getData: () => DATA,
  TEAL, TEAL2, TEAL3, PV, LOAD, BATT, SHORT, RULE, PAPER,
};
