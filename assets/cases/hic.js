/* Skyberries (strawberry greenhouse) workspace — shell (v2).
   Purpose: host the conversation about connecting their Let's Grow system.
   When the connection lands (v3): fill the data slots below, add
   data/feeds/hic.json, and extend the modules list in registry.js —
   no page rework needed. */
window.SOLARA_CASE = {
  org: {
    id: "hic",
    label: "Skyberries",
    tagline: "Strawberry greenhouse — Let's Grow connection in discussion",
  },
  sites: [
    {
      id: "hic-main",
      label: "Skyberries greenhouse",
      location: "Netherlands",
      type: "greenhouse", journey: "existing", status: "connecting",
      meta: [
        ["Crop", "strawberry"],
        ["Data platform", "Let's Grow (LetsGrow.com)"],
        ["Stage", "connection scoping"],
      ],
      lifecycle: [
        { label: "Calibrate", state: "active", note: "Ready to start from the first Let's Grow export" },
        { label: "Plan", state: "pending", note: "Needs the calibrated ledger" },
        { label: "Operate", state: "pending", note: "Activates with the live feed" },
      ],
    },
  ],
  /* Let's Grow → SOLARA feed-schema mapping: the discussion artifact.
     Each stream exists in Let's Grow today; connecting = one export/API job
     writing data/feeds/hic.json in the SOLARA feed schema. */
  data_slots: [
    { stream: "Climate series (T, RH, CO₂, PAR, screen, vents)", source: "Let's Grow · climate computer link",
      status: "connecting", status_label: "in Let's Grow · pending connection",
      note: "Maps to feed.series (5-min resolution) — drives twin calibration" },
    { stream: "Substrate / irrigation sensors (WC, EC, drain)", source: "Let's Grow · sensor modules",
      status: "connecting", status_label: "in Let's Grow · pending connection",
      note: "Maps to feed.metrics water block" },
    { stream: "Yield & harvest registration", source: "Let's Grow · crop registration",
      status: "connecting", status_label: "in Let's Grow · pending connection",
      note: "Maps to feed.metrics yield block — the plan-vs-actual denominator" },
    { stream: "Energy: electricity, gas, CHP", source: "meters / Let's Grow energy module",
      status: "connecting", status_label: "source to confirm",
      note: "Maps to feed.metrics energy block — calibrates cost & footprint" },
    { stream: "Outdoor weather station", source: "Let's Grow · weather link",
      status: "connecting", status_label: "in Let's Grow · pending connection",
      note: "Baseline for the energy model's boundary conditions" },
  ],
};
