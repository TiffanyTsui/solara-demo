/* SOLARA workspace registry — hand-maintained.
   Adding a workspace: add an entry here + assets/cases/<id>.js (+ optional
   <id>.data.js from the prototype's build_site.py) + a <id>/ page folder.
   nav.js builds the topbar and the workspace switcher from this list.
   Access codes: salted sha256 via _build/hash_code.py — codes NOT in repo. */
window.SOLARA_REGISTRY = [
  {
    id: "farm32",
    label: "Farm32",
    sub: "Two sites · Morocco + Sardinia",
    status: "active",
    lock: { hash: "4d3932430c0cb23cceb7b8a1436cdb1fc83a4143cc0717e08eb116f2596592bb" },
    modules: [
      { id: "overview",  label: "Overview",  path: "index.html" },
      { id: "design",    label: "Design",    path: "design/index.html" },
      { id: "calibrate", label: "Calibrate", path: "calibrate/index.html" },
      { id: "plan",      label: "Plan",      path: "plan/index.html" },
      { id: "operate",   label: "Operate",   path: "operate/index.html" },
    ],
  },
  {
    id: "chrysant",
    label: "Chrysanthemum",
    sub: "Greenhouse · existing · 5 locations",
    status: "active",
    lock: { hash: "5e17465bca968be72327e3bba5b47fb2267081967d62999ad72f8024b2dbd3aa" },
    modules: [
      { id: "overview",  label: "Overview",  path: "index.html" },
      { id: "calibrate", label: "Calibrate", path: "calibrate/index.html" },
      { id: "plan",      label: "Plan",      path: "plan/index.html" },
      { id: "operate",   label: "Operate",   path: "operate/index.html" },
    ],
  },
  {
    id: "made",
    label: "Made",
    sub: "Kasvooruitzicht · 2 gebouwen",
    status: "active",
    lock: { hash: "e7ea6b96427bbd3dfed5ac0a089c6fb047abaf1f6c0b4d136da4d1f4f31e08a7" },
    modules: [
      { id: "overview", label: "Vooruitzicht", path: "index.html" },
    ],
  },
  {
    id: "hic",
    label: "Skyberries",
    sub: "Strawberry greenhouse · connecting",
    status: "connecting",
    lock: { hash: "7b28a46c7d94e5c241f12513d8cc80f6b8e6b4de91df621c8ea105bcf1b02ba1" },
    modules: [
      { id: "overview", label: "Overview", path: "index.html" },
    ],
  },
  {
    id: "flora",
    label: "Crop mix study",
    sub: "Greenhouse · cut flowers · published dataset",
    status: "active",
    lock: { hash: "a3d961490efce4e8740242c1d11b75969f6482df278f0e86a3234cde5aa550c2" },
    modules: [
      { id: "overview", label: "Overview", path: "index.html" },
      { id: "plan",     label: "Plan",     path: "plan/index.html" },
    ],
  },
];
