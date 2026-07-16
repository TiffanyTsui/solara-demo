/* Six-crop study workspace — hand-maintained case data.
   A published cultivation-planning dataset (source cited in the page
   footnotes): 10,000 m² glasshouse, six cut-flower crops, thirteen 4-week
   periods. Model results live in flora.data.js (generated — rebuild with
   SOLARA-Plan-Prototype/build_site.py). */
window.SOLARA_CASE = {
  org: {
    id: "flora",
    label: "Six-crop study",
    tagline: "Cut-flower cultivation planning on a published dataset",
  },
  sites: [
    {
      id: "study",
      label: "Study glasshouse",
      location: "Netherlands · published dataset",
      type: "greenhouse", journey: "study", status: "validated",
      meta: [
        ["Area", "10,000 m² · 13 four-week periods"],
        ["Crops", "tulips · freesia · celosia · lilium · lysianthus · panicum"],
        ["Labor", "7 FTE · 67,200 min / period"],
        ["Scenarios", "base plan + 5 published experiments"],
      ],
      lifecycle: [
        { label: "Calibrate", state: "done", note: "Ledger from the published dataset" },
        { label: "Plan", state: "active", note: "LP reproduces the published results" },
        { label: "Operate", state: "na", note: "Study case — no live facility" },
      ],
      links: [
        { label: "Plan →", href: "flora/plan/index.html" },
      ],
    },
  ],
};
