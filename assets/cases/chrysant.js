/* Chrysanthemum workspace — hand-maintained case data (ANONYMIZED:
   no grower, site, or cultivar names anywhere in this file or on the pages).
   Model results live in chrysant.data.js (generated — rebuild with
   SOLARA-Plan-Prototype/build_site.py). */
window.SOLARA_CASE = {
  org: {
    id: "chrysant",
    label: "Chrysanthemum",
    tagline: "Dutch chrysanthemum production — one species, many colors, 5 locations, 32+ ha",
    anonymized: true,
  },
  sites: [
    {
      id: "location-m",
      label: "Location M",
      location: "Netherlands",
      type: "greenhouse", journey: "existing", status: "validated",
      meta: [
        ["Area", "42 kappen × 780 m² ≈ 3.3 ha"],
        ["Crop", "white filled chrysanthemum (Russia market)"],
        ["Cycle", "67–75 days by season · year-round lighted"],
        ["Output", "≈ 8 M stems / yr"],
      ],
      lifecycle: [
        { label: "Calibrate", state: "done", note: "Cultivation parameters from the baseline model" },
        { label: "Plan", state: "active", note: "Weekly MILP validated against the baseline plan" },
        { label: "Operate", state: "pending", note: "Plan-vs-actual illustrated; awaits registration data" },
      ],
      links: [
        { label: "Calibrate →", href: "chrysant/calibrate/index.html" },
        { label: "Plan →", href: "chrysant/plan/index.html" },
      ],
    },
    {
      id: "location-a",
      label: "Location A",
      location: "Netherlands",
      type: "greenhouse", journey: "existing", status: "pending",
      meta: [["Area", "≈ 9.6 ha"], ["Colors", "yellow · santini"], ["Data", "awaiting ledger intake"]],
      lifecycle: [
        { label: "Calibrate", state: "pending" }, { label: "Plan", state: "pending" }, { label: "Operate", state: "pending" },
      ],
    },
    {
      id: "location-b",
      label: "Location B",
      location: "Netherlands",
      type: "greenhouse", journey: "existing", status: "pending",
      meta: [["Area", "≈ 8.2 ha"], ["Colors", "pink · purple"], ["Data", "awaiting ledger intake"]],
      lifecycle: [
        { label: "Calibrate", state: "pending" }, { label: "Plan", state: "pending" }, { label: "Operate", state: "pending" },
      ],
    },
    {
      id: "location-c",
      label: "Location C",
      location: "Netherlands",
      type: "greenhouse", journey: "existing", status: "pending",
      meta: [["Area", "≈ 6.8 ha"], ["Colors", "white · bicolor"], ["Data", "awaiting ledger intake"]],
      lifecycle: [
        { label: "Calibrate", state: "pending" }, { label: "Plan", state: "pending" }, { label: "Operate", state: "pending" },
      ],
    },
    {
      id: "location-d",
      label: "Location D",
      location: "Netherlands",
      type: "greenhouse", journey: "existing", status: "pending",
      meta: [["Area", "≈ 4.6 ha"], ["Colors", "spray mix"], ["Data", "awaiting ledger intake"]],
      lifecycle: [
        { label: "Calibrate", state: "pending" }, { label: "Plan", state: "pending" }, { label: "Operate", state: "pending" },
      ],
    },
  ],
  /* Streams confirmed to exist (2026-07-13) but not ingested yet.
     Rendered on the Calibrate page. */
  data_slots: [
    { stream: "Realized weekly prices per color", source: "Floriday / clock export",
      status: "pending", status_label: "available · pending intake",
      note: "3–5 years of transaction history; replaces the estimate curve" },
    { stream: "Registered cycle durations per kap", source: "cultivation registration",
      status: "pending", status_label: "available · pending intake",
      note: "Replaces the fixed 67–75 day seasonal table with measured durations" },
    { stream: "Labor hours per activity", source: "labor registration",
      status: "pending", status_label: "available · pending intake",
      note: "Plant / harvest / processing hours — needed for multi-color planning" },
    { stream: "Costs per kap per season", source: "internal cost sheet",
      status: "pending", status_label: "to be compiled",
      note: "Stek, labor, energy, CO₂, crop protection — turns omzet into winst" },
    { stream: "Energy: lighting hours & gas/CHP tariffs", source: "climate computer + meters",
      status: "pending", status_label: "available · pending intake",
      note: "Smarter growing saves 2–8%; smarter buying is the bigger lever" },
    { stream: "Stek delivery schedule", source: "propagator contracts",
      status: "pending", status_label: "known constraint",
      note: "10-week rolling lead time; variety switch ≈ 16 weeks — bounds re-planning" },
  ],
  /* Operate benchmark block — the client's multi-site benchmarking wish.
     Location M values from the validated model + plan; other sites fill in
     as their data arrives (edit this file only). */
  benchmark: {
    metrics: [
      { key: "stems", label: "Production", unit: "stems / m² / yr" },
      { key: "cycle", label: "Cycle duration", unit: "days vs standard" },
      { key: "price", label: "Realized price vs plan", unit: "€ / stem" },
      { key: "energy", label: "Electricity (lighting)", unit: "kWh / m² / yr" },
    ],
    rows: {
      "location-m": { stems: "250", cycle: "67–75 (standard)", price: "0.63 plan · realized pending", energy: "pending" },
    },
  },
};
