/* Made · kasvooruitzicht — renders data/feeds/made-<site>.json per building (6 Sep, ADR 0006).
   Per block: heat-alert banner + day chips (the forecast snapshot forecast.py writes at issue time),
   three stats (the hindcast on observed weather, the spread between the two afdelingen as the floor,
   the day-ahead forecast split), the shared record timeline (assets/js/timeline.js, Dutch labels,
   default 7 days hourly plus the forecast) and the scored table (newest 14 days, weather share and
   model share beside the total). Dutch by the page's decision (13 Aug). Actor-less: temperatures only. */
(function () {
  var TEAL = "#21808D", AMBER = "#C8821C", SHORT = "#A33A2C";
  var NL = {
    model: "model, etmaalgemiddelde (gemeten weer)", outside: "buiten, etmaalgemiddelde", issue: "verwachting, etmaalgemiddelde (verwacht weer)",
    measured: "gemeten", lead1: "dagvooruitzicht, gescoord",
    modelH: "model, per uur (gemeten weer)", outsideH: "buiten, per uur", issueH: "verwachting, per uur (verwacht weer)",
    issueOutH: "buiten verwacht, per uur", measuredH: "gemeten, per uur", lead1H: "dagvooruitzicht, etmaalgemiddelde, gescoord",
    hModel: "model", hOutside: "buiten", hMeasured: "gemeten", hForecast: "verwachting", hForecastOut: "buiten verwacht", hLead1: "dagvooruitzicht",
    seam: "laatste waarnemingsdag", all: "alles", d: "d"
  };
  var DEFAULT_DAYS = 7, HOURLY_BELOW_DAYS = 14, TABLE_DAYS = 14;
  function el(id) { return document.getElementById(id); }
  function nl(n, d) { if (n === null || n === undefined || Number.isNaN(n)) return "—"; return Number(n).toLocaleString("nl-NL", { minimumFractionDigits: d, maximumFractionDigits: d }); }
  function sgn(n, d) { if (n === null || n === undefined) return "—"; return (n > 0 ? "+" : "") + nl(n, d); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }
  function nlDate(iso) { var m = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"]; return parseInt(iso.slice(8, 10), 10) + " " + m[parseInt(iso.slice(5, 7), 10) - 1]; }
  function afds(f) { return (f.afdelingen || []).join(" en "); }

  function banner(f) {
    var lvl = (f.alert && f.alert.level) || "none";
    var col = { none: TEAL, warning: AMBER, critical: SHORT }[lvl];
    var label = { none: "geen alarm", warning: "WAARSCHUWING", critical: "KRITIEK" }[lvl];
    return '<div class="alert-banner" style="border-left-color:' + col + ';background:' + col + '14"><strong style="color:' + col + '">hittealarm: ' + label + "</strong>" +
      ((f.alert && f.alert.reasons && f.alert.reasons.length) ? '<div class="alert-reasons">' + f.alert.reasons.map(esc).join(" · ") + "</div>" : "") +
      '<div class="muted alert-meta">uitgifte ' + esc(f.updated_iso.slice(0, 16).replace("T", " ")) + " UTC · ±1,5 °C op etmaalgemiddelden · model " + esc(f.frozen_model || "") + "</div></div>";
  }

  function chips(f) {
    return (f.days || []).map(function (d) {
      return '<span class="tag-pill chip">' + nlDate(d.date) + " · gem " + nl(d.mean, 1) + " · max " + nl(d.max, 1) + " °C</span>";
    }).join("");
  }

  function stats(f) {
    var s = f.score || {}, a = s.all, fc = f.forecast_score, sp = f.spread;
    var one = '<div class="hero-stat"><div class="hero-num">' + (a ? nl(a.mean_mae, 2) + " °C" : "—") + '</div><div class="hero-label">model op gemeten weer: gemiddelde afwijking van het etmaalgemiddelde over ' + (a ? a.days : 0) + " dagen" +
      (s.train && s.after ? " · trainingsdata " + nl(s.train.mean_mae, 2) + " · daarna " + nl(s.after.mean_mae, 2) : "") +
      (a ? " · piek " + nl(a.max_mae, 2) + " °C, bias " + sgn(a.max_bias, 2) : "") + "</div></div>";
    var two = '<div class="hero-stat"><div class="hero-num">' + (sp ? nl(sp.value, 2) + " °C" : "—") + '</div><div class="hero-label">gemeten verschil tussen afdeling ' + (sp ? sp.afdelingen.join(" en ") : afds(f)) + ", zelfde dagen — de ondergrens voor één model per gebouw</div></div>";
    var three = fc
      ? '<div class="hero-stat"><div class="hero-num">' + nl(fc.total_mae, 2) + ' °C</div><div class="hero-label">dagvooruitzicht: afwijking van het etmaalgemiddelde over ' + fc.days + " gescoorde dagen, bias " + sgn(fc.total_bias, 2) + " · waarvan weer " + nl(fc.weather_mae, 2) + " · model " + nl(fc.model_mae, 2) + "</div></div>"
      : '<div class="hero-stat"><div class="hero-num">' + (f.scored || []).length + " van " + (f.headline_min_days || 7) + '</div><div class="hero-label">gescoorde dagen — het dagvooruitzicht krijgt een cijfer vanaf ' + (f.headline_min_days || 7) + " dagen</div></div>";
    return '<div class="hero-stats stats-block">' + one + two + three + "</div>";
  }

  function table(f) {
    var rows = (f.scored || []).slice(-TABLE_DAYS).reverse();
    if (!rows.length) return '<p class="muted small">Nog geen gescoorde dagen — scoren gebeurt zodra de gemeten kastemperatuur binnenkomt.</p>';
    var cell = function (v, d, bad) { return '<td class="num' + (bad ? " bad" : "") + '">' + (v === null || v === undefined ? "—" : (d < 0 ? sgn(v, -d) : nl(v, d))) + "</td>"; };
    var body = rows.map(function (r) {
      return "<tr><td>" + r.date + "</td>" + cell(r.pred_mean, 1) + cell(r.meas_mean, 1) + cell(r.total_mean, -1, Math.abs(r.total_mean) > 1.5) +
        cell(r.weather_mean, -1, Math.abs(r.weather_mean || 0) > 1.5) + cell(r.model_mean, -1, Math.abs(r.model_mean || 0) > 1.5) +
        cell(r.pred_max, 1) + cell(r.meas_max, 1) + cell(r.total_max, -1, Math.abs(r.total_max) > 1.5) +
        '<td class="muted small">' + esc(r.issued) + " (−" + r.lead_days + "d) · " + esc(r.frozen_model || "") + "</td></tr>";
    }).join("");
    return '<div class="table-scroll"><table class="data"><thead><tr><th>datum</th><th class="num">voorspeld gem</th><th class="num">gemeten gem</th><th class="num">Δ</th><th class="num">waarvan weer</th><th class="num">waarvan model</th>' +
      '<th class="num">voorspeld max</th><th class="num">gemeten max</th><th class="num">Δ</th><th>uitgifte · model</th></tr></thead><tbody>' + body + "</tbody></table></div>" +
      '<p class="muted small">gemeten = kwartiergemiddelde over afdeling ' + afds(f) + ", alleen volledig gedekte dagen; voorspeld = de laatste uitgifte vóór die dag (uitgiften worden nooit gemengd); Δ = voorspeld − gemeten = weer + model, het modelaandeel tegen het model op het gemeten weer (ADR 0006). Nieuwste " + TABLE_DAYS + " dagen.</p>";
  }

  function block(site, url) {
    fetch(url, { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (f) {
      el(site + "-banner").innerHTML = banner(f);
      el(site + "-stats").innerHTML = stats(f);
      el(site + "-days").innerHTML = chips(f);
      el(site + "-table").innerHTML = table(f);
      var marks = f.split_date ? [{ x: f.split_date, text: "trainingsdata tot hier" }] : [];
      if (window.Plotly && f.hindcast) {
        SOLARA_TIMELINE.mount(site + "-chart", f, { labels: NL, defaultDays: DEFAULT_DAYS, hourlyBelowDays: HOURLY_BELOW_DAYS, marks: marks, measuredSuffix: "afdeling " + afds(f) });
      } else {
        el(site + "-chart").innerHTML = '<p class="muted small">Nog geen record voor dit gebouw — de tijdlijn verschijnt na de eerste ochtendrun.</p>';
      }
      var foot = el("footnote-data");
      if (foot && f.record_written_iso) foot.textContent = "record geschreven " + f.record_written_iso.slice(0, 16).replace("T", " ") + " UTC · KNMI-station " + f.knmi_station + " (Gilze-Rijen) · verwachting: Open-Meteo knmi_seamless op de locatie";
    }).catch(function () {
      el(site + "-banner").innerHTML = '<p class="muted">Feed niet bereikbaar (' + esc(url) + ").</p>";
    });
  }

  block("afd13-23", "../data/feeds/made-afd13-23.json");
  block("afd33-36", "../data/feeds/made-afd33-36.json");
})();
