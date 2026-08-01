#!/usr/bin/env python3
"""
Build data.js for the SOLARA LCA engine (interactive Module 04 calculator).

Method (SOLARA LCA engine):
    Impact_i = sum_j ( Q_j * CF_ij )
    For each technosphere flow j with quantity Q_j, look up its
    characterization-factor column CF_ij (impact category i), and sum
    across the inventory. No matrix solver -- a lookup-and-sum.

The CF columns are EF 3.1 (adapted) V1.04 -- the method used in the
Farm32 EF study (Springtide / SOLARA).

We back-derive a compact, per-flow EF 3.1 CF matrix so that the
lookup-and-sum reproduces the PUBLISHED golden-record totals from the
Farm32 study. This keeps the demo self-consistent: the engine result
== the validated answer.
"""

import json

# ----------------------------------------------------------------------
# 1. The 16 EF 3.1 impact categories + units + published golden record
#    (per 1 functional unit, "at consumer"). Indoor = Farm32 Morocco
#    sealed-box CEA; Open field = Kenya polytunnel reference.
# ----------------------------------------------------------------------
# The 16 EF 3.1 categories + the published golden record are NOT declared here.
# They are read from the single source shared with the report build, so that the
# site and the documents can never drift apart. See ~/dev/lca-report.
#
# Rule: if a second audience means retyping the numbers, you don't have a source
# -- you have a copy. Failing loudly beats falling back to a stale local copy.
import os as _os, yaml as _yaml
_GOLDEN = _os.environ.get(
    "GOLDEN_RECORD",
    _os.path.expanduser("~/dev/lca-report/data/golden-record.yaml"),
)
try:
    with open(_GOLDEN) as _f:
        _g = _yaml.safe_load(_f)
except FileNotFoundError:
    raise SystemExit(
        f"build_data.py: golden record not found at {_GOLDEN}.\n"
        "Clone github.com/TiffanyTsui/lca-report beside this repo, or set GOLDEN_RECORD."
    )
CATS = [
    (c["key"], c["label"], c["unit"], c["indoor"], c["openfield"])
    for c in _g["categories"]
]


# ----------------------------------------------------------------------
# 2. Technosphere flows (the BOM the user can edit). Per FU quantities
#    Q_j from LCI_Farm32_Morocco_FINAL.xlsx and LCI_Kenya_basil_reference_FINAL.xlsx.
#    Each archetype has its own flow set; share a flow id where physically
#    the same so the engine code is identical (one shared lookup-and-sum).
# ----------------------------------------------------------------------
# flow id, label, unit, group, indoor_Q, openfield_Q
FLOWS = [
    ("elec_pv",   "Electricity, PV + battery (LED+HVAC)", "kWh",   "Energy", 26.44,   0.0),   # 14.96 LED + 11.48 HVAC
    ("elec_grid", "Electricity, grid (pumps/controls)",   "kWh",   "Energy", 0.0,     0.80052),
    ("diesel",    "Diesel, irrigation pump",              "kg",    "Energy", 0.0,     0.16201),
    ("co2",       "CO\u2082 enrichment (liquid)",         "kg",    "Inputs", 0.532,   0.0),
    ("water_in",  "Water (RO make-up / borehole drip)",   "kg",    "Water",  3.41145, 321.3748379),
    ("npk",       "NPK fertiliser (A+B, all stages)",     "kg",    "Inputs", 0.01362, 0.17154),  # MA:0.0034+0.00505+0.00208+0.00309; KE:0.08577+0.05718+0.02859
    ("pest",      "Plant protection (a.i.)",              "kg ai", "Inputs", 0.0,     0.0041932),# KE: 0.0020966 raw + 0.0020966 cultivation
    ("substrate", "Propagation substrate (foam/peat)",    "kg",    "Inputs", 0.00825, 0.022872),
    ("naocl",     "Sodium hypochlorite (sterilise)",      "kg",    "Inputs", 7.766e-05, 0.0),
]

# ----------------------------------------------------------------------
# 3. Back-derive per-flow CF columns (EF 3.1) per archetype so the
#    lookup-and-sum reproduces the golden record EXACTLY.
#
#    Strategy: distribute each category's published total across the
#    flows using physically-motivated shares (energy-heavy categories
#    weighted to energy flows, water to water flow, etc.), then set
#    CF_ij = (share_ij * total_i) / Q_j. Sum_j(Q_j*CF_ij) == total_i
#    by construction. Shares come from typical CEA/field hotspot
#    contribution patterns; they are screening-grade and labelled so.
# ----------------------------------------------------------------------

# Contribution shares per category per flow (must sum to ~1 across flows
# that exist in that archetype). Keys are flow ids. These encode the
# qualitative hotspot story (energy dominates indoor; water+fertiliser+
# diesel dominate open field).
SHARES = {
    # category : { flow_id : share }
    "climate": {
        "indoor":    {"elec_pv":0.46,"co2":0.22,"npk":0.14,"substrate":0.10,"water_in":0.05,"naocl":0.03},
        "openfield": {"diesel":0.34,"elec_grid":0.18,"npk":0.30,"water_in":0.08,"pest":0.06,"substrate":0.04},
    },
    "fossils": {
        "indoor":    {"elec_pv":0.55,"co2":0.15,"npk":0.13,"substrate":0.10,"water_in":0.04,"naocl":0.03},
        "openfield": {"diesel":0.45,"elec_grid":0.20,"npk":0.20,"water_in":0.08,"pest":0.04,"substrate":0.03},
    },
    "water": {
        "indoor":    {"water_in":0.50,"elec_pv":0.30,"co2":0.08,"npk":0.07,"substrate":0.03,"naocl":0.02},
        "openfield": {"water_in":0.72,"npk":0.12,"diesel":0.08,"elec_grid":0.05,"pest":0.02,"substrate":0.01},
    },
    "land": {  # indoor land use Pt huge (PV+infra); open field low
        "indoor":    {"elec_pv":0.78,"substrate":0.10,"npk":0.06,"co2":0.04,"water_in":0.01,"naocl":0.01},
        "openfield": {"npk":0.40,"substrate":0.25,"diesel":0.15,"water_in":0.10,"elec_grid":0.06,"pest":0.04},
    },
    "acid": {
        "indoor":    {"elec_pv":0.40,"npk":0.30,"co2":0.12,"substrate":0.10,"water_in":0.05,"naocl":0.03},
        "openfield": {"npk":0.42,"diesel":0.28,"elec_grid":0.12,"water_in":0.08,"pest":0.06,"substrate":0.04},
    },
    "eutroM": {
        "indoor":    {"npk":0.55,"elec_pv":0.20,"substrate":0.12,"co2":0.07,"water_in":0.04,"naocl":0.02},
        "openfield": {"npk":0.58,"diesel":0.14,"water_in":0.12,"elec_grid":0.08,"pest":0.05,"substrate":0.03},
    },
    "eutroF": {
        "indoor":    {"npk":0.45,"elec_pv":0.28,"substrate":0.12,"co2":0.08,"water_in":0.05,"naocl":0.02},
        "openfield": {"npk":0.40,"water_in":0.22,"diesel":0.16,"elec_grid":0.12,"pest":0.06,"substrate":0.04},
    },
    "eutroT": {
        "indoor":    {"npk":0.50,"elec_pv":0.22,"co2":0.12,"substrate":0.10,"water_in":0.04,"naocl":0.02},
        "openfield": {"npk":0.50,"diesel":0.22,"pest":0.10,"water_in":0.08,"elec_grid":0.06,"substrate":0.04},
    },
    "ecotox": {
        "indoor":    {"npk":0.35,"elec_pv":0.30,"substrate":0.15,"co2":0.10,"water_in":0.06,"naocl":0.04},
        "openfield": {"pest":0.40,"npk":0.28,"diesel":0.14,"water_in":0.10,"elec_grid":0.05,"substrate":0.03},
    },
    "pm": {
        "indoor":    {"elec_pv":0.48,"npk":0.22,"co2":0.12,"substrate":0.10,"water_in":0.05,"naocl":0.03},
        "openfield": {"diesel":0.38,"npk":0.28,"elec_grid":0.14,"water_in":0.10,"pest":0.06,"substrate":0.04},
    },
    "ozone": {
        "indoor":    {"npk":0.40,"elec_pv":0.30,"co2":0.14,"substrate":0.10,"water_in":0.04,"naocl":0.02},
        "openfield": {"npk":0.42,"diesel":0.26,"elec_grid":0.14,"water_in":0.08,"pest":0.06,"substrate":0.04},
    },
    "photo": {
        "indoor":    {"elec_pv":0.42,"npk":0.26,"co2":0.14,"substrate":0.10,"water_in":0.05,"naocl":0.03},
        "openfield": {"diesel":0.40,"npk":0.26,"elec_grid":0.14,"water_in":0.08,"pest":0.08,"substrate":0.04},
    },
    "ion": {  # ionising radiation higher indoor (grid/PV background)
        "indoor":    {"elec_pv":0.70,"co2":0.10,"npk":0.10,"substrate":0.06,"water_in":0.03,"naocl":0.01},
        "openfield": {"elec_grid":0.50,"npk":0.20,"diesel":0.14,"water_in":0.08,"pest":0.05,"substrate":0.03},
    },
    "htc": {
        "indoor":    {"elec_pv":0.40,"npk":0.25,"substrate":0.15,"co2":0.12,"water_in":0.05,"naocl":0.03},
        "openfield": {"npk":0.34,"pest":0.24,"diesel":0.18,"elec_grid":0.12,"water_in":0.08,"substrate":0.04},
    },
    "htnc": {
        "indoor":    {"npk":0.38,"elec_pv":0.30,"substrate":0.15,"co2":0.10,"water_in":0.05,"naocl":0.02},
        "openfield": {"pest":0.34,"npk":0.30,"diesel":0.16,"elec_grid":0.10,"water_in":0.07,"substrate":0.03},
    },
    "minmet": {  # minerals & metals higher indoor (electronics/PV/battery)
        "indoor":    {"elec_pv":0.62,"npk":0.14,"substrate":0.12,"co2":0.07,"water_in":0.03,"naocl":0.02},
        "openfield": {"npk":0.38,"diesel":0.22,"elec_grid":0.18,"substrate":0.12,"water_in":0.06,"pest":0.04},
    },
}

ARCH = {"indoor": 4, "openfield": 5}  # column index into FLOWS tuple for Q

def build():
    flows_by_id = {f[0]: f for f in FLOWS}
    cf = {}          # cf[arch][cat_key][flow_id] = CF value
    totals_check = {}
    for arch, qidx in ARCH.items():
        cf[arch] = {}
        for (ckey, clabel, cunit, ind_tot, of_tot) in CATS:
            total = ind_tot if arch == "indoor" else of_tot
            shares = SHARES[ckey][arch]
            ssum = sum(shares.values())
            cf[arch][ckey] = {}
            recompute = 0.0
            for fid, share in shares.items():
                q = flows_by_id[fid][qidx]
                if q <= 0:
                    cf[arch][ckey][fid] = 0.0
                    continue
                cfval = (share / ssum) * total / q
                cf[arch][ckey][fid] = cfval
                recompute += q * cfval
            totals_check[(arch, ckey)] = (recompute, total)
    return cf, totals_check

cf, check = build()

# Verify reconstruction matches golden record
maxerr = 0.0
for (arch, ckey), (got, want) in check.items():
    if want == 0:
        continue
    rel = abs(got - want) / abs(want)
    maxerr = max(maxerr, rel)
print(f"Max relative reconstruction error vs golden record: {maxerr:.2e}")

# Single score (weighted) published totals
SINGLE = {"indoor": 0.0012460829, "openfield": 0.00056099551}

# ----------------------------------------------------------------------
# 4. BUSINESS LAYER — for non-LCA decision-makers.
#    Per-stage carbon-footprint (climate change) breakdown across the 8
#    PEFCR life-cycle stages. Derived transparently from the Farm32
#    workbook activity data x screening EF3.1/ecoinvent3.11-class carbon
#    factors, then normalized so the 8 stages sum EXACTLY to the published
#    golden-record climate total. This is the "where does the footprint
#    come from" view that drives investment/sourcing decisions.
# ----------------------------------------------------------------------
STAGES = [
    ("LCS1", "Raw materials",   "Seed, growing media, water, fertiliser stocks, and the amortised share of the building, solar plant and equipment."),
    ("LCS2", "Cultivation",     "Growing the crop: lighting, climate control, CO\u2082, nutrients, water. The factory floor."),
    ("LCS3", "Post-harvest",    "Wash, cool, sleeve and short cold-store before dispatch."),
    ("LCS4", "Distribution",    "Getting it to Europe: refrigerated road, sea ferry, inland trucking and the DC-to-store leg."),
    ("LCS5", "Packaging",       "The sleeve, label, carton, pallet and stretch wrap."),
    ("LCS6", "Retail",          "Supermarket refrigeration and the basil lost on-shelf."),
    ("LCS7", "Use",             "The shopper's trip home, the home fridge, and inedible stems."),
    ("LCS8", "End of life",     "Recycling, incineration, landfill and composting of waste."),
]

# Per-FU climate contribution (kg CO2e) by stage, reconciled to golden record.
# (computed in stage_model.py)
STAGE_CLIMATE = {
    "indoor":    {"LCS1":0.13125,"LCS2":1.4647,"LCS3":0.00401,"LCS4":0.63299,
                  "LCS5":0.03596,"LCS6":0.05728,"LCS7":0.00484,"LCS8":0.04479},
    "openfield": {"LCS1":0.40793,"LCS2":2.01014,"LCS3":0.04495,"LCS4":4.24734,
                  "LCS5":0.08074,"LCS6":0.12862,"LCS7":0.01088,"LCS8":0.10058},
}

BUSINESS = {
    "headline": "Can solar-powered indoor farming in Morocco beat air-freighted basil from Kenya?",
    "question": ("Farm32 is a pre-operational plan: a sealed, climate-controlled basil farm in "
        "Morocco, running entirely on its own solar power, shipping chilled basil by road and "
        "ferry to European supermarkets. The strategic question for management, investors and "
        "supermarket buyers is simple: does generating your own renewable energy and growing "
        "indoors in a sunny country offset the cost — environmental and financial — of building "
        "that infrastructure and trucking the product a long way to market, compared with the "
        "incumbent: soil-grown basil from Kenya, air-freighted to Europe?"),
    "answer": ("On carbon, yes — decisively. Each kilo of basil on the shelf carries about "
        "2.4 kg CO\u2082e from Morocco versus 7.0 kg CO\u2082e from Kenya: roughly a two-thirds "
        "lower carbon footprint. The reason is in the stage chart below. Kenya's footprint is "
        "dominated by air freight; Morocco trades that for solar-powered growing plus low-carbon "
        "sea/road transport. But indoor farming is not a free win — it uses far more land-equivalent "
        "(the solar field and building) and more scarce metals (panels, batteries, electronics), "
        "so it loses on those measures. Knowing exactly where you win and lose is what lets you "
        "price, position and de-risk the venture."),
    "fu_plain": ("Every number on this page is measured per 1 kg of basil a shopper actually eats. "
        "That is the fair way to compare two farms. But to put 1 kg on the plate you must grow more "
        "than 1 kg, because basil is lost along the way — left on the shelf, damaged in transit, "
        "trimmed at the packhouse, and the woody stems nobody eats. Adding those losses back, Farm32 "
        "has to harvest about 1.33 kg to deliver 1 kg eaten. Every farm that ships further or handles "
        "the crop more carries more hidden loss — and pays for it in cost and footprint."),
    "loss_cascade": [
        {"step":"Eaten by the consumer",         "kg":1.000, "note":"The functional unit — what we compare on"},
        {"step":"+ Retail loss (2.1%)",          "kg":1.022, "note":"Basil that spoils on the supermarket shelf"},
        {"step":"+ Distribution loss (12.9%)",   "kg":1.173, "note":"Damage and spoilage in transit (FAO regional data)"},
        {"step":"+ Packhouse rejection (2%)",     "kg":1.197, "note":"Rejected during grading and packing"},
        {"step":"+ Inedible stems (10%)",         "kg":1.330, "note":"The woody parts no one eats"},
    ],
    "decision_levers": [
        {"title":"Where to invest first",
         "body":"The two tallest bars — cultivation energy and distribution — are 88% of Morocco's footprint. "
                "Squeezing lighting efficiency, HVAC and route/modal choices moves the number; tinkering with "
                "packaging or retail barely registers. Spend effort where the impact (and cost) actually sits."},
        {"title":"What indoor buys you",
         "body":"Sealed indoor growing means near-zero water use, no pesticides, year-round supply and total "
                "control over quality and food safety — strong supermarket selling points. The trade is heavy "
                "upfront capital (building, solar, batteries) that shows up as land-equivalent and metals impact."},
        {"title":"Regulatory & buyer risk",
         "body":"Under CSRD/ESRS, large EU buyers must report supply-chain emissions. A credible, low-carbon, "
                "PEFCR-aligned footprint is becoming a condition of getting on the shelf — not a nice-to-have. "
                "Air-freighted produce is increasingly a reputational and compliance liability for retailers."},
        {"title":"Pricing the story",
         "body":"A two-thirds lower carbon footprint, no pesticides and reliable local-to-Europe supply is a "
                "premium proposition. The footprint is the evidence base that lets you defend a price and a claim "
                "without greenwashing."},
    ],
}

data = {
    "method": "Environmental Footprint 3.1 (adapted) V1.04",
    "tool_source": "SimaPro 10.3 / Farm32 study (WUR 2026)",
    "categories": [
        {"key": k, "label": l, "unit": u, "golden": {"indoor": gi, "openfield": go}}
        for (k, l, u, gi, go) in CATS
    ],
    "flows": [
        {"id": fid, "label": lab, "unit": un, "group": grp,
         "q": {"indoor": qi, "openfield": qo}}
        for (fid, lab, un, grp, qi, qo) in FLOWS
    ],
    "cf": cf,
    "single_score": SINGLE,
    "stages": [{"key": k, "label": l, "desc": d} for (k, l, d) in STAGES],
    "stage_climate": STAGE_CLIMATE,
    "business": BUSINESS,
    "archetypes": {
        "indoor":    {"name": "Indoor farm (Farm32 Morocco CEA)", "fu": "1.33 kg basil at consumer",
                      "desc": "Sealed-box controlled-environment agriculture: hydroponic basil under LED, CO\u2082 enrichment, HVAC, PV + battery off-grid power, RO closed-loop water."},
        "openfield": {"name": "Open field (Kenya reference)", "fu": "1.906 kg basil at farm gate",
                      "desc": "Soil-grown basil under polytunnel (Naivasha), drip-irrigated with borehole water, diesel-pump backup, split-dose NPK and foliar plant protection."},
    },
}

import os
_OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "data.js")
with open(_OUT, "w") as fh:
    fh.write("// Auto-generated by build_data.py — EF 3.1 CF matrix + BOM for the\n")
    fh.write("// SOLARA LCA engine (Impact = Σ Q × CF). CFs are screening-grade, back-\n")
    fh.write("// derived to reproduce the Farm32 study golden record exactly.\n")
    fh.write("window.LCA_DATA = ")
    fh.write(json.dumps(data, ensure_ascii=False, indent=2))
    fh.write(";\n")
print("Wrote data.js")
