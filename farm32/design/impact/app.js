/* ============================================================
   The Farm32 Footprint — SOLARA LCA engine (business guide + live calculator)
   Engine: Impact_i = sum_j ( Q_j * CF_ij )   (lookup-and-sum, no matrix solve)
   ============================================================ */
(function () {
  "use strict";
  const D = window.LCA_DATA;
  const B = D.business;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // ---- theme toggle ----
  (function () {
    const t = $("[data-theme-toggle]"), r = document.documentElement;
    let d = matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light";
    r.setAttribute("data-theme", d);
    t.addEventListener("click", () => {
      d = d === "dark" ? "light" : "dark";
      r.setAttribute("data-theme", d);
      t.setAttribute("aria-label", "Switch to " + (d === "dark" ? "light" : "dark") + " mode");
      t.innerHTML = d === "dark"
        ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'
        : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>';
      [stageChart, contribChart].forEach((c) => { if (c) { applyChartTheme(c); c.update(); } });
    });
  })();

  function cssVar(name) { return getComputedStyle(document.documentElement).getPropertyValue(name).trim(); }

  // ---- number formatting ----
  function fmt(v) {
    if (v === 0) return "0";
    const a = Math.abs(v);
    if (a !== 0 && (a < 1e-3 || a >= 1e6)) return v.toExponential(3);
    if (a >= 100) return v.toFixed(1);
    if (a >= 1) return v.toFixed(3);
    return v.toPrecision(3);
  }
  function fmt2(v) { return v >= 100 ? v.toFixed(0) : v.toFixed(2); }

  /* ==========================================================
     SECTION 1 — HERO VERDICT
     ========================================================== */
  $("#heroHead").textContent = B.headline;
  $("#heroQuestion").textContent = B.question;
  $("#heroAnswer").textContent = B.answer;
  const climMa = D.categories.find((c) => c.key === "climate").golden.indoor;
  const climKe = D.categories.find((c) => c.key === "climate").golden.openfield;
  $("#vMa").textContent = climMa.toFixed(1);
  $("#vKe").textContent = climKe.toFixed(1);
  $("#vDelta").textContent = Math.round((1 - climMa / climKe) * 100) + "%";

  /* ==========================================================
     SECTION 2 — FUNCTIONAL UNIT + LOSS CASCADE
     ========================================================== */
  $("#fuPlain").textContent = B.fu_plain;
  (function () {
    const wrap = $("#fuCascade");
    const maxKg = Math.max(...B.loss_cascade.map((s) => s.kg));
    B.loss_cascade.forEach((s, i) => {
      const row = document.createElement("div");
      row.className = "cascade-row" + (i === B.loss_cascade.length - 1 ? " final" : "");
      row.innerHTML =
        `<div class="cascade-top">
           <span class="cascade-step">${s.step}</span>
           <span class="cascade-kg">${s.kg.toFixed(3)} kg</span>
         </div>
         <div class="cascade-bar"><span style="width:${(s.kg / maxKg * 100).toFixed(1)}%"></span></div>
         <span class="cascade-note">${s.note}</span>`;
      wrap.appendChild(row);
    });
  })();

  /* ==========================================================
     SECTION 3 — THE LIFE-CYCLE JOURNEY (8 stages)
     ========================================================== */
  let jArch = "indoor";
  let stageChart = null;
  const STAGE_COLORS = ["--color-primary", "--color-primary", "--color-cf", "--color-warn",
    "--color-q", "--color-cf", "--color-q", "--color-primary"];

  function stageData(a) { return D.stages.map((s) => D.stage_climate[a][s.key]); }
  function stageTotal(a) { return stageData(a).reduce((x, y) => x + y, 0); }

  function renderStageList() {
    const list = $("#stageList");
    list.innerHTML = "";
    const total = stageTotal(jArch);
    D.stages.forEach((s, i) => {
      const v = D.stage_climate[jArch][s.key];
      const pct = (v / total * 100);
      const hot = pct >= 15;
      const li = document.createElement("li");
      li.className = "stage-item" + (hot ? " hot" : "");
      li.style.setProperty("--stage-c", cssVar(STAGE_COLORS[i]));
      li.innerHTML =
        `<span class="stage-idx">${i + 1}</span>
         <div class="stage-body">
           <div class="stage-line">
             <span class="stage-name">${s.label}${hot ? ' <span class="hot-tag">hotspot</span>' : ''}</span>
             <span class="stage-val">${fmt2(v)} <small>kg CO₂e</small> · ${pct.toFixed(0)}%</span>
           </div>
           <p class="stage-desc">${s.desc}</p>
         </div>`;
      list.appendChild(li);
    });
  }

  function renderStageChart() {
    const labels = D.stages.map((s) => s.label);
    const vals = stageData(jArch);
    const colors = D.stages.map((s, i) => cssVar(STAGE_COLORS[i]));
    const total = stageTotal(jArch);
    if (stageChart) stageChart.destroy();
    stageChart = new Chart($("#stageChart"), {
      type: "bar",
      data: { labels, datasets: [{ data: vals, backgroundColor: colors, borderRadius: 6, borderSkipped: false, maxBarThickness: 40 }] },
      options: {
        indexAxis: "y", responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => ` ${fmt2(c.parsed.x)} kg CO₂e · ${(c.parsed.x / total * 100).toFixed(1)}%` } }
        },
        scales: {
          x: { grid: { color: cssVar("--color-divider") }, ticks: { color: cssVar("--color-text-muted"), font: { family: "JetBrains Mono", size: 11 } }, title: { display: true, text: "kg CO₂e per kg basil eaten", color: cssVar("--color-text-muted"), font: { family: "General Sans", size: 11 } } },
          y: { grid: { display: false }, ticks: { color: cssVar("--color-text"), font: { family: "General Sans", size: 12 } } }
        }
      }
    });
    $("#stageCap").innerHTML = `Total carbon footprint: <strong>${stageTotal(jArch).toFixed(1)} kg CO₂e</strong> per kg basil eaten · ${jArch === "indoor" ? "Morocco solar indoor" : "Kenya air-freighted"}`;
  }

  function setJourney(a) {
    jArch = a;
    $$(".archbar:not(.second) .arch-tab").forEach((t) => {
      const on = t.dataset.arch === a;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    $("#archDesc").textContent = D.archetypes[a].desc;
    renderStageChart();
    renderStageList();
  }

  /* ==========================================================
     SECTION 4 — DECISION LEVERS
     ========================================================== */
  (function () {
    const grid = $("#leversGrid");
    B.decision_levers.forEach((l) => {
      const card = document.createElement("article");
      card.className = "lever";
      card.innerHTML = `<h3>${l.title}</h3><p>${l.body}</p>`;
      grid.appendChild(card);
    });
  })();

  /* ==========================================================
     SECTION 5 — PLAIN-LANGUAGE 16-MEASURE COMPARISON
     ========================================================== */
  const PLAIN = {
    climate: "Greenhouse gases warming the planet",
    fossils: "Coal, oil and gas burned up",
    water: "Scarcity-weighted freshwater consumed",
    land: "Land tied up and degraded",
    acid: "Acid rain potential",
    eutroM: "Nutrient run-off harming seas",
    eutroF: "Nutrient run-off harming rivers/lakes",
    eutroT: "Nutrient run-off harming soils",
    ecotox: "Toxic load on freshwater life",
    pm: "Fine-dust air pollution (health)",
    ozone: "Damage to the ozone layer",
    photo: "Smog-forming emissions",
    ion: "Ionising radiation released",
    htc: "Cancer-risk substances to people",
    htnc: "Other toxic substances to people",
    minmet: "Scarce metals & minerals used up",
  };
  (function () {
    const tb = $("#compareTable tbody");
    D.categories.forEach((c) => {
      const ma = c.golden.indoor, ke = c.golden.openfield;
      const maWin = ma <= ke;
      const tr = document.createElement("tr");
      tr.innerHTML =
        `<td class="strong">${c.label}</td>
         <td class="muted">${PLAIN[c.key] || ""}</td>
         <td class="num${maWin ? " win" : ""}">${fmt(ma)}</td>
         <td class="num${!maWin ? " win" : ""}">${fmt(ke)}</td>
         <td class="muted unit">${c.unit}</td>
         <td>${maWin ? '<span class="win-pill ma">Morocco</span>' : '<span class="win-pill ke">Kenya</span>'}</td>`;
      tb.appendChild(tr);
    });
    const ssMa = D.single_score.indoor, ssKe = D.single_score.openfield;
    $("#ssMa").textContent = ssMa.toExponential(2);
    $("#ssKe").textContent = ssKe.toExponential(2);
    const ssWin = ssMa <= ssKe;
    $("#ssWin").innerHTML = ssWin ? '<span class="win-pill ma">Morocco</span>' : '<span class="win-pill ke">Kenya</span>';
    $("#ssMa").classList.toggle("win", ssWin);
    $("#ssKe").classList.toggle("win", !ssWin);
  })();

  /* ==========================================================
     SECTION 6 — THE LIVE ENGINE (SOLARA LCA engine: Impact = Σ Q × CF)
     ========================================================== */
  let arch = "indoor";
  let Q = {};
  let edited = false;
  let selectedCat = D.categories[0].key;
  let contribChart = null;

  function compute() {
    const out = { total: {}, byFlow: {} };
    D.categories.forEach((c) => {
      let total = 0; const per = {};
      D.flows.forEach((f) => {
        const q = Q[f.id] || 0;
        const cf = (D.cf[arch][c.key] && D.cf[arch][c.key][f.id]) || 0;
        const v = q * cf; per[f.id] = v; total += v;
      });
      out.total[c.key] = total; out.byFlow[c.key] = per;
    });
    return out;
  }

  function loadQ() { Q = {}; D.flows.forEach((f) => { Q[f.id] = f.q[arch]; }); edited = false; }

  function renderBOM() {
    const list = $("#bomList"); list.innerHTML = ""; let lastGroup = null;
    D.flows.forEach((f) => {
      if (f.group !== lastGroup) {
        const g = document.createElement("div"); g.className = "bom-group-label"; g.textContent = f.group;
        list.appendChild(g); lastGroup = f.group;
      }
      const row = document.createElement("div");
      row.className = "bom-row" + ((Q[f.id] || 0) === 0 ? " zero" : "");
      row.innerHTML = `<div><span class="bom-name">${f.label}</span><span class="bom-unit">${f.unit}</span></div>`;
      const wrap = document.createElement("div"); wrap.className = "bom-input-wrap";
      const inp = document.createElement("input");
      inp.type = "number"; inp.className = "bom-input"; inp.step = "any"; inp.min = "0"; inp.value = Q[f.id];
      inp.setAttribute("aria-label", f.label + " quantity in " + f.unit);
      inp.addEventListener("input", () => {
        let val = parseFloat(inp.value); if (isNaN(val) || val < 0) val = 0;
        Q[f.id] = val;
        inp.classList.toggle("edited", val !== f.q[arch]);
        row.classList.toggle("zero", val === 0);
        edited = true; $("#recomputeFlag").hidden = false; renderResults();
      });
      wrap.appendChild(inp); row.appendChild(wrap); list.appendChild(row);
    });
  }

  const KPI_KEYS = ["climate", "water", "fossils", "land"];
  const KPI_COLORS = { climate: "--color-primary", water: "--color-cf", fossils: "--color-q", land: "--color-warn" };

  function renderResults() {
    const res = compute();
    const kpiWrap = $("#kpis"); kpiWrap.innerHTML = "";
    KPI_KEYS.forEach((k) => {
      const c = D.categories.find((x) => x.key === k);
      const card = document.createElement("div"); card.className = "kpi";
      card.style.setProperty("--kpi-c", cssVar(KPI_COLORS[k]));
      card.innerHTML = `<div class="kpi-label">${c.label}</div>
        <div class="kpi-val">${fmt(res.total[k])}<span class="kpi-unit">${c.unit}</span></div>`;
      kpiWrap.appendChild(card);
    });

    const tb = $("#resultsTable tbody"); tb.innerHTML = ""; let allMatch = true;
    D.categories.forEach((c) => {
      const eng = res.total[c.key], gold = c.golden[arch];
      const rel = gold !== 0 ? Math.abs(eng - gold) / Math.abs(gold) : (eng === 0 ? 0 : 1);
      const match = rel < 1e-4; if (!match) allMatch = false;
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${c.label}</td><td class="muted">${c.unit}</td>
        <td class="num">${fmt(eng)}</td><td class="num muted">${fmt(gold)}</td>
        <td class="match">${match ? '<span class="ok" title="reproduces study value">✓</span>' : '<span class="no" title="diverged ' + (rel * 100).toFixed(1) + '%">Δ</span>'}</td>`;
      tb.appendChild(tr);
    });

    const ssGold = D.single_score[arch];
    const climGold = D.categories.find((x) => x.key === "climate").golden[arch];
    const climEng = res.total["climate"];
    const ssEng = edited && climGold ? ssGold * (climEng / climGold) : ssGold;
    $("#ssEngine").textContent = ssEng.toExponential(3);
    $("#ssGolden").textContent = ssGold.toExponential(3);
    $("#ssMatch").innerHTML = (!edited) ? '<span class="ok">✓</span>' : '<span class="no" title="single score is proxy-scaled when quantities edited">~</span>';

    const pill = $("#validatePill");
    if (!edited && allMatch) { pill.className = "validate-pill ok"; pill.innerHTML = "✓ Reproduces the study exactly"; }
    else if (edited) { pill.className = "validate-pill off"; pill.innerHTML = "● Custom quantities — recomputed live"; }
    else { pill.className = "validate-pill off"; pill.innerHTML = "Δ Divergence detected"; }

    renderContrib(res);
  }

  function renderContrib(res) {
    const cat = D.categories.find((x) => x.key === selectedCat);
    const per = res.byFlow[selectedCat];
    const items = D.flows.map((f) => ({ label: f.label, group: f.group, v: per[f.id] || 0 }))
      .filter((x) => x.v > 0).sort((a, b) => b.v - a.v);
    const labels = items.map((x) => x.label), vals = items.map((x) => x.v);
    const groupColor = { Energy: cssVar("--color-primary"), Water: cssVar("--color-cf"), Inputs: cssVar("--color-q") };
    const colors = items.map((x) => groupColor[x.group] || cssVar("--color-primary"));
    const total = vals.reduce((a, b) => a + b, 0);
    if (contribChart) contribChart.destroy();
    contribChart = new Chart($("#contribChart"), {
      type: "bar",
      data: { labels, datasets: [{ data: vals, backgroundColor: colors, borderRadius: 6, borderSkipped: false, maxBarThickness: 34 }] },
      options: {
        indexAxis: "y", responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: (c) => {
          const pct = total > 0 ? (c.parsed.x / total * 100).toFixed(1) : "0";
          return ` ${fmt(c.parsed.x)} ${cat.unit}  ·  ${pct}%`; } } } },
        scales: {
          x: { grid: { color: cssVar("--color-divider") }, ticks: { color: cssVar("--color-text-muted"), font: { family: "JetBrains Mono", size: 11 }, callback: (v) => fmt(v) } },
          y: { grid: { display: false }, ticks: { color: cssVar("--color-text"), font: { family: "General Sans", size: 12 } } }
        }
      }
    });
    $("#contribCap").textContent = `Σ over ${items.length} inputs = ${fmt(total)} ${cat.unit} · each bar is one input's quantity × its factor`;
  }

  function applyChartTheme(c) {
    if (!c) return;
    c.options.scales.x.grid.color = cssVar("--color-divider");
    c.options.scales.x.ticks.color = cssVar("--color-text-muted");
    c.options.scales.y.ticks.color = cssVar("--color-text");
    if (c.options.scales.x.title) c.options.scales.x.title.color = cssVar("--color-text-muted");
  }

  function setEngineArch(a) {
    arch = a;
    $$(".arch-tab2").forEach((t) => {
      const on = t.dataset.arch2 === a;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    const meta = D.archetypes[a];
    $("#fuLabel").textContent = meta.fu;
    $("#methodNote").innerHTML = `Method: <strong>${D.method}</strong> · per ${meta.fu}`;
    $("#recomputeFlag").hidden = true;
    loadQ(); renderBOM(); renderResults();
  }

  function buildCatSelect() {
    const sel = $("#catSelect");
    D.categories.forEach((c) => { const o = document.createElement("option"); o.value = c.key; o.textContent = c.label; sel.appendChild(o); });
    sel.value = selectedCat;
    sel.addEventListener("change", () => { selectedCat = sel.value; renderResults(); });
  }

  /* ==========================================================
     INIT
     ========================================================== */
  // journey
  $$(".archbar:not(.second) .arch-tab").forEach((t) => t.addEventListener("click", () => setJourney(t.dataset.arch)));
  setJourney("indoor");
  // engine
  buildCatSelect();
  $$(".arch-tab2").forEach((t) => t.addEventListener("click", () => setEngineArch(t.dataset.arch2)));
  $("#resetBtn").addEventListener("click", () => setEngineArch(arch));
  setEngineArch("indoor");
})();
