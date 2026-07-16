/* Farm32 workspace — hand-maintained case data.
   Edit numbers/sites/slots here; model results live in farm32.data.js
   (generated — rebuild with SOLARA-Plan-Prototype/build_site.py). */
window.SOLARA_CASE = {
  org: {
    id: "farm32",
    label: "Farm32",
    tagline: "Multi-site CEA operator — one design ledger from Agadir to Sardinia",
  },
  sites: [
    {
      id: "agadir",
      label: "Agadir–Massira",
      location: "Morocco",
      type: "indoor", journey: "new build", status: "design",
      meta: [
        ["Area", "650 m² · two zones"],
        ["Crop", "basil"],
        ["Energy", "480 kWp PV + 600 kWh battery"],
        ["Stage", "feasibility validated · pre-construction"],
      ],
      lifecycle: [
        { label: "Design", state: "done", note: "Site, energy, solar, impact modules complete" },
        { label: "Plan", state: "active", note: "Weekly basil MILP live on design coefficients" },
        { label: "Operate", state: "pending", note: "Activates at commissioning" },
      ],
      links: [
        { label: "Design →", href: "farm32/design/index.html" },
        { label: "Plan →", href: "farm32/plan/index.html" },
      ],
    },
    {
      id: "sardinia",
      label: "Sardinia",
      location: "Italy",
      type: "protected cropping", journey: "existing", status: "live",
      meta: [
        ["Area", "1,200 m²"],
        ["Crop", "basil & leafy herbs"],
        ["Sensors", "climate + energy meters on site"],
        ["Stage", "twin calibrated · feed live-ready"],
      ],
      lifecycle: [
        { label: "Calibrate", state: "done", note: "Geometry + meter baseline captured" },
        { label: "Plan", state: "active", note: "Interactive weekly planner on the calibrated ledger" },
        { label: "Operate", state: "active", note: "Static snapshot now; sensor feed can start" },
      ],
      links: [
        { label: "Calibrate →", href: "farm32/calibrate/index.html" },
        { label: "Plan →", href: "farm32/plan/sardinia.html" },
        { label: "Operate →", href: "farm32/operate/index.html" },
      ],
    },
  ],
  /* Operate benchmark block. Values are demo data; "pending" renders a pill.
     Agadir gets design targets until commissioning. */
  benchmark: {
    metrics: [
      { key: "yield", label: "Yield", unit: "kg / m² / yr" },
      { key: "energy", label: "Electricity", unit: "kWh / kg" },
      { key: "water", label: "Water", unit: "L / kg" },
      { key: "footprint", label: "Footprint", unit: "kg CO₂e / kg" },
    ],
    rows: {
      agadir: { yield: "23.4 (design)", energy: "9.1 (design)", water: "6.5 (design)", footprint: "1.9 (design)" },
      sardinia: { yield: "11.8", energy: "3.2", water: "9.4", footprint: "1.1" },
    },
  },
};
