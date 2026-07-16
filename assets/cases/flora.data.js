window.SOLARA_CASE_DATA = {
 "generated": "2026-07-16",
 "solver": "HiGHS (scipy MILP)",
 "plan": {
  "site": "study",
  "periods": 13,
  "area_m2": 10000,
  "labor_min_per_period": 67200,
  "crops": [
   {
    "id": "tulips",
    "name": "Tulips"
   },
   {
    "id": "freesia",
    "name": "Freesia"
   },
   {
    "id": "celosia",
    "name": "Celosia"
   },
   {
    "id": "lilium",
    "name": "Lilium"
   },
   {
    "id": "lysianthus",
    "name": "Lysianthus"
   },
   {
    "id": "panicum",
    "name": "Panicum"
   }
  ],
  "scenarios": [
   {
    "name": "base",
    "label": "Base plan",
    "desc": "10,000 m\u00b2, 7 FTE, six crops (thesis table 6).",
    "profit": 248616,
    "published": 248616,
    "planting": {
     "tulips": {
      "3": 1385.0,
      "12": 1782.5
     },
     "freesia": {
      "9": 2487.3,
      "10": 1764.5,
      "11": 1343.4
     },
     "celosia": {
      "3": 1677.3
     },
     "lilium": {
      "12": 863.7,
      "9": 1758.6
     },
     "lysianthus": {
      "4": 2017.2,
      "5": 2764.4,
      "7": 1677.3
     },
     "panicum": {
      "1": 3541.1
     }
    },
    "production": {
     "tulips": {
      "4": 1385.0,
      "13": 1782.5
     },
     "freesia": {
      "1": 1989.9,
      "2": 1909.1,
      "3": 1427.6,
      "4": 268.7
     },
     "celosia": {
      "6": 1677.3
     },
     "lilium": {
      "2": 863.7,
      "12": 1758.6
     },
     "lysianthus": {
      "8": 2017.2,
      "9": 2764.4,
      "11": 1677.3
     },
     "panicum": {
      "5": 1593.5,
      "6": 1062.3,
      "7": 885.3
     }
    },
    "resources": [
     {
      "resource": "area",
      "period": 1,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 2.1027
     },
     {
      "resource": "area",
      "period": 2,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 2.7983
     },
     {
      "resource": "area",
      "period": 3,
      "used": 9711.2989,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 4,
      "used": 9963.9788,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 5,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 1.3428
     },
     {
      "resource": "area",
      "period": 6,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 7,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 2.88
     },
     {
      "resource": "area",
      "period": 8,
      "used": 6458.9369,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 9,
      "used": 8687.67,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 10,
      "used": 7687.7678,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 11,
      "used": 9031.1751,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 12,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 2.7601
     },
     {
      "resource": "area",
      "period": 13,
      "used": 8241.4303,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "labor",
      "period": 1,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.2942
     },
     {
      "resource": "labor",
      "period": 2,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.3499
     },
     {
      "resource": "labor",
      "period": 3,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.4019
     },
     {
      "resource": "labor",
      "period": 4,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.0449
     },
     {
      "resource": "labor",
      "period": 5,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.1993
     },
     {
      "resource": "labor",
      "period": 6,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.1641
     },
     {
      "resource": "labor",
      "period": 7,
      "used": 37828.7924,
      "limit": 67200.0,
      "shadow_price": 0.0
     },
     {
      "resource": "labor",
      "period": 8,
      "used": 29047.4801,
      "limit": 67200.0,
      "shadow_price": 0.0
     },
     {
      "resource": "labor",
      "period": 9,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.018
     },
     {
      "resource": "labor",
      "period": 10,
      "used": 11822.1921,
      "limit": 67200.0,
      "shadow_price": 0.0
     },
     {
      "resource": "labor",
      "period": 11,
      "used": 33154.5573,
      "limit": 67200.0,
      "shadow_price": 0.0
     },
     {
      "resource": "labor",
      "period": 12,
      "used": 53450.7919,
      "limit": 67200.0,
      "shadow_price": 0.0
     },
     {
      "resource": "labor",
      "period": 13,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.4589
     }
    ]
   },
   {
    "name": "flexible_labor",
    "label": "Flexible labor",
    "desc": "44h weeks in winter (periods 1-3, 13), 32h in summer (7-8); same annual hours (thesis 4.4.1).",
    "profit": 258503,
    "published": 258503,
    "planting": {
     "tulips": {
      "2": 324.3,
      "3": 1438.3,
      "12": 1960.7
     },
     "freesia": {
      "9": 2599.5,
      "10": 2004.3,
      "11": 1016.8
     },
     "celosia": {
      "3": 1680.8
     },
     "lilium": {
      "11": 324.3,
      "12": 519.6,
      "9": 1574.8
     },
     "lysianthus": {
      "4": 1993.6,
      "5": 2790.1,
      "7": 1680.8
     },
     "panicum": {
      "1": 3535.5
     }
    },
    "production": {
     "tulips": {
      "3": 324.3,
      "4": 1438.3,
      "13": 1960.7
     },
     "freesia": {
      "1": 2079.6,
      "2": 2123.3,
      "3": 1214.3,
      "4": 203.4
     },
     "celosia": {
      "6": 1680.8
     },
     "lilium": {
      "1": 324.3,
      "2": 519.6,
      "12": 1574.8
     },
     "lysianthus": {
      "8": 1993.6,
      "9": 2790.1,
      "11": 1680.8
     },
     "panicum": {
      "5": 1591.0,
      "6": 1060.7,
      "7": 883.9
     }
    },
    "resources": [
     {
      "resource": "area",
      "period": 1,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 2.2294
     },
     {
      "resource": "area",
      "period": 2,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 2.9392
     },
     {
      "resource": "area",
      "period": 3,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 0.343
     },
     {
      "resource": "area",
      "period": 4,
      "used": 9664.9941,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 5,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 1.3417
     },
     {
      "resource": "area",
      "period": 6,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 7,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 2.88
     },
     {
      "resource": "area",
      "period": 8,
      "used": 6464.4649,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 9,
      "used": 8645.2056,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 10,
      "used": 7859.4387,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 11,
      "used": 9200.4909,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 12,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 2.7211
     },
     {
      "resource": "area",
      "period": 13,
      "used": 8425.2076,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "labor",
      "period": 1,
      "used": 73920.0,
      "limit": 73920.0,
      "shadow_price": 0.2873
     },
     {
      "resource": "labor",
      "period": 2,
      "used": 73920.0,
      "limit": 73920.0,
      "shadow_price": 0.3318
     },
     {
      "resource": "labor",
      "period": 3,
      "used": 73920.0,
      "limit": 73920.0,
      "shadow_price": 0.3776
     },
     {
      "resource": "labor",
      "period": 4,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.0452
     },
     {
      "resource": "labor",
      "period": 5,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.1734
     },
     {
      "resource": "labor",
      "period": 6,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.1483
     },
     {
      "resource": "labor",
      "period": 7,
      "used": 37791.0845,
      "limit": 53760.0,
      "shadow_price": 0.0
     },
     {
      "resource": "labor",
      "period": 8,
      "used": 28707.4874,
      "limit": 53760.0,
      "shadow_price": 0.0
     },
     {
      "resource": "labor",
      "period": 9,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.0244
     },
     {
      "resource": "labor",
      "period": 10,
      "used": 13428.8064,
      "limit": 67200.0,
      "shadow_price": 0.0
     },
     {
      "resource": "labor",
      "period": 11,
      "used": 32994.3318,
      "limit": 67200.0,
      "shadow_price": 0.0
     },
     {
      "resource": "labor",
      "period": 12,
      "used": 51638.7223,
      "limit": 67200.0,
      "shadow_price": 0.0
     },
     {
      "resource": "labor",
      "period": 13,
      "used": 73920.0,
      "limit": 73920.0,
      "shadow_price": 0.4599
     }
    ]
   },
   {
    "name": "disease",
    "label": "Disease shock",
    "desc": "Freesia and lysianthus lost to root disease (thesis 4.4.2).",
    "profit": 232384,
    "published": 232384,
    "planting": {
     "tulips": {
      "13": 773.9,
      "1": 65.2,
      "2": 1766.7,
      "12": 1080.6
     },
     "celosia": {
      "3": 205.4,
      "4": 1005.1
     },
     "lilium": {
      "11": 2154.2,
      "12": 2870.0,
      "9": 2691.8,
      "10": 1203.4
     },
     "panicum": {
      "1": 4136.7,
      "2": 1161.5,
      "4": 3491.4
     }
    },
    "production": {
     "tulips": {
      "1": 773.9,
      "2": 65.2,
      "3": 1766.7,
      "13": 1080.6
     },
     "celosia": {
      "6": 205.4,
      "7": 1005.1
     },
     "lilium": {
      "1": 2154.2,
      "2": 2870.0,
      "12": 2691.8,
      "13": 1203.4
     },
     "panicum": {
      "5": 1861.5,
      "6": 1763.7,
      "7": 1382.6,
      "8": 1861.5,
      "9": 1047.4,
      "10": 872.9
     }
    },
    "resources": [
     {
      "resource": "area",
      "period": 1,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 5.4368
     },
     {
      "resource": "area",
      "period": 2,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 1.0358
     },
     {
      "resource": "area",
      "period": 3,
      "used": 7270.1671,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 4,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 0.8874
     },
     {
      "resource": "area",
      "period": 5,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 6,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 2.3692
     },
     {
      "resource": "area",
      "period": 7,
      "used": 9794.64,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 8,
      "used": 4652.8589,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 9,
      "used": 6183.1882,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 10,
      "used": 7386.5961,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 11,
      "used": 6049.3913,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 12,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 1.3077
     },
     {
      "resource": "area",
      "period": 13,
      "used": 8082.1663,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "labor",
      "period": 1,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.1449
     },
     {
      "resource": "labor",
      "period": 2,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.2804
     },
     {
      "resource": "labor",
      "period": 3,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.457
     },
     {
      "resource": "labor",
      "period": 4,
      "used": 11294.2322,
      "limit": 67200.0,
      "shadow_price": 0.0
     },
     {
      "resource": "labor",
      "period": 5,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.2621
     },
     {
      "resource": "labor",
      "period": 6,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.0435
     },
     {
      "resource": "labor",
      "period": 7,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.0043
     },
     {
      "resource": "labor",
      "period": 8,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.0501
     },
     {
      "resource": "labor",
      "period": 9,
      "used": 54231.7965,
      "limit": 67200.0,
      "shadow_price": 0.0
     },
     {
      "resource": "labor",
      "period": 10,
      "used": 38850.7238,
      "limit": 67200.0,
      "shadow_price": 0.0
     },
     {
      "resource": "labor",
      "period": 11,
      "used": 13140.6251,
      "limit": 67200.0,
      "shadow_price": 0.0
     },
     {
      "resource": "labor",
      "period": 12,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.124
     },
     {
      "resource": "labor",
      "period": 13,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.4494
     }
    ]
   },
   {
    "name": "gas_tax",
    "label": "Gas tax",
    "desc": "+1 \u20ac/m\u00b2/period energy cost in the six darkest periods (thesis 4.4.3).",
    "profit": 195178,
    "published": 195178,
    "planting": {
     "tulips": {
      "2": 883.6,
      "3": 1579.1,
      "12": 1782.5
     },
     "freesia": {
      "9": 2021.5,
      "11": 248.5
     },
     "celosia": {
      "3": 1713.6
     },
     "lilium": {
      "11": 883.6,
      "12": 3363.0,
      "9": 1639.8
     },
     "lysianthus": {
      "4": 1771.4,
      "5": 3031.5,
      "7": 1713.6
     },
     "panicum": {
      "1": 3483.5
     }
    },
    "production": {
     "tulips": {
      "3": 883.6,
      "4": 1579.1,
      "13": 1782.5
     },
     "freesia": {
      "1": 1617.2,
      "2": 404.3,
      "3": 198.8,
      "4": 49.7
     },
     "celosia": {
      "6": 1713.6
     },
     "lilium": {
      "1": 883.6,
      "2": 3363.0,
      "12": 1639.8
     },
     "lysianthus": {
      "8": 1771.4,
      "9": 3031.5,
      "11": 1713.6
     },
     "panicum": {
      "5": 1567.6,
      "6": 1045.1,
      "7": 870.9
     }
    },
    "resources": [
     {
      "resource": "area",
      "period": 1,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 1.1107
     },
     {
      "resource": "area",
      "period": 2,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 1.904
     },
     {
      "resource": "area",
      "period": 3,
      "used": 7908.307,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 4,
      "used": 8796.1555,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 5,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 2.3596
     },
     {
      "resource": "area",
      "period": 6,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 7,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 1.88
     },
     {
      "resource": "area",
      "period": 8,
      "used": 6516.4785,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 9,
      "used": 8406.3286,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 10,
      "used": 5374.8449,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 11,
      "used": 6506.9075,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 12,
      "used": 9938.7802,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 13,
      "used": 8298.9719,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "labor",
      "period": 1,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.2745
     },
     {
      "resource": "labor",
      "period": 2,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.3714
     },
     {
      "resource": "labor",
      "period": 3,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.3457
     },
     {
      "resource": "labor",
      "period": 4,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.0401
     },
     {
      "resource": "labor",
      "period": 5,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.2045
     },
     {
      "resource": "labor",
      "period": 6,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.0563
     },
     {
      "resource": "labor",
      "period": 7,
      "used": 37436.2884,
      "limit": 67200.0,
      "shadow_price": 0.0
     },
     {
      "resource": "labor",
      "period": 8,
      "used": 25508.4679,
      "limit": 67200.0,
      "shadow_price": 0.0
     },
     {
      "resource": "labor",
      "period": 9,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.0156
     },
     {
      "resource": "labor",
      "period": 10,
      "used": 0.0,
      "limit": 67200.0,
      "shadow_price": 0.0
     },
     {
      "resource": "labor",
      "period": 11,
      "used": 31730.1325,
      "limit": 67200.0,
      "shadow_price": 0.0
     },
     {
      "resource": "labor",
      "period": 12,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.0615
     },
     {
      "resource": "labor",
      "period": 13,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.4552
     }
    ]
   },
   {
    "name": "faster_tulips",
    "label": "Faster tulips",
    "desc": "Tulip harvest processing 5 min/m\u00b2 faster, e.g. new bunching line (thesis 4.4.4).",
    "profit": 262647,
    "published": 262717,
    "planting": {
     "tulips": {
      "2": 885.6,
      "3": 1828.6,
      "12": 2055.0
     },
     "freesia": {
      "9": 2023.3,
      "11": 276.3
     },
     "celosia": {
      "3": 1731.5
     },
     "lilium": {
      "11": 885.6,
      "12": 3359.8,
      "9": 1325.5
     },
     "lysianthus": {
      "4": 1649.7,
      "5": 3163.8,
      "7": 1731.5
     },
     "panicum": {
      "1": 3455.0
     }
    },
    "production": {
     "tulips": {
      "3": 885.6,
      "4": 1828.6,
      "13": 2055.0
     },
     "freesia": {
      "1": 1618.6,
      "2": 404.7,
      "3": 221.1,
      "4": 55.3
     },
     "celosia": {
      "6": 1731.5
     },
     "lilium": {
      "1": 885.6,
      "2": 3359.8,
      "12": 1325.5
     },
     "lysianthus": {
      "8": 1649.7,
      "9": 3163.8,
      "11": 1731.5
     },
     "panicum": {
      "5": 1554.8,
      "6": 1036.5,
      "7": 863.8
     }
    },
    "resources": [
     {
      "resource": "area",
      "period": 1,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 3.8979
     },
     {
      "resource": "area",
      "period": 2,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 1.3992
     },
     {
      "resource": "area",
      "period": 3,
      "used": 8177.0973,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 4,
      "used": 8941.1929,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 5,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 1.2912
     },
     {
      "resource": "area",
      "period": 6,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 7,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 2.88
     },
     {
      "resource": "area",
      "period": 8,
      "used": 6544.9787,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 9,
      "used": 8244.1055,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 10,
      "used": 5080.3402,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 11,
      "used": 6242.2852,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 12,
      "used": 9925.5666,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 13,
      "used": 8600.0245,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "labor",
      "period": 1,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.3708
     },
     {
      "resource": "labor",
      "period": 2,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.4337
     },
     {
      "resource": "labor",
      "period": 3,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.4983
     },
     {
      "resource": "labor",
      "period": 4,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.0597
     },
     {
      "resource": "labor",
      "period": 5,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.1757
     },
     {
      "resource": "labor",
      "period": 6,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.1508
     },
     {
      "resource": "labor",
      "period": 7,
      "used": 37241.8824,
      "limit": 67200.0,
      "shadow_price": 0.0
     },
     {
      "resource": "labor",
      "period": 8,
      "used": 23755.6058,
      "limit": 67200.0,
      "shadow_price": 0.0
     },
     {
      "resource": "labor",
      "period": 9,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.0274
     },
     {
      "resource": "labor",
      "period": 10,
      "used": 0.0,
      "limit": 67200.0,
      "shadow_price": 0.0
     },
     {
      "resource": "labor",
      "period": 11,
      "used": 32187.5388,
      "limit": 67200.0,
      "shadow_price": 0.0
     },
     {
      "resource": "labor",
      "period": 12,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.2145
     },
     {
      "resource": "labor",
      "period": 13,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.5686
     }
    ]
   },
   {
    "name": "contract",
    "label": "Buyer contract",
    "desc": "Fixed contract: 1,000 m\u00b2 of freesia delivered in each of periods 1-7 at clock price (thesis 4.4.5).",
    "profit": 215842,
    "published": 215842,
    "planting": {
     "tulips": {
      "1": 536.8,
      "2": 553.2,
      "3": 943.9,
      "12": 1604.6
     },
     "freesia": {
      "9": 1250.0,
      "10": 937.5,
      "11": 1015.6,
      "12": 996.1,
      "13": 1001.0,
      "1": 999.8,
      "2": 1000.1
     },
     "celosia": {
      "3": 1055.9
     },
     "lilium": {
      "11": 1553.3,
      "12": 213.0,
      "6": 239.3,
      "9": 2429.9
     },
     "lysianthus": {
      "4": 603.9,
      "5": 2846.4,
      "7": 2813.7
     },
     "panicum": {
      "1": 1496.9
     }
    },
    "production": {
     "tulips": {
      "2": 536.8,
      "3": 553.2,
      "4": 943.9,
      "13": 1604.6
     },
     "freesia": {
      "1": 1000.0,
      "2": 1000.0,
      "3": 1000.0,
      "4": 1000.0,
      "5": 1000.0,
      "6": 1000.0,
      "7": 1000.0,
      "8": 200.0
     },
     "celosia": {
      "6": 1055.9
     },
     "lilium": {
      "1": 1553.3,
      "2": 213.0,
      "9": 239.3,
      "12": 2429.9
     },
     "lysianthus": {
      "8": 603.9,
      "9": 2846.4,
      "11": 2813.7
     },
     "panicum": {
      "5": 673.6,
      "6": 449.1,
      "7": 374.2
     }
    },
    "resources": [
     {
      "resource": "area",
      "period": 1,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 3.3794
     },
     {
      "resource": "area",
      "period": 2,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 5.2293
     },
     {
      "resource": "area",
      "period": 3,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 1.448
     },
     {
      "resource": "area",
      "period": 4,
      "used": 9113.1736,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 5,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 2.8966
     },
     {
      "resource": "area",
      "period": 6,
      "used": 9243.1755,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 7,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 1.3765
     },
     {
      "resource": "area",
      "period": 8,
      "used": 7503.3306,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 9,
      "used": 9579.2508,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 10,
      "used": 7431.0945,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "area",
      "period": 11,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 1.5035
     },
     {
      "resource": "area",
      "period": 12,
      "used": 10000.0,
      "limit": 10000.0,
      "shadow_price": 0.9823
     },
     {
      "resource": "area",
      "period": 13,
      "used": 8571.1022,
      "limit": 10000.0,
      "shadow_price": 0.0
     },
     {
      "resource": "labor",
      "period": 1,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.2147
     },
     {
      "resource": "labor",
      "period": 2,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.1967
     },
     {
      "resource": "labor",
      "period": 3,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.3398
     },
     {
      "resource": "labor",
      "period": 4,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.0305
     },
     {
      "resource": "labor",
      "period": 5,
      "used": 63779.7158,
      "limit": 67200.0,
      "shadow_price": 0.0
     },
     {
      "resource": "labor",
      "period": 6,
      "used": 65332.925,
      "limit": 67200.0,
      "shadow_price": 0.0
     },
     {
      "resource": "labor",
      "period": 7,
      "used": 52857.6655,
      "limit": 67200.0,
      "shadow_price": 0.0
     },
     {
      "resource": "labor",
      "period": 8,
      "used": 14596.4208,
      "limit": 67200.0,
      "shadow_price": 0.0
     },
     {
      "resource": "labor",
      "period": 9,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.063
     },
     {
      "resource": "labor",
      "period": 10,
      "used": 6281.25,
      "limit": 67200.0,
      "shadow_price": 0.0
     },
     {
      "resource": "labor",
      "period": 11,
      "used": 56797.2681,
      "limit": 67200.0,
      "shadow_price": 0.0
     },
     {
      "resource": "labor",
      "period": 12,
      "used": 62016.8745,
      "limit": 67200.0,
      "shadow_price": 0.0
     },
     {
      "resource": "labor",
      "period": 13,
      "used": 67200.0,
      "limit": 67200.0,
      "shadow_price": 0.506
     },
     {
      "resource": "contract",
      "period": 1,
      "used": -1000.0,
      "limit": -1000.0,
      "shadow_price": 1.0105
     },
     {
      "resource": "contract",
      "period": 2,
      "used": -1000.0,
      "limit": -1000.0,
      "shadow_price": 0.7248
     },
     {
      "resource": "contract",
      "period": 3,
      "used": -1000.0,
      "limit": -1000.0,
      "shadow_price": 1.6028
     },
     {
      "resource": "contract",
      "period": 4,
      "used": -1000.0,
      "limit": -1000.0,
      "shadow_price": 10.2478
     },
     {
      "resource": "contract",
      "period": 5,
      "used": -1000.0,
      "limit": -1000.0,
      "shadow_price": 6.8396
     },
     {
      "resource": "contract",
      "period": 6,
      "used": -1000.0,
      "limit": -1000.0,
      "shadow_price": 8.6105
     },
     {
      "resource": "contract",
      "period": 7,
      "used": -1000.0,
      "limit": -1000.0,
      "shadow_price": 14.0483
     }
    ]
   }
  ],
  "stochastic": {
   "scenarios": [
    {
     "name": "boom",
     "prob": 0.35,
     "mult": 3.0
    },
    {
     "name": "typical",
     "prob": 0.4,
     "mult": 1.8
    },
    {
     "name": "bust",
     "prob": 0.25,
     "mult": 0.9
    }
   ],
   "spike_period": 3,
   "spike_crops": [
    "tulips",
    "freesia",
    "lilium"
   ],
   "expected_mult": 1.995,
   "cvar_alpha": 0.25,
   "cvar_lambda": 0.5,
   "plans": {
    "base": {
     "label": "Base plan (peak ignored)",
     "expected": 308987,
     "per_scenario": {
      "boom": 369964,
      "typical": 297155,
      "bust": 242549
     },
     "cvar": 242549,
     "worst": 242549,
     "p3_mix": {
      "freesia": 1427.6
     }
    },
    "risk_neutral": {
     "label": "Risk-neutral (max expected profit)",
     "expected": 347826,
     "per_scenario": {
      "boom": 465496,
      "typical": 324995,
      "bust": 219619
     },
     "cvar": 219619,
     "worst": 219619,
     "p3_mix": {
      "tulips": 953.9,
      "freesia": 353.2,
      "lilium": 1652.2
     }
    },
    "robust": {
     "label": "Robust (mean-CVaR25, protects the weak year)",
     "expected": 342209,
     "per_scenario": {
      "boom": 440679,
      "typical": 323102,
      "bust": 234920
     },
     "cvar": 234920,
     "worst": 234920,
     "p3_mix": {
      "tulips": 1391.7,
      "freesia": 366.9
     }
    },
    "flex": {
     "label": "Flexible winter roster (risk-neutral + 10% labor)",
     "expected": 367204,
     "per_scenario": {
      "boom": 491885,
      "typical": 343012,
      "bust": 231357
     },
     "cvar": 231357,
     "worst": 231357,
     "p3_mix": {
      "tulips": 1274.3,
      "freesia": 364.6,
      "lilium": 1200.2
     }
    }
   }
  }
 }
};
