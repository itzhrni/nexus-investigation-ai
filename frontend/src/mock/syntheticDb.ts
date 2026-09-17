import type { Entity, GraphNode, GraphEdge } from "@/types/nexus";

export const syntheticEntities: Record<string, Entity> = {
  "P001": {
    "id": "P001",
    "type": "person",
    "label": "Aarav Sharma",
    "value": "Aarav Sharma",
    "canonicalName": "Aarav Sharma",
    "aliases": [
      "Alias_Aarav",
      "Shadow_1"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "Delhi",
    "district": "New Delhi",
    "jurisdictions": [
      {
        "state": "Delhi",
        "district": "New Delhi"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-0016",
    "aadhaarStatus": "VERHOEFF_VALID",
    "summary": "Subject of interest in Delhi. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-0016"
      },
      {
        "kind": "State",
        "value": "Delhi"
      },
      {
        "kind": "District",
        "value": "New Delhi"
      }
    ]
  },
  "P002": {
    "id": "P002",
    "type": "person",
    "label": "Aditya Verma",
    "value": "Aditya Verma",
    "canonicalName": "Aditya Verma",
    "aliases": [
      "Alias_Aditya",
      "Shadow_2"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "Maharashtra",
    "district": "Mumbai Suburban",
    "jurisdictions": [
      {
        "state": "Maharashtra",
        "district": "Mumbai Suburban"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-2029",
    "aadhaarStatus": "VERHOEFF_INVALID",
    "summary": "Subject of interest in Maharashtra. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-2029"
      },
      {
        "kind": "State",
        "value": "Maharashtra"
      },
      {
        "kind": "District",
        "value": "Mumbai Suburban"
      }
    ]
  },
  "P003": {
    "id": "P003",
    "type": "person",
    "label": "Rohan Gupta",
    "value": "Rohan Gupta",
    "canonicalName": "Rohan Gupta",
    "aliases": [
      "Alias_Rohan",
      "Shadow_3"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "Karnataka",
    "district": "Bengaluru Urban",
    "jurisdictions": [
      {
        "state": "Karnataka",
        "district": "Bengaluru Urban"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-3018",
    "aadhaarStatus": "COLLISION_FLAGGED",
    "summary": "Subject of interest in Karnataka. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-3018"
      },
      {
        "kind": "State",
        "value": "Karnataka"
      },
      {
        "kind": "District",
        "value": "Bengaluru Urban"
      }
    ]
  },
  "P004": {
    "id": "P004",
    "type": "person",
    "label": "Vikram Patel",
    "value": "Vikram Patel",
    "canonicalName": "Vikram Patel",
    "aliases": [
      "Alias_Vikram",
      "Shadow_4"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "West Bengal",
    "district": "Kolkata",
    "jurisdictions": [
      {
        "state": "West Bengal",
        "district": "Kolkata"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-4048",
    "aadhaarStatus": "VERHOEFF_INVALID",
    "summary": "Subject of interest in West Bengal. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-4048"
      },
      {
        "kind": "State",
        "value": "West Bengal"
      },
      {
        "kind": "District",
        "value": "Kolkata"
      }
    ]
  },
  "P005": {
    "id": "P005",
    "type": "person",
    "label": "Karan Singh",
    "value": "Karan Singh",
    "canonicalName": "Karan Singh",
    "aliases": [
      "Alias_Karan",
      "Shadow_5"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "Haryana",
    "district": "Gurugram",
    "jurisdictions": [
      {
        "state": "Haryana",
        "district": "Gurugram"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-9015",
    "aadhaarStatus": "COLLISION_FLAGGED",
    "summary": "Subject of interest in Haryana. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-9015"
      },
      {
        "kind": "State",
        "value": "Haryana"
      },
      {
        "kind": "District",
        "value": "Gurugram"
      }
    ]
  },
  "P006": {
    "id": "P006",
    "type": "person",
    "label": "Siddharth Kumar",
    "value": "Siddharth Kumar",
    "canonicalName": "Siddharth Kumar",
    "aliases": [
      "Alias_Siddharth",
      "Shadow_6"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "Telangana",
    "district": "Hyderabad",
    "jurisdictions": [
      {
        "state": "Telangana",
        "district": "Hyderabad"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-0062",
    "aadhaarStatus": "VERHOEFF_VALID",
    "summary": "Subject of interest in Telangana. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-0062"
      },
      {
        "kind": "State",
        "value": "Telangana"
      },
      {
        "kind": "District",
        "value": "Hyderabad"
      }
    ]
  },
  "P007": {
    "id": "P007",
    "type": "person",
    "label": "Priya Reddy",
    "value": "Priya Reddy",
    "canonicalName": "Priya Reddy",
    "aliases": [
      "Alias_Priya",
      "Shadow_7"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "Tamil Nadu",
    "district": "Chennai",
    "jurisdictions": [
      {
        "state": "Tamil Nadu",
        "district": "Chennai"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-0079",
    "aadhaarStatus": "VERHOEFF_VALID",
    "summary": "Subject of interest in Tamil Nadu. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-0079"
      },
      {
        "kind": "State",
        "value": "Tamil Nadu"
      },
      {
        "kind": "District",
        "value": "Chennai"
      }
    ]
  },
  "P008": {
    "id": "P008",
    "type": "person",
    "label": "Ananya Rao",
    "value": "Ananya Rao",
    "canonicalName": "Ananya Rao",
    "aliases": [
      "Alias_Ananya",
      "Shadow_8"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "Maharashtra",
    "district": "Pune",
    "jurisdictions": [
      {
        "state": "Maharashtra",
        "district": "Pune"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-0087",
    "aadhaarStatus": "VERHOEFF_VALID",
    "summary": "Subject of interest in Maharashtra. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-0087"
      },
      {
        "kind": "State",
        "value": "Maharashtra"
      },
      {
        "kind": "District",
        "value": "Pune"
      }
    ]
  },
  "P009": {
    "id": "P009",
    "type": "person",
    "label": "Rajesh Joshi",
    "value": "Rajesh Joshi",
    "canonicalName": "Rajesh Joshi",
    "aliases": [
      "Alias_Rajesh",
      "Shadow_9"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "Gujarat",
    "district": "Ahmedabad",
    "jurisdictions": [
      {
        "state": "Gujarat",
        "district": "Ahmedabad"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-0093",
    "aadhaarStatus": "VERHOEFF_VALID",
    "summary": "Subject of interest in Gujarat. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-0093"
      },
      {
        "kind": "State",
        "value": "Gujarat"
      },
      {
        "kind": "District",
        "value": "Ahmedabad"
      }
    ]
  },
  "P010": {
    "id": "P010",
    "type": "person",
    "label": "Suresh Nair",
    "value": "Suresh Nair",
    "canonicalName": "Suresh Nair",
    "aliases": [
      "Alias_Suresh",
      "Shadow_10"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "Uttar Pradesh",
    "district": "Lucknow",
    "jurisdictions": [
      {
        "state": "Uttar Pradesh",
        "district": "Lucknow"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-9999",
    "aadhaarStatus": "VERHOEFF_INVALID",
    "summary": "Subject of interest in Uttar Pradesh. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-9999"
      },
      {
        "kind": "State",
        "value": "Uttar Pradesh"
      },
      {
        "kind": "District",
        "value": "Lucknow"
      }
    ]
  },
  "P011": {
    "id": "P011",
    "type": "person",
    "label": "Meera Mehta",
    "value": "Meera Mehta",
    "canonicalName": "Meera Mehta",
    "aliases": [
      "Alias_Meera",
      "Shadow_11"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "Rajasthan",
    "district": "Jaipur",
    "jurisdictions": [
      {
        "state": "Rajasthan",
        "district": "Jaipur"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-0114",
    "aadhaarStatus": "COLLISION_FLAGGED",
    "summary": "Subject of interest in Rajasthan. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-0114"
      },
      {
        "kind": "State",
        "value": "Rajasthan"
      },
      {
        "kind": "District",
        "value": "Jaipur"
      }
    ]
  },
  "P012": {
    "id": "P012",
    "type": "person",
    "label": "Deepak Deshmukh",
    "value": "Deepak Deshmukh",
    "canonicalName": "Deepak Deshmukh",
    "aliases": [
      "Alias_Deepak",
      "Shadow_12"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "Punjab",
    "district": "Chandigarh",
    "jurisdictions": [
      {
        "state": "Punjab",
        "district": "Chandigarh"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-0128",
    "aadhaarStatus": "VERHOEFF_VALID",
    "summary": "Subject of interest in Punjab. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-0128"
      },
      {
        "kind": "State",
        "value": "Punjab"
      },
      {
        "kind": "District",
        "value": "Chandigarh"
      }
    ]
  },
  "P013": {
    "id": "P013",
    "type": "person",
    "label": "Sunil Chawla",
    "value": "Sunil Chawla",
    "canonicalName": "Sunil Chawla",
    "aliases": [
      "Alias_Sunil",
      "Shadow_13"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "Rajasthan",
    "district": "Jaipur",
    "jurisdictions": [
      {
        "state": "Rajasthan",
        "district": "Jaipur"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-0139",
    "aadhaarStatus": "VERHOEFF_VALID",
    "summary": "Subject of interest in Rajasthan. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-0139"
      },
      {
        "kind": "State",
        "value": "Rajasthan"
      },
      {
        "kind": "District",
        "value": "Jaipur"
      }
    ]
  },
  "P014": {
    "id": "P014",
    "type": "person",
    "label": "Manish Agarwal",
    "value": "Manish Agarwal",
    "canonicalName": "Manish Agarwal",
    "aliases": [
      "Alias_Manish",
      "Shadow_14"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "Kerala",
    "district": "Ernakulam",
    "jurisdictions": [
      {
        "state": "Kerala",
        "district": "Ernakulam"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-0142",
    "aadhaarStatus": "VERHOEFF_VALID",
    "summary": "Subject of interest in Kerala. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-0142"
      },
      {
        "kind": "State",
        "value": "Kerala"
      },
      {
        "kind": "District",
        "value": "Ernakulam"
      }
    ]
  },
  "P015": {
    "id": "P015",
    "type": "person",
    "label": "Pooja Bhatnagar",
    "value": "Pooja Bhatnagar",
    "canonicalName": "Pooja Bhatnagar",
    "aliases": [
      "Alias_Pooja",
      "Shadow_15"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "West Bengal",
    "district": "North 24 Parganas",
    "jurisdictions": [
      {
        "state": "West Bengal",
        "district": "North 24 Parganas"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-9015",
    "aadhaarStatus": "COLLISION_FLAGGED",
    "summary": "Subject of interest in West Bengal. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-9015"
      },
      {
        "kind": "State",
        "value": "West Bengal"
      },
      {
        "kind": "District",
        "value": "North 24 Parganas"
      }
    ]
  },
  "P016": {
    "id": "P016",
    "type": "person",
    "label": "Rahul Iyer",
    "value": "Rahul Iyer",
    "canonicalName": "Rahul Iyer",
    "aliases": [
      "Alias_Rahul",
      "Shadow_16"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "Maharashtra",
    "district": "Thane",
    "jurisdictions": [
      {
        "state": "Maharashtra",
        "district": "Thane"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-0168",
    "aadhaarStatus": "VERHOEFF_VALID",
    "summary": "Subject of interest in Maharashtra. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-0168"
      },
      {
        "kind": "State",
        "value": "Maharashtra"
      },
      {
        "kind": "District",
        "value": "Thane"
      }
    ]
  },
  "P017": {
    "id": "P017",
    "type": "person",
    "label": "Vijay Choudhury",
    "value": "Vijay Choudhury",
    "canonicalName": "Vijay Choudhury",
    "aliases": [
      "Alias_Vijay",
      "Shadow_17"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "Karnataka",
    "district": "Bengaluru Urban",
    "jurisdictions": [
      {
        "state": "Karnataka",
        "district": "Bengaluru Urban"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-0170",
    "aadhaarStatus": "VERHOEFF_VALID",
    "summary": "Subject of interest in Karnataka. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-0170"
      },
      {
        "kind": "State",
        "value": "Karnataka"
      },
      {
        "kind": "District",
        "value": "Bengaluru Urban"
      }
    ]
  },
  "P018": {
    "id": "P018",
    "type": "person",
    "label": "Anita Saxena",
    "value": "Anita Saxena",
    "canonicalName": "Anita Saxena",
    "aliases": [
      "Alias_Anita",
      "Shadow_18"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "Karnataka",
    "district": "Bengaluru Urban",
    "jurisdictions": [
      {
        "state": "Karnataka",
        "district": "Bengaluru Urban"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-3018",
    "aadhaarStatus": "COLLISION_FLAGGED",
    "summary": "Subject of interest in Karnataka. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-3018"
      },
      {
        "kind": "State",
        "value": "Karnataka"
      },
      {
        "kind": "District",
        "value": "Bengaluru Urban"
      }
    ]
  },
  "P019": {
    "id": "P019",
    "type": "person",
    "label": "Nikhil Kapoor",
    "value": "Nikhil Kapoor",
    "canonicalName": "Nikhil Kapoor",
    "aliases": [
      "Alias_Nikhil",
      "Shadow_19"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "Telangana",
    "district": "Rangareddy",
    "jurisdictions": [
      {
        "state": "Telangana",
        "district": "Rangareddy"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-0197",
    "aadhaarStatus": "VERHOEFF_VALID",
    "summary": "Subject of interest in Telangana. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-0197"
      },
      {
        "kind": "State",
        "value": "Telangana"
      },
      {
        "kind": "District",
        "value": "Rangareddy"
      }
    ]
  },
  "P020": {
    "id": "P020",
    "type": "person",
    "label": "Amit Mishra",
    "value": "Amit Mishra",
    "canonicalName": "Amit Mishra",
    "aliases": [
      "Alias_Amit",
      "Shadow_20"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "Maharashtra",
    "district": "Mumbai Suburban",
    "jurisdictions": [
      {
        "state": "Maharashtra",
        "district": "Mumbai Suburban"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-0204",
    "aadhaarStatus": "VERHOEFF_VALID",
    "summary": "Subject of interest in Maharashtra. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-0204"
      },
      {
        "kind": "State",
        "value": "Maharashtra"
      },
      {
        "kind": "District",
        "value": "Mumbai Suburban"
      }
    ]
  },
  "P021": {
    "id": "P021",
    "type": "person",
    "label": "Harish Sharma",
    "value": "Harish Sharma",
    "canonicalName": "Harish Sharma",
    "aliases": [
      "Alias_Harish",
      "Shadow_21"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "Delhi",
    "district": "South West Delhi",
    "jurisdictions": [
      {
        "state": "Delhi",
        "district": "South West Delhi"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-0218",
    "aadhaarStatus": "VERHOEFF_VALID",
    "summary": "Subject of interest in Delhi. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-0218"
      },
      {
        "kind": "State",
        "value": "Delhi"
      },
      {
        "kind": "District",
        "value": "South West Delhi"
      }
    ]
  },
  "P022": {
    "id": "P022",
    "type": "person",
    "label": "Sanjay Verma",
    "value": "Sanjay Verma",
    "canonicalName": "Sanjay Verma",
    "aliases": [
      "Alias_Sanjay",
      "Shadow_22"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "Maharashtra",
    "district": "Pune",
    "jurisdictions": [
      {
        "state": "Maharashtra",
        "district": "Pune"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-0224",
    "aadhaarStatus": "VERHOEFF_VALID",
    "summary": "Subject of interest in Maharashtra. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-0224"
      },
      {
        "kind": "State",
        "value": "Maharashtra"
      },
      {
        "kind": "District",
        "value": "Pune"
      }
    ]
  },
  "P023": {
    "id": "P023",
    "type": "person",
    "label": "Ramesh Gupta",
    "value": "Ramesh Gupta",
    "canonicalName": "Ramesh Gupta",
    "aliases": [
      "Alias_Ramesh",
      "Shadow_23"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "West Bengal",
    "district": "Kolkata",
    "jurisdictions": [
      {
        "state": "West Bengal",
        "district": "Kolkata"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-0232",
    "aadhaarStatus": "VERHOEFF_VALID",
    "summary": "Subject of interest in West Bengal. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-0232"
      },
      {
        "kind": "State",
        "value": "West Bengal"
      },
      {
        "kind": "District",
        "value": "Kolkata"
      }
    ]
  },
  "P024": {
    "id": "P024",
    "type": "person",
    "label": "Gautam Patel",
    "value": "Gautam Patel",
    "canonicalName": "Gautam Patel",
    "aliases": [
      "Alias_Gautam",
      "Shadow_24"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "Tamil Nadu",
    "district": "Chennai",
    "jurisdictions": [
      {
        "state": "Tamil Nadu",
        "district": "Chennai"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-0246",
    "aadhaarStatus": "VERHOEFF_VALID",
    "summary": "Subject of interest in Tamil Nadu. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-0246"
      },
      {
        "kind": "State",
        "value": "Tamil Nadu"
      },
      {
        "kind": "District",
        "value": "Chennai"
      }
    ]
  },
  "P025": {
    "id": "P025",
    "type": "person",
    "label": "Neha Singh",
    "value": "Neha Singh",
    "canonicalName": "Neha Singh",
    "aliases": [
      "Alias_Neha",
      "Shadow_25"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "Tamil Nadu",
    "district": "Chennai",
    "jurisdictions": [
      {
        "state": "Tamil Nadu",
        "district": "Chennai"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-0254",
    "aadhaarStatus": "VERHOEFF_VALID",
    "summary": "Subject of interest in Tamil Nadu. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-0254"
      },
      {
        "kind": "State",
        "value": "Tamil Nadu"
      },
      {
        "kind": "District",
        "value": "Chennai"
      }
    ]
  },
  "P026": {
    "id": "P026",
    "type": "person",
    "label": "Divya Kumar",
    "value": "Divya Kumar",
    "canonicalName": "Divya Kumar",
    "aliases": [
      "Alias_Divya",
      "Shadow_26"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "Delhi",
    "district": "New Delhi",
    "jurisdictions": [
      {
        "state": "Delhi",
        "district": "New Delhi"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-0261",
    "aadhaarStatus": "VERHOEFF_VALID",
    "summary": "Subject of interest in Delhi. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-0261"
      },
      {
        "kind": "State",
        "value": "Delhi"
      },
      {
        "kind": "District",
        "value": "New Delhi"
      }
    ]
  },
  "P027": {
    "id": "P027",
    "type": "person",
    "label": "Arjun Reddy",
    "value": "Arjun Reddy",
    "canonicalName": "Arjun Reddy",
    "aliases": [
      "Alias_Arjun",
      "Shadow_27"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "Maharashtra",
    "district": "Mumbai Suburban",
    "jurisdictions": [
      {
        "state": "Maharashtra",
        "district": "Mumbai Suburban"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-0275",
    "aadhaarStatus": "VERHOEFF_VALID",
    "summary": "Subject of interest in Maharashtra. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-0275"
      },
      {
        "kind": "State",
        "value": "Maharashtra"
      },
      {
        "kind": "District",
        "value": "Mumbai Suburban"
      }
    ]
  },
  "P028": {
    "id": "P028",
    "type": "person",
    "label": "Preeti Rao",
    "value": "Preeti Rao",
    "canonicalName": "Preeti Rao",
    "aliases": [
      "Alias_Preeti",
      "Shadow_28"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "Karnataka",
    "district": "Bengaluru Urban",
    "jurisdictions": [
      {
        "state": "Karnataka",
        "district": "Bengaluru Urban"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-0285",
    "aadhaarStatus": "VERHOEFF_VALID",
    "summary": "Subject of interest in Karnataka. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-0285"
      },
      {
        "kind": "State",
        "value": "Karnataka"
      },
      {
        "kind": "District",
        "value": "Bengaluru Urban"
      }
    ]
  },
  "P029": {
    "id": "P029",
    "type": "person",
    "label": "Alok Joshi",
    "value": "Alok Joshi",
    "canonicalName": "Alok Joshi",
    "aliases": [
      "Alias_Alok",
      "Shadow_29"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "West Bengal",
    "district": "Kolkata",
    "jurisdictions": [
      {
        "state": "West Bengal",
        "district": "Kolkata"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-0293",
    "aadhaarStatus": "VERHOEFF_VALID",
    "summary": "Subject of interest in West Bengal. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-0293"
      },
      {
        "kind": "State",
        "value": "West Bengal"
      },
      {
        "kind": "District",
        "value": "Kolkata"
      }
    ]
  },
  "P030": {
    "id": "P030",
    "type": "person",
    "label": "Varun Nair",
    "value": "Varun Nair",
    "canonicalName": "Varun Nair",
    "aliases": [
      "Alias_Varun",
      "Shadow_30"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "Haryana",
    "district": "Gurugram",
    "jurisdictions": [
      {
        "state": "Haryana",
        "district": "Gurugram"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-0307",
    "aadhaarStatus": "VERHOEFF_VALID",
    "summary": "Subject of interest in Haryana. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-0307"
      },
      {
        "kind": "State",
        "value": "Haryana"
      },
      {
        "kind": "District",
        "value": "Gurugram"
      }
    ]
  },
  "P031": {
    "id": "P031",
    "type": "person",
    "label": "Simran Mehta",
    "value": "Simran Mehta",
    "canonicalName": "Simran Mehta",
    "aliases": [
      "Alias_Simran",
      "Shadow_31"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "Telangana",
    "district": "Hyderabad",
    "jurisdictions": [
      {
        "state": "Telangana",
        "district": "Hyderabad"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-0114",
    "aadhaarStatus": "COLLISION_FLAGGED",
    "summary": "Subject of interest in Telangana. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-0114"
      },
      {
        "kind": "State",
        "value": "Telangana"
      },
      {
        "kind": "District",
        "value": "Hyderabad"
      }
    ]
  },
  "P032": {
    "id": "P032",
    "type": "person",
    "label": "Kabir Deshmukh",
    "value": "Kabir Deshmukh",
    "canonicalName": "Kabir Deshmukh",
    "aliases": [
      "Alias_Kabir",
      "Shadow_32"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "Tamil Nadu",
    "district": "Chennai",
    "jurisdictions": [
      {
        "state": "Tamil Nadu",
        "district": "Chennai"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-0326",
    "aadhaarStatus": "VERHOEFF_VALID",
    "summary": "Subject of interest in Tamil Nadu. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-0326"
      },
      {
        "kind": "State",
        "value": "Tamil Nadu"
      },
      {
        "kind": "District",
        "value": "Chennai"
      }
    ]
  },
  "P033": {
    "id": "P033",
    "type": "person",
    "label": "Tarun Chawla",
    "value": "Tarun Chawla",
    "canonicalName": "Tarun Chawla",
    "aliases": [
      "Alias_Tarun",
      "Shadow_33"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "Maharashtra",
    "district": "Pune",
    "jurisdictions": [
      {
        "state": "Maharashtra",
        "district": "Pune"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-0338",
    "aadhaarStatus": "VERHOEFF_VALID",
    "summary": "Subject of interest in Maharashtra. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-0338"
      },
      {
        "kind": "State",
        "value": "Maharashtra"
      },
      {
        "kind": "District",
        "value": "Pune"
      }
    ]
  },
  "P034": {
    "id": "P034",
    "type": "person",
    "label": "Bhavna Agarwal",
    "value": "Bhavna Agarwal",
    "canonicalName": "Bhavna Agarwal",
    "aliases": [
      "Alias_Bhavna",
      "Shadow_34"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "Gujarat",
    "district": "Ahmedabad",
    "jurisdictions": [
      {
        "state": "Gujarat",
        "district": "Ahmedabad"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-0344",
    "aadhaarStatus": "VERHOEFF_VALID",
    "summary": "Subject of interest in Gujarat. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-0344"
      },
      {
        "kind": "State",
        "value": "Gujarat"
      },
      {
        "kind": "District",
        "value": "Ahmedabad"
      }
    ]
  },
  "P035": {
    "id": "P035",
    "type": "person",
    "label": "Vishal Bhatnagar",
    "value": "Vishal Bhatnagar",
    "canonicalName": "Vishal Bhatnagar",
    "aliases": [
      "Alias_Vishal",
      "Shadow_35"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "Uttar Pradesh",
    "district": "Lucknow",
    "jurisdictions": [
      {
        "state": "Uttar Pradesh",
        "district": "Lucknow"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-0356",
    "aadhaarStatus": "VERHOEFF_VALID",
    "summary": "Subject of interest in Uttar Pradesh. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-0356"
      },
      {
        "kind": "State",
        "value": "Uttar Pradesh"
      },
      {
        "kind": "District",
        "value": "Lucknow"
      }
    ]
  },
  "P036": {
    "id": "P036",
    "type": "person",
    "label": "Yash Iyer",
    "value": "Yash Iyer",
    "canonicalName": "Yash Iyer",
    "aliases": [
      "Alias_Yash",
      "Shadow_36"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "Rajasthan",
    "district": "Jaipur",
    "jurisdictions": [
      {
        "state": "Rajasthan",
        "district": "Jaipur"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-0365",
    "aadhaarStatus": "VERHOEFF_VALID",
    "summary": "Subject of interest in Rajasthan. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-0365"
      },
      {
        "kind": "State",
        "value": "Rajasthan"
      },
      {
        "kind": "District",
        "value": "Jaipur"
      }
    ]
  },
  "P037": {
    "id": "P037",
    "type": "person",
    "label": "Sneha Choudhury",
    "value": "Sneha Choudhury",
    "canonicalName": "Sneha Choudhury",
    "aliases": [
      "Alias_Sneha",
      "Shadow_37"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "Punjab",
    "district": "Chandigarh",
    "jurisdictions": [
      {
        "state": "Punjab",
        "district": "Chandigarh"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-0370",
    "aadhaarStatus": "VERHOEFF_VALID",
    "summary": "Subject of interest in Punjab. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-0370"
      },
      {
        "kind": "State",
        "value": "Punjab"
      },
      {
        "kind": "District",
        "value": "Chandigarh"
      }
    ]
  },
  "P038": {
    "id": "P038",
    "type": "person",
    "label": "Nitin Saxena",
    "value": "Nitin Saxena",
    "canonicalName": "Nitin Saxena",
    "aliases": [
      "Alias_Nitin",
      "Shadow_38"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "Rajasthan",
    "district": "Jaipur",
    "jurisdictions": [
      {
        "state": "Rajasthan",
        "district": "Jaipur"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-0381",
    "aadhaarStatus": "VERHOEFF_VALID",
    "summary": "Subject of interest in Rajasthan. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-0381"
      },
      {
        "kind": "State",
        "value": "Rajasthan"
      },
      {
        "kind": "District",
        "value": "Jaipur"
      }
    ]
  },
  "P039": {
    "id": "P039",
    "type": "person",
    "label": "Mohit Kapoor",
    "value": "Mohit Kapoor",
    "canonicalName": "Mohit Kapoor",
    "aliases": [
      "Alias_Mohit",
      "Shadow_39"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "Kerala",
    "district": "Ernakulam",
    "jurisdictions": [
      {
        "state": "Kerala",
        "district": "Ernakulam"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-0398",
    "aadhaarStatus": "VERHOEFF_VALID",
    "summary": "Subject of interest in Kerala. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-0398"
      },
      {
        "kind": "State",
        "value": "Kerala"
      },
      {
        "kind": "District",
        "value": "Ernakulam"
      }
    ]
  },
  "P040": {
    "id": "P040",
    "type": "person",
    "label": "Ashok Mishra",
    "value": "Ashok Mishra",
    "canonicalName": "Ashok Mishra",
    "aliases": [
      "Alias_Ashok",
      "Shadow_40"
    ],
    "confidence": 92,
    "confidenceBand": "HIGH",
    "state": "West Bengal",
    "district": "North 24 Parganas",
    "jurisdictions": [
      {
        "state": "West Bengal",
        "district": "North 24 Parganas"
      }
    ],
    "aadhaarMasked": "XXXX-XXXX-0407",
    "aadhaarStatus": "VERHOEFF_VALID",
    "summary": "Subject of interest in West Bengal. Notes: Synthetic profile for investigation simulation",
    "identifiers": [
      {
        "kind": "Aadhaar (Masked)",
        "value": "XXXX-XXXX-0407"
      },
      {
        "kind": "State",
        "value": "West Bengal"
      },
      {
        "kind": "District",
        "value": "North 24 Parganas"
      }
    ]
  },
  "PH001": {
    "id": "PH001",
    "type": "phone",
    "label": "+919863551839",
    "value": "+919863551839",
    "carrier": "Vi",
    "registeredName": "Aarav Sharma",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (Vi) registered to Aarav Sharma. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919863551839"
      },
      {
        "kind": "Carrier",
        "value": "Vi"
      },
      {
        "kind": "Subscriber",
        "value": "Aarav Sharma"
      }
    ]
  },
  "PH002": {
    "id": "PH002",
    "type": "phone",
    "label": "+919868800797",
    "value": "+919868800797",
    "carrier": "BSNL",
    "registeredName": "Aditya Verma",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (BSNL) registered to Aditya Verma. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919868800797"
      },
      {
        "kind": "Carrier",
        "value": "BSNL"
      },
      {
        "kind": "Subscriber",
        "value": "Aditya Verma"
      }
    ]
  },
  "PH003": {
    "id": "PH003",
    "type": "phone",
    "label": "+919826240908",
    "value": "+919826240908",
    "carrier": "Jio",
    "registeredName": "Rohan Gupta",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (Jio) registered to Rohan Gupta. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919826240908"
      },
      {
        "kind": "Carrier",
        "value": "Jio"
      },
      {
        "kind": "Subscriber",
        "value": "Rohan Gupta"
      }
    ]
  },
  "PH004": {
    "id": "PH004",
    "type": "phone",
    "label": "+919840158366",
    "value": "+919840158366",
    "carrier": "Airtel",
    "registeredName": "Vikram Patel",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (Airtel) registered to Vikram Patel. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919840158366"
      },
      {
        "kind": "Carrier",
        "value": "Airtel"
      },
      {
        "kind": "Subscriber",
        "value": "Vikram Patel"
      }
    ]
  },
  "PH005": {
    "id": "PH005",
    "type": "phone",
    "label": "+919855377076",
    "value": "+919855377076",
    "carrier": "Airtel",
    "registeredName": "Karan Singh",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (Airtel) registered to Karan Singh. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919855377076"
      },
      {
        "kind": "Carrier",
        "value": "Airtel"
      },
      {
        "kind": "Subscriber",
        "value": "Karan Singh"
      }
    ]
  },
  "PH006": {
    "id": "PH006",
    "type": "phone",
    "label": "+919888961459",
    "value": "+919888961459",
    "carrier": "Jio",
    "registeredName": "Siddharth Kumar",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (Jio) registered to Siddharth Kumar. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919888961459"
      },
      {
        "kind": "Carrier",
        "value": "Jio"
      },
      {
        "kind": "Subscriber",
        "value": "Siddharth Kumar"
      }
    ]
  },
  "PH007": {
    "id": "PH007",
    "type": "phone",
    "label": "+919888979095",
    "value": "+919888979095",
    "carrier": "Jio",
    "registeredName": "Priya Reddy",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (Jio) registered to Priya Reddy. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919888979095"
      },
      {
        "kind": "Carrier",
        "value": "Jio"
      },
      {
        "kind": "Subscriber",
        "value": "Priya Reddy"
      }
    ]
  },
  "PH008": {
    "id": "PH008",
    "type": "phone",
    "label": "+919810965138",
    "value": "+919810965138",
    "carrier": "Airtel",
    "registeredName": "Ananya Rao",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (Airtel) registered to Ananya Rao. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919810965138"
      },
      {
        "kind": "Carrier",
        "value": "Airtel"
      },
      {
        "kind": "Subscriber",
        "value": "Ananya Rao"
      }
    ]
  },
  "PH009": {
    "id": "PH009",
    "type": "phone",
    "label": "+919894705205",
    "value": "+919894705205",
    "carrier": "Airtel",
    "registeredName": "Rajesh Joshi",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (Airtel) registered to Rajesh Joshi. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919894705205"
      },
      {
        "kind": "Carrier",
        "value": "Airtel"
      },
      {
        "kind": "Subscriber",
        "value": "Rajesh Joshi"
      }
    ]
  },
  "PH010": {
    "id": "PH010",
    "type": "phone",
    "label": "+919840728046",
    "value": "+919840728046",
    "carrier": "Airtel",
    "registeredName": "Suresh Nair",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (Airtel) registered to Suresh Nair. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919840728046"
      },
      {
        "kind": "Carrier",
        "value": "Airtel"
      },
      {
        "kind": "Subscriber",
        "value": "Suresh Nair"
      }
    ]
  },
  "PH011": {
    "id": "PH011",
    "type": "phone",
    "label": "+919814216175",
    "value": "+919814216175",
    "carrier": "Vi",
    "registeredName": "Meera Mehta",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (Vi) registered to Meera Mehta. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919814216175"
      },
      {
        "kind": "Carrier",
        "value": "Vi"
      },
      {
        "kind": "Subscriber",
        "value": "Meera Mehta"
      }
    ]
  },
  "PH012": {
    "id": "PH012",
    "type": "phone",
    "label": "+919819510312",
    "value": "+919819510312",
    "carrier": "Jio",
    "registeredName": "Deepak Deshmukh",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (Jio) registered to Deepak Deshmukh. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919819510312"
      },
      {
        "kind": "Carrier",
        "value": "Jio"
      },
      {
        "kind": "Subscriber",
        "value": "Deepak Deshmukh"
      }
    ]
  },
  "PH013": {
    "id": "PH013",
    "type": "phone",
    "label": "+919847376585",
    "value": "+919847376585",
    "carrier": "BSNL",
    "registeredName": "Sunil Chawla",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (BSNL) registered to Sunil Chawla. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919847376585"
      },
      {
        "kind": "Carrier",
        "value": "BSNL"
      },
      {
        "kind": "Subscriber",
        "value": "Sunil Chawla"
      }
    ]
  },
  "PH014": {
    "id": "PH014",
    "type": "phone",
    "label": "+919838754377",
    "value": "+919838754377",
    "carrier": "Jio",
    "registeredName": "Manish Agarwal",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (Jio) registered to Manish Agarwal. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919838754377"
      },
      {
        "kind": "Carrier",
        "value": "Jio"
      },
      {
        "kind": "Subscriber",
        "value": "Manish Agarwal"
      }
    ]
  },
  "PH015": {
    "id": "PH015",
    "type": "phone",
    "label": "+919886644106",
    "value": "+919886644106",
    "carrier": "BSNL",
    "registeredName": "Pooja Bhatnagar",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (BSNL) registered to Pooja Bhatnagar. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919886644106"
      },
      {
        "kind": "Carrier",
        "value": "BSNL"
      },
      {
        "kind": "Subscriber",
        "value": "Pooja Bhatnagar"
      }
    ]
  },
  "PH016": {
    "id": "PH016",
    "type": "phone",
    "label": "+919842614537",
    "value": "+919842614537",
    "carrier": "BSNL",
    "registeredName": "Rahul Iyer",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (BSNL) registered to Rahul Iyer. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919842614537"
      },
      {
        "kind": "Carrier",
        "value": "BSNL"
      },
      {
        "kind": "Subscriber",
        "value": "Rahul Iyer"
      }
    ]
  },
  "PH017": {
    "id": "PH017",
    "type": "phone",
    "label": "+919864634663",
    "value": "+919864634663",
    "carrier": "Jio",
    "registeredName": "Vijay Choudhury",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (Jio) registered to Vijay Choudhury. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919864634663"
      },
      {
        "kind": "Carrier",
        "value": "Jio"
      },
      {
        "kind": "Subscriber",
        "value": "Vijay Choudhury"
      }
    ]
  },
  "PH018": {
    "id": "PH018",
    "type": "phone",
    "label": "+919822660194",
    "value": "+919822660194",
    "carrier": "Airtel",
    "registeredName": "Anita Saxena",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (Airtel) registered to Anita Saxena. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919822660194"
      },
      {
        "kind": "Carrier",
        "value": "Airtel"
      },
      {
        "kind": "Subscriber",
        "value": "Anita Saxena"
      }
    ]
  },
  "PH019": {
    "id": "PH019",
    "type": "phone",
    "label": "+919898447167",
    "value": "+919898447167",
    "carrier": "BSNL",
    "registeredName": "Nikhil Kapoor",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (BSNL) registered to Nikhil Kapoor. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919898447167"
      },
      {
        "kind": "Carrier",
        "value": "BSNL"
      },
      {
        "kind": "Subscriber",
        "value": "Nikhil Kapoor"
      }
    ]
  },
  "PH020": {
    "id": "PH020",
    "type": "phone",
    "label": "+919857553014",
    "value": "+919857553014",
    "carrier": "BSNL",
    "registeredName": "Amit Mishra",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (BSNL) registered to Amit Mishra. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919857553014"
      },
      {
        "kind": "Carrier",
        "value": "BSNL"
      },
      {
        "kind": "Subscriber",
        "value": "Amit Mishra"
      }
    ]
  },
  "PH021": {
    "id": "PH021",
    "type": "phone",
    "label": "+919865177213",
    "value": "+919865177213",
    "carrier": "BSNL",
    "registeredName": "Harish Sharma",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (BSNL) registered to Harish Sharma. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919865177213"
      },
      {
        "kind": "Carrier",
        "value": "BSNL"
      },
      {
        "kind": "Subscriber",
        "value": "Harish Sharma"
      }
    ]
  },
  "PH022": {
    "id": "PH022",
    "type": "phone",
    "label": "+919817270733",
    "value": "+919817270733",
    "carrier": "Airtel",
    "registeredName": "Sanjay Verma",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (Airtel) registered to Sanjay Verma. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919817270733"
      },
      {
        "kind": "Carrier",
        "value": "Airtel"
      },
      {
        "kind": "Subscriber",
        "value": "Sanjay Verma"
      }
    ]
  },
  "PH023": {
    "id": "PH023",
    "type": "phone",
    "label": "+919818135295",
    "value": "+919818135295",
    "carrier": "BSNL",
    "registeredName": "Ramesh Gupta",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (BSNL) registered to Ramesh Gupta. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919818135295"
      },
      {
        "kind": "Carrier",
        "value": "BSNL"
      },
      {
        "kind": "Subscriber",
        "value": "Ramesh Gupta"
      }
    ]
  },
  "PH024": {
    "id": "PH024",
    "type": "phone",
    "label": "+919855540424",
    "value": "+919855540424",
    "carrier": "Airtel",
    "registeredName": "Gautam Patel",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (Airtel) registered to Gautam Patel. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919855540424"
      },
      {
        "kind": "Carrier",
        "value": "Airtel"
      },
      {
        "kind": "Subscriber",
        "value": "Gautam Patel"
      }
    ]
  },
  "PH025": {
    "id": "PH025",
    "type": "phone",
    "label": "+919843374088",
    "value": "+919843374088",
    "carrier": "Jio",
    "registeredName": "Neha Singh",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (Jio) registered to Neha Singh. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919843374088"
      },
      {
        "kind": "Carrier",
        "value": "Jio"
      },
      {
        "kind": "Subscriber",
        "value": "Neha Singh"
      }
    ]
  },
  "PH026": {
    "id": "PH026",
    "type": "phone",
    "label": "+919835529407",
    "value": "+919835529407",
    "carrier": "BSNL",
    "registeredName": "Divya Kumar",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (BSNL) registered to Divya Kumar. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919835529407"
      },
      {
        "kind": "Carrier",
        "value": "BSNL"
      },
      {
        "kind": "Subscriber",
        "value": "Divya Kumar"
      }
    ]
  },
  "PH027": {
    "id": "PH027",
    "type": "phone",
    "label": "+919828814949",
    "value": "+919828814949",
    "carrier": "BSNL",
    "registeredName": "Arjun Reddy",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (BSNL) registered to Arjun Reddy. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919828814949"
      },
      {
        "kind": "Carrier",
        "value": "BSNL"
      },
      {
        "kind": "Subscriber",
        "value": "Arjun Reddy"
      }
    ]
  },
  "PH028": {
    "id": "PH028",
    "type": "phone",
    "label": "+919834627347",
    "value": "+919834627347",
    "carrier": "Vi",
    "registeredName": "Preeti Rao",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (Vi) registered to Preeti Rao. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919834627347"
      },
      {
        "kind": "Carrier",
        "value": "Vi"
      },
      {
        "kind": "Subscriber",
        "value": "Preeti Rao"
      }
    ]
  },
  "PH029": {
    "id": "PH029",
    "type": "phone",
    "label": "+919872092888",
    "value": "+919872092888",
    "carrier": "Jio",
    "registeredName": "Alok Joshi",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (Jio) registered to Alok Joshi. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919872092888"
      },
      {
        "kind": "Carrier",
        "value": "Jio"
      },
      {
        "kind": "Subscriber",
        "value": "Alok Joshi"
      }
    ]
  },
  "PH030": {
    "id": "PH030",
    "type": "phone",
    "label": "+919820117988",
    "value": "+919820117988",
    "carrier": "BSNL",
    "registeredName": "Varun Nair",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (BSNL) registered to Varun Nair. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919820117988"
      },
      {
        "kind": "Carrier",
        "value": "BSNL"
      },
      {
        "kind": "Subscriber",
        "value": "Varun Nair"
      }
    ]
  },
  "PH031": {
    "id": "PH031",
    "type": "phone",
    "label": "+919883863413",
    "value": "+919883863413",
    "carrier": "Airtel",
    "registeredName": "Simran Mehta",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (Airtel) registered to Simran Mehta. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919883863413"
      },
      {
        "kind": "Carrier",
        "value": "Airtel"
      },
      {
        "kind": "Subscriber",
        "value": "Simran Mehta"
      }
    ]
  },
  "PH032": {
    "id": "PH032",
    "type": "phone",
    "label": "+919816789850",
    "value": "+919816789850",
    "carrier": "Airtel",
    "registeredName": "Kabir Deshmukh",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (Airtel) registered to Kabir Deshmukh. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919816789850"
      },
      {
        "kind": "Carrier",
        "value": "Airtel"
      },
      {
        "kind": "Subscriber",
        "value": "Kabir Deshmukh"
      }
    ]
  },
  "PH033": {
    "id": "PH033",
    "type": "phone",
    "label": "+919822517517",
    "value": "+919822517517",
    "carrier": "Jio",
    "registeredName": "Tarun Chawla",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (Jio) registered to Tarun Chawla. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919822517517"
      },
      {
        "kind": "Carrier",
        "value": "Jio"
      },
      {
        "kind": "Subscriber",
        "value": "Tarun Chawla"
      }
    ]
  },
  "PH034": {
    "id": "PH034",
    "type": "phone",
    "label": "+919832321899",
    "value": "+919832321899",
    "carrier": "BSNL",
    "registeredName": "Bhavna Agarwal",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (BSNL) registered to Bhavna Agarwal. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919832321899"
      },
      {
        "kind": "Carrier",
        "value": "BSNL"
      },
      {
        "kind": "Subscriber",
        "value": "Bhavna Agarwal"
      }
    ]
  },
  "PH035": {
    "id": "PH035",
    "type": "phone",
    "label": "+919875181648",
    "value": "+919875181648",
    "carrier": "BSNL",
    "registeredName": "Vishal Bhatnagar",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (BSNL) registered to Vishal Bhatnagar. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919875181648"
      },
      {
        "kind": "Carrier",
        "value": "BSNL"
      },
      {
        "kind": "Subscriber",
        "value": "Vishal Bhatnagar"
      }
    ]
  },
  "PH036": {
    "id": "PH036",
    "type": "phone",
    "label": "+919838688676",
    "value": "+919838688676",
    "carrier": "BSNL",
    "registeredName": "Yash Iyer",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (BSNL) registered to Yash Iyer. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919838688676"
      },
      {
        "kind": "Carrier",
        "value": "BSNL"
      },
      {
        "kind": "Subscriber",
        "value": "Yash Iyer"
      }
    ]
  },
  "PH037": {
    "id": "PH037",
    "type": "phone",
    "label": "+919817869910",
    "value": "+919817869910",
    "carrier": "Jio",
    "registeredName": "Sneha Choudhury",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (Jio) registered to Sneha Choudhury. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919817869910"
      },
      {
        "kind": "Carrier",
        "value": "Jio"
      },
      {
        "kind": "Subscriber",
        "value": "Sneha Choudhury"
      }
    ]
  },
  "PH038": {
    "id": "PH038",
    "type": "phone",
    "label": "+919860864911",
    "value": "+919860864911",
    "carrier": "Airtel",
    "registeredName": "Nitin Saxena",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (Airtel) registered to Nitin Saxena. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919860864911"
      },
      {
        "kind": "Carrier",
        "value": "Airtel"
      },
      {
        "kind": "Subscriber",
        "value": "Nitin Saxena"
      }
    ]
  },
  "PH039": {
    "id": "PH039",
    "type": "phone",
    "label": "+919862401521",
    "value": "+919862401521",
    "carrier": "Vi",
    "registeredName": "Mohit Kapoor",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (Vi) registered to Mohit Kapoor. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919862401521"
      },
      {
        "kind": "Carrier",
        "value": "Vi"
      },
      {
        "kind": "Subscriber",
        "value": "Mohit Kapoor"
      }
    ]
  },
  "PH040": {
    "id": "PH040",
    "type": "phone",
    "label": "+919871070189",
    "value": "+919871070189",
    "carrier": "Vi",
    "registeredName": "Ashok Mishra",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (Vi) registered to Ashok Mishra. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919871070189"
      },
      {
        "kind": "Carrier",
        "value": "Vi"
      },
      {
        "kind": "Subscriber",
        "value": "Ashok Mishra"
      }
    ]
  },
  "PH041": {
    "id": "PH041",
    "type": "phone",
    "label": "+919866775103",
    "value": "+919866775103",
    "carrier": "BSNL",
    "registeredName": "Aarav Sharma",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (BSNL) registered to Aarav Sharma. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919866775103"
      },
      {
        "kind": "Carrier",
        "value": "BSNL"
      },
      {
        "kind": "Subscriber",
        "value": "Aarav Sharma"
      }
    ]
  },
  "PH042": {
    "id": "PH042",
    "type": "phone",
    "label": "+919830776478",
    "value": "+919830776478",
    "carrier": "Jio",
    "registeredName": "Aditya Verma",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (Jio) registered to Aditya Verma. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919830776478"
      },
      {
        "kind": "Carrier",
        "value": "Jio"
      },
      {
        "kind": "Subscriber",
        "value": "Aditya Verma"
      }
    ]
  },
  "PH043": {
    "id": "PH043",
    "type": "phone",
    "label": "+919849823450",
    "value": "+919849823450",
    "carrier": "Jio",
    "registeredName": "Rohan Gupta",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (Jio) registered to Rohan Gupta. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919849823450"
      },
      {
        "kind": "Carrier",
        "value": "Jio"
      },
      {
        "kind": "Subscriber",
        "value": "Rohan Gupta"
      }
    ]
  },
  "PH044": {
    "id": "PH044",
    "type": "phone",
    "label": "+919817849494",
    "value": "+919817849494",
    "carrier": "Airtel",
    "registeredName": "Vikram Patel",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (Airtel) registered to Vikram Patel. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919817849494"
      },
      {
        "kind": "Carrier",
        "value": "Airtel"
      },
      {
        "kind": "Subscriber",
        "value": "Vikram Patel"
      }
    ]
  },
  "PH045": {
    "id": "PH045",
    "type": "phone",
    "label": "+919852091325",
    "value": "+919852091325",
    "carrier": "Airtel",
    "registeredName": "Karan Singh",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (Airtel) registered to Karan Singh. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919852091325"
      },
      {
        "kind": "Carrier",
        "value": "Airtel"
      },
      {
        "kind": "Subscriber",
        "value": "Karan Singh"
      }
    ]
  },
  "PH046": {
    "id": "PH046",
    "type": "phone",
    "label": "+919816729990",
    "value": "+919816729990",
    "carrier": "BSNL",
    "registeredName": "Siddharth Kumar",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (BSNL) registered to Siddharth Kumar. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919816729990"
      },
      {
        "kind": "Carrier",
        "value": "BSNL"
      },
      {
        "kind": "Subscriber",
        "value": "Siddharth Kumar"
      }
    ]
  },
  "PH047": {
    "id": "PH047",
    "type": "phone",
    "label": "+919877491435",
    "value": "+919877491435",
    "carrier": "Jio",
    "registeredName": "Priya Reddy",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (Jio) registered to Priya Reddy. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919877491435"
      },
      {
        "kind": "Carrier",
        "value": "Jio"
      },
      {
        "kind": "Subscriber",
        "value": "Priya Reddy"
      }
    ]
  },
  "PH048": {
    "id": "PH048",
    "type": "phone",
    "label": "+919817634247",
    "value": "+919817634247",
    "carrier": "Airtel",
    "registeredName": "Ananya Rao",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (Airtel) registered to Ananya Rao. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919817634247"
      },
      {
        "kind": "Carrier",
        "value": "Airtel"
      },
      {
        "kind": "Subscriber",
        "value": "Ananya Rao"
      }
    ]
  },
  "PH049": {
    "id": "PH049",
    "type": "phone",
    "label": "+919834941004",
    "value": "+919834941004",
    "carrier": "Airtel",
    "registeredName": "Rajesh Joshi",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (Airtel) registered to Rajesh Joshi. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919834941004"
      },
      {
        "kind": "Carrier",
        "value": "Airtel"
      },
      {
        "kind": "Subscriber",
        "value": "Rajesh Joshi"
      }
    ]
  },
  "PH050": {
    "id": "PH050",
    "type": "phone",
    "label": "+919889864260",
    "value": "+919889864260",
    "carrier": "Airtel",
    "registeredName": "Suresh Nair",
    "confidence": 88,
    "confidenceBand": "HIGH",
    "summary": "Mobile connection (Airtel) registered to Suresh Nair. Status: active.",
    "identifiers": [
      {
        "kind": "MSISDN",
        "value": "+919889864260"
      },
      {
        "kind": "Carrier",
        "value": "Airtel"
      },
      {
        "kind": "Subscriber",
        "value": "Suresh Nair"
      }
    ]
  },
  "V001": {
    "id": "V001",
    "type": "vehicle",
    "label": "DL07CB1475",
    "value": "DL07CB1475",
    "confidence": 90,
    "confidenceBand": "HIGH",
    "summary": "Tata Harrier (Black, SUV).",
    "identifiers": [
      {
        "kind": "Registration",
        "value": "DL07CB1475"
      },
      {
        "kind": "Type",
        "value": "SUV"
      },
      {
        "kind": "Make/Model",
        "value": "Tata Harrier"
      }
    ]
  },
  "V002": {
    "id": "V002",
    "type": "vehicle",
    "label": "DL06CX7624",
    "value": "DL06CX7624",
    "confidence": 90,
    "confidenceBand": "HIGH",
    "summary": "Mahindra Thar (Red, SUV).",
    "identifiers": [
      {
        "kind": "Registration",
        "value": "DL06CX7624"
      },
      {
        "kind": "Type",
        "value": "SUV"
      },
      {
        "kind": "Make/Model",
        "value": "Mahindra Thar"
      }
    ]
  },
  "V003": {
    "id": "V003",
    "type": "vehicle",
    "label": "DL08CA9751",
    "value": "DL08CA9751",
    "confidence": 90,
    "confidenceBand": "HIGH",
    "summary": "Maruti Swift (Silver, Sedan).",
    "identifiers": [
      {
        "kind": "Registration",
        "value": "DL08CA9751"
      },
      {
        "kind": "Type",
        "value": "Sedan"
      },
      {
        "kind": "Make/Model",
        "value": "Maruti Swift"
      }
    ]
  },
  "V004": {
    "id": "V004",
    "type": "vehicle",
    "label": "DL07CX1444",
    "value": "DL07CX1444",
    "confidence": 90,
    "confidenceBand": "HIGH",
    "summary": "Hyundai Creta (White, SUV).",
    "identifiers": [
      {
        "kind": "Registration",
        "value": "DL07CX1444"
      },
      {
        "kind": "Type",
        "value": "SUV"
      },
      {
        "kind": "Make/Model",
        "value": "Hyundai Creta"
      }
    ]
  },
  "V005": {
    "id": "V005",
    "type": "vehicle",
    "label": "DL11CB3223",
    "value": "DL11CB3223",
    "confidence": 90,
    "confidenceBand": "HIGH",
    "summary": "Hyundai Creta (White, SUV).",
    "identifiers": [
      {
        "kind": "Registration",
        "value": "DL11CB3223"
      },
      {
        "kind": "Type",
        "value": "SUV"
      },
      {
        "kind": "Make/Model",
        "value": "Hyundai Creta"
      }
    ]
  },
  "V006": {
    "id": "V006",
    "type": "vehicle",
    "label": "DL03CA5262",
    "value": "DL03CA5262",
    "confidence": 90,
    "confidenceBand": "HIGH",
    "summary": "Mahindra Thar (Red, SUV).",
    "identifiers": [
      {
        "kind": "Registration",
        "value": "DL03CA5262"
      },
      {
        "kind": "Type",
        "value": "SUV"
      },
      {
        "kind": "Make/Model",
        "value": "Mahindra Thar"
      }
    ]
  },
  "V007": {
    "id": "V007",
    "type": "vehicle",
    "label": "DL06CA8449",
    "value": "DL06CA8449",
    "confidence": 90,
    "confidenceBand": "HIGH",
    "summary": "Mahindra Thar (Red, SUV).",
    "identifiers": [
      {
        "kind": "Registration",
        "value": "DL06CA8449"
      },
      {
        "kind": "Type",
        "value": "SUV"
      },
      {
        "kind": "Make/Model",
        "value": "Mahindra Thar"
      }
    ]
  },
  "V008": {
    "id": "V008",
    "type": "vehicle",
    "label": "DL06CB5558",
    "value": "DL06CB5558",
    "confidence": 90,
    "confidenceBand": "HIGH",
    "summary": "Tata Harrier (Black, SUV).",
    "identifiers": [
      {
        "kind": "Registration",
        "value": "DL06CB5558"
      },
      {
        "kind": "Type",
        "value": "SUV"
      },
      {
        "kind": "Make/Model",
        "value": "Tata Harrier"
      }
    ]
  },
  "V009": {
    "id": "V009",
    "type": "vehicle",
    "label": "DL05CA8705",
    "value": "DL05CA8705",
    "confidence": 90,
    "confidenceBand": "HIGH",
    "summary": "Mahindra Thar (Red, SUV).",
    "identifiers": [
      {
        "kind": "Registration",
        "value": "DL05CA8705"
      },
      {
        "kind": "Type",
        "value": "SUV"
      },
      {
        "kind": "Make/Model",
        "value": "Mahindra Thar"
      }
    ]
  },
  "V010": {
    "id": "V010",
    "type": "vehicle",
    "label": "DL12CX1853",
    "value": "DL12CX1853",
    "confidence": 90,
    "confidenceBand": "HIGH",
    "summary": "Hyundai Creta (White, SUV).",
    "identifiers": [
      {
        "kind": "Registration",
        "value": "DL12CX1853"
      },
      {
        "kind": "Type",
        "value": "SUV"
      },
      {
        "kind": "Make/Model",
        "value": "Hyundai Creta"
      }
    ]
  },
  "V011": {
    "id": "V011",
    "type": "vehicle",
    "label": "DL04CX2124",
    "value": "DL04CX2124",
    "confidence": 90,
    "confidenceBand": "HIGH",
    "summary": "Tata Harrier (Black, SUV).",
    "identifiers": [
      {
        "kind": "Registration",
        "value": "DL04CX2124"
      },
      {
        "kind": "Type",
        "value": "SUV"
      },
      {
        "kind": "Make/Model",
        "value": "Tata Harrier"
      }
    ]
  },
  "V012": {
    "id": "V012",
    "type": "vehicle",
    "label": "DL01CA4266",
    "value": "DL01CA4266",
    "confidence": 90,
    "confidenceBand": "HIGH",
    "summary": "Hyundai Creta (White, SUV).",
    "identifiers": [
      {
        "kind": "Registration",
        "value": "DL01CA4266"
      },
      {
        "kind": "Type",
        "value": "SUV"
      },
      {
        "kind": "Make/Model",
        "value": "Hyundai Creta"
      }
    ]
  },
  "V013": {
    "id": "V013",
    "type": "vehicle",
    "label": "DL10CA4908",
    "value": "DL10CA4908",
    "confidence": 90,
    "confidenceBand": "HIGH",
    "summary": "Hyundai Creta (White, SUV).",
    "identifiers": [
      {
        "kind": "Registration",
        "value": "DL10CA4908"
      },
      {
        "kind": "Type",
        "value": "SUV"
      },
      {
        "kind": "Make/Model",
        "value": "Hyundai Creta"
      }
    ]
  },
  "V014": {
    "id": "V014",
    "type": "vehicle",
    "label": "DL08CX2874",
    "value": "DL08CX2874",
    "confidence": 90,
    "confidenceBand": "HIGH",
    "summary": "Maruti Swift (Silver, Sedan).",
    "identifiers": [
      {
        "kind": "Registration",
        "value": "DL08CX2874"
      },
      {
        "kind": "Type",
        "value": "Sedan"
      },
      {
        "kind": "Make/Model",
        "value": "Maruti Swift"
      }
    ]
  },
  "V015": {
    "id": "V015",
    "type": "vehicle",
    "label": "DL04CB5198",
    "value": "DL04CB5198",
    "confidence": 90,
    "confidenceBand": "HIGH",
    "summary": "Honda City (Grey, Sedan).",
    "identifiers": [
      {
        "kind": "Registration",
        "value": "DL04CB5198"
      },
      {
        "kind": "Type",
        "value": "Sedan"
      },
      {
        "kind": "Make/Model",
        "value": "Honda City"
      }
    ]
  },
  "V016": {
    "id": "V016",
    "type": "vehicle",
    "label": "DL03CX2876",
    "value": "DL03CX2876",
    "confidence": 90,
    "confidenceBand": "HIGH",
    "summary": "Tata Harrier (Black, SUV).",
    "identifiers": [
      {
        "kind": "Registration",
        "value": "DL03CX2876"
      },
      {
        "kind": "Type",
        "value": "SUV"
      },
      {
        "kind": "Make/Model",
        "value": "Tata Harrier"
      }
    ]
  },
  "V017": {
    "id": "V017",
    "type": "vehicle",
    "label": "DL05CA1420",
    "value": "DL05CA1420",
    "confidence": 90,
    "confidenceBand": "HIGH",
    "summary": "Maruti Swift (Silver, Sedan).",
    "identifiers": [
      {
        "kind": "Registration",
        "value": "DL05CA1420"
      },
      {
        "kind": "Type",
        "value": "Sedan"
      },
      {
        "kind": "Make/Model",
        "value": "Maruti Swift"
      }
    ]
  },
  "V018": {
    "id": "V018",
    "type": "vehicle",
    "label": "DL10CX7149",
    "value": "DL10CX7149",
    "confidence": 90,
    "confidenceBand": "HIGH",
    "summary": "Tata Harrier (Black, SUV).",
    "identifiers": [
      {
        "kind": "Registration",
        "value": "DL10CX7149"
      },
      {
        "kind": "Type",
        "value": "SUV"
      },
      {
        "kind": "Make/Model",
        "value": "Tata Harrier"
      }
    ]
  },
  "V019": {
    "id": "V019",
    "type": "vehicle",
    "label": "DL12CA2245",
    "value": "DL12CA2245",
    "confidence": 90,
    "confidenceBand": "HIGH",
    "summary": "Mahindra Thar (Red, SUV).",
    "identifiers": [
      {
        "kind": "Registration",
        "value": "DL12CA2245"
      },
      {
        "kind": "Type",
        "value": "SUV"
      },
      {
        "kind": "Make/Model",
        "value": "Mahindra Thar"
      }
    ]
  },
  "V020": {
    "id": "V020",
    "type": "vehicle",
    "label": "DL12CX4978",
    "value": "DL12CX4978",
    "confidence": 90,
    "confidenceBand": "HIGH",
    "summary": "Honda City (Grey, Sedan).",
    "identifiers": [
      {
        "kind": "Registration",
        "value": "DL12CX4978"
      },
      {
        "kind": "Type",
        "value": "Sedan"
      },
      {
        "kind": "Make/Model",
        "value": "Honda City"
      }
    ]
  },
  "ACC001": {
    "id": "ACC001",
    "type": "account",
    "label": "HDFC Bank •••• 8448",
    "value": "949102978448",
    "accountNumber": "949102978448",
    "bankName": "HDFC Bank",
    "ifsc": "HDFC0000123",
    "accountType": "Current",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "HDFC Bank Current (IFSC: HDFC0000123).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "949102978448"
      },
      {
        "kind": "Bank",
        "value": "HDFC Bank"
      },
      {
        "kind": "IFSC",
        "value": "HDFC0000123"
      }
    ]
  },
  "ACC002": {
    "id": "ACC002",
    "type": "account",
    "label": "HDFC Bank •••• 0992",
    "value": "961424120992",
    "accountNumber": "961424120992",
    "bankName": "HDFC Bank",
    "ifsc": "HDFC0000123",
    "accountType": "Savings",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "HDFC Bank Savings (IFSC: HDFC0000123).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "961424120992"
      },
      {
        "kind": "Bank",
        "value": "HDFC Bank"
      },
      {
        "kind": "IFSC",
        "value": "HDFC0000123"
      }
    ]
  },
  "ACC003": {
    "id": "ACC003",
    "type": "account",
    "label": "State Bank of India •••• 8680",
    "value": "570439558680",
    "accountNumber": "570439558680",
    "bankName": "State Bank of India",
    "ifsc": "SBIN0000789",
    "accountType": "Current",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "State Bank of India Current (IFSC: SBIN0000789).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "570439558680"
      },
      {
        "kind": "Bank",
        "value": "State Bank of India"
      },
      {
        "kind": "IFSC",
        "value": "SBIN0000789"
      }
    ]
  },
  "ACC004": {
    "id": "ACC004",
    "type": "account",
    "label": "HDFC Bank •••• 8886",
    "value": "810842688886",
    "accountNumber": "810842688886",
    "bankName": "HDFC Bank",
    "ifsc": "HDFC0000123",
    "accountType": "Current",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "HDFC Bank Current (IFSC: HDFC0000123).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "810842688886"
      },
      {
        "kind": "Bank",
        "value": "HDFC Bank"
      },
      {
        "kind": "IFSC",
        "value": "HDFC0000123"
      }
    ]
  },
  "ACC005": {
    "id": "ACC005",
    "type": "account",
    "label": "HDFC Bank •••• 0205",
    "value": "563210400205",
    "accountNumber": "563210400205",
    "bankName": "HDFC Bank",
    "ifsc": "HDFC0000123",
    "accountType": "Current",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "HDFC Bank Current (IFSC: HDFC0000123).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "563210400205"
      },
      {
        "kind": "Bank",
        "value": "HDFC Bank"
      },
      {
        "kind": "IFSC",
        "value": "HDFC0000123"
      }
    ]
  },
  "ACC006": {
    "id": "ACC006",
    "type": "account",
    "label": "HDFC Bank •••• 7725",
    "value": "797340287725",
    "accountNumber": "797340287725",
    "bankName": "HDFC Bank",
    "ifsc": "HDFC0000123",
    "accountType": "Current",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "HDFC Bank Current (IFSC: HDFC0000123).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "797340287725"
      },
      {
        "kind": "Bank",
        "value": "HDFC Bank"
      },
      {
        "kind": "IFSC",
        "value": "HDFC0000123"
      }
    ]
  },
  "ACC007": {
    "id": "ACC007",
    "type": "account",
    "label": "ICICI Bank •••• 1370",
    "value": "295143931370",
    "accountNumber": "295143931370",
    "bankName": "ICICI Bank",
    "ifsc": "ICIC0000456",
    "accountType": "Current",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "ICICI Bank Current (IFSC: ICIC0000456).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "295143931370"
      },
      {
        "kind": "Bank",
        "value": "ICICI Bank"
      },
      {
        "kind": "IFSC",
        "value": "ICIC0000456"
      }
    ]
  },
  "ACC008": {
    "id": "ACC008",
    "type": "account",
    "label": "Axis Bank •••• 7515",
    "value": "578737987515",
    "accountNumber": "578737987515",
    "bankName": "Axis Bank",
    "ifsc": "UTIB0000321",
    "accountType": "Current",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "Axis Bank Current (IFSC: UTIB0000321).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "578737987515"
      },
      {
        "kind": "Bank",
        "value": "Axis Bank"
      },
      {
        "kind": "IFSC",
        "value": "UTIB0000321"
      }
    ]
  },
  "ACC009": {
    "id": "ACC009",
    "type": "account",
    "label": "State Bank of India •••• 2512",
    "value": "369946052512",
    "accountNumber": "369946052512",
    "bankName": "State Bank of India",
    "ifsc": "SBIN0000789",
    "accountType": "Savings",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "State Bank of India Savings (IFSC: SBIN0000789).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "369946052512"
      },
      {
        "kind": "Bank",
        "value": "State Bank of India"
      },
      {
        "kind": "IFSC",
        "value": "SBIN0000789"
      }
    ]
  },
  "ACC010": {
    "id": "ACC010",
    "type": "account",
    "label": "State Bank of India •••• 6158",
    "value": "597707816158",
    "accountNumber": "597707816158",
    "bankName": "State Bank of India",
    "ifsc": "SBIN0000789",
    "accountType": "Savings",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "State Bank of India Savings (IFSC: SBIN0000789).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "597707816158"
      },
      {
        "kind": "Bank",
        "value": "State Bank of India"
      },
      {
        "kind": "IFSC",
        "value": "SBIN0000789"
      }
    ]
  },
  "ACC011": {
    "id": "ACC011",
    "type": "account",
    "label": "Axis Bank •••• 3766",
    "value": "772462383766",
    "accountNumber": "772462383766",
    "bankName": "Axis Bank",
    "ifsc": "UTIB0000321",
    "accountType": "Current",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "Axis Bank Current (IFSC: UTIB0000321).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "772462383766"
      },
      {
        "kind": "Bank",
        "value": "Axis Bank"
      },
      {
        "kind": "IFSC",
        "value": "UTIB0000321"
      }
    ]
  },
  "ACC012": {
    "id": "ACC012",
    "type": "account",
    "label": "State Bank of India •••• 4833",
    "value": "641289144833",
    "accountNumber": "641289144833",
    "bankName": "State Bank of India",
    "ifsc": "SBIN0000789",
    "accountType": "Current",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "State Bank of India Current (IFSC: SBIN0000789).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "641289144833"
      },
      {
        "kind": "Bank",
        "value": "State Bank of India"
      },
      {
        "kind": "IFSC",
        "value": "SBIN0000789"
      }
    ]
  },
  "ACC013": {
    "id": "ACC013",
    "type": "account",
    "label": "ICICI Bank •••• 5021",
    "value": "334022245021",
    "accountNumber": "334022245021",
    "bankName": "ICICI Bank",
    "ifsc": "ICIC0000456",
    "accountType": "Current",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "ICICI Bank Current (IFSC: ICIC0000456).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "334022245021"
      },
      {
        "kind": "Bank",
        "value": "ICICI Bank"
      },
      {
        "kind": "IFSC",
        "value": "ICIC0000456"
      }
    ]
  },
  "ACC014": {
    "id": "ACC014",
    "type": "account",
    "label": "State Bank of India •••• 2214",
    "value": "406404422214",
    "accountNumber": "406404422214",
    "bankName": "State Bank of India",
    "ifsc": "SBIN0000789",
    "accountType": "Current",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "State Bank of India Current (IFSC: SBIN0000789).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "406404422214"
      },
      {
        "kind": "Bank",
        "value": "State Bank of India"
      },
      {
        "kind": "IFSC",
        "value": "SBIN0000789"
      }
    ]
  },
  "ACC015": {
    "id": "ACC015",
    "type": "account",
    "label": "HDFC Bank •••• 4322",
    "value": "191014894322",
    "accountNumber": "191014894322",
    "bankName": "HDFC Bank",
    "ifsc": "HDFC0000123",
    "accountType": "Savings",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "HDFC Bank Savings (IFSC: HDFC0000123).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "191014894322"
      },
      {
        "kind": "Bank",
        "value": "HDFC Bank"
      },
      {
        "kind": "IFSC",
        "value": "HDFC0000123"
      }
    ]
  },
  "ACC016": {
    "id": "ACC016",
    "type": "account",
    "label": "Axis Bank •••• 1912",
    "value": "711983781912",
    "accountNumber": "711983781912",
    "bankName": "Axis Bank",
    "ifsc": "UTIB0000321",
    "accountType": "Savings",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "Axis Bank Savings (IFSC: UTIB0000321).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "711983781912"
      },
      {
        "kind": "Bank",
        "value": "Axis Bank"
      },
      {
        "kind": "IFSC",
        "value": "UTIB0000321"
      }
    ]
  },
  "ACC017": {
    "id": "ACC017",
    "type": "account",
    "label": "Axis Bank •••• 9683",
    "value": "884458179683",
    "accountNumber": "884458179683",
    "bankName": "Axis Bank",
    "ifsc": "UTIB0000321",
    "accountType": "Current",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "Axis Bank Current (IFSC: UTIB0000321).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "884458179683"
      },
      {
        "kind": "Bank",
        "value": "Axis Bank"
      },
      {
        "kind": "IFSC",
        "value": "UTIB0000321"
      }
    ]
  },
  "ACC018": {
    "id": "ACC018",
    "type": "account",
    "label": "Axis Bank •••• 9939",
    "value": "120585489939",
    "accountNumber": "120585489939",
    "bankName": "Axis Bank",
    "ifsc": "UTIB0000321",
    "accountType": "Savings",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "Axis Bank Savings (IFSC: UTIB0000321).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "120585489939"
      },
      {
        "kind": "Bank",
        "value": "Axis Bank"
      },
      {
        "kind": "IFSC",
        "value": "UTIB0000321"
      }
    ]
  },
  "ACC019": {
    "id": "ACC019",
    "type": "account",
    "label": "State Bank of India •••• 0796",
    "value": "543333380796",
    "accountNumber": "543333380796",
    "bankName": "State Bank of India",
    "ifsc": "SBIN0000789",
    "accountType": "Savings",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "State Bank of India Savings (IFSC: SBIN0000789).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "543333380796"
      },
      {
        "kind": "Bank",
        "value": "State Bank of India"
      },
      {
        "kind": "IFSC",
        "value": "SBIN0000789"
      }
    ]
  },
  "ACC020": {
    "id": "ACC020",
    "type": "account",
    "label": "State Bank of India •••• 6386",
    "value": "738506846386",
    "accountNumber": "738506846386",
    "bankName": "State Bank of India",
    "ifsc": "SBIN0000789",
    "accountType": "Current",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "State Bank of India Current (IFSC: SBIN0000789).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "738506846386"
      },
      {
        "kind": "Bank",
        "value": "State Bank of India"
      },
      {
        "kind": "IFSC",
        "value": "SBIN0000789"
      }
    ]
  },
  "ACC021": {
    "id": "ACC021",
    "type": "account",
    "label": "Axis Bank •••• 3190",
    "value": "682197733190",
    "accountNumber": "682197733190",
    "bankName": "Axis Bank",
    "ifsc": "UTIB0000321",
    "accountType": "Current",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "Axis Bank Current (IFSC: UTIB0000321).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "682197733190"
      },
      {
        "kind": "Bank",
        "value": "Axis Bank"
      },
      {
        "kind": "IFSC",
        "value": "UTIB0000321"
      }
    ]
  },
  "ACC022": {
    "id": "ACC022",
    "type": "account",
    "label": "Axis Bank •••• 5791",
    "value": "920324285791",
    "accountNumber": "920324285791",
    "bankName": "Axis Bank",
    "ifsc": "UTIB0000321",
    "accountType": "Current",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "Axis Bank Current (IFSC: UTIB0000321).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "920324285791"
      },
      {
        "kind": "Bank",
        "value": "Axis Bank"
      },
      {
        "kind": "IFSC",
        "value": "UTIB0000321"
      }
    ]
  },
  "ACC023": {
    "id": "ACC023",
    "type": "account",
    "label": "State Bank of India •••• 5339",
    "value": "601234945339",
    "accountNumber": "601234945339",
    "bankName": "State Bank of India",
    "ifsc": "SBIN0000789",
    "accountType": "Current",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "State Bank of India Current (IFSC: SBIN0000789).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "601234945339"
      },
      {
        "kind": "Bank",
        "value": "State Bank of India"
      },
      {
        "kind": "IFSC",
        "value": "SBIN0000789"
      }
    ]
  },
  "ACC024": {
    "id": "ACC024",
    "type": "account",
    "label": "State Bank of India •••• 1033",
    "value": "354482841033",
    "accountNumber": "354482841033",
    "bankName": "State Bank of India",
    "ifsc": "SBIN0000789",
    "accountType": "Savings",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "State Bank of India Savings (IFSC: SBIN0000789).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "354482841033"
      },
      {
        "kind": "Bank",
        "value": "State Bank of India"
      },
      {
        "kind": "IFSC",
        "value": "SBIN0000789"
      }
    ]
  },
  "ACC025": {
    "id": "ACC025",
    "type": "account",
    "label": "ICICI Bank •••• 6982",
    "value": "230204286982",
    "accountNumber": "230204286982",
    "bankName": "ICICI Bank",
    "ifsc": "ICIC0000456",
    "accountType": "Savings",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "ICICI Bank Savings (IFSC: ICIC0000456).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "230204286982"
      },
      {
        "kind": "Bank",
        "value": "ICICI Bank"
      },
      {
        "kind": "IFSC",
        "value": "ICIC0000456"
      }
    ]
  },
  "ACC026": {
    "id": "ACC026",
    "type": "account",
    "label": "ICICI Bank •••• 3898",
    "value": "912678183898",
    "accountNumber": "912678183898",
    "bankName": "ICICI Bank",
    "ifsc": "ICIC0000456",
    "accountType": "Current",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "ICICI Bank Current (IFSC: ICIC0000456).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "912678183898"
      },
      {
        "kind": "Bank",
        "value": "ICICI Bank"
      },
      {
        "kind": "IFSC",
        "value": "ICIC0000456"
      }
    ]
  },
  "ACC027": {
    "id": "ACC027",
    "type": "account",
    "label": "State Bank of India •••• 3267",
    "value": "747357163267",
    "accountNumber": "747357163267",
    "bankName": "State Bank of India",
    "ifsc": "SBIN0000789",
    "accountType": "Current",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "State Bank of India Current (IFSC: SBIN0000789).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "747357163267"
      },
      {
        "kind": "Bank",
        "value": "State Bank of India"
      },
      {
        "kind": "IFSC",
        "value": "SBIN0000789"
      }
    ]
  },
  "ACC028": {
    "id": "ACC028",
    "type": "account",
    "label": "HDFC Bank •••• 9095",
    "value": "314029509095",
    "accountNumber": "314029509095",
    "bankName": "HDFC Bank",
    "ifsc": "HDFC0000123",
    "accountType": "Current",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "HDFC Bank Current (IFSC: HDFC0000123).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "314029509095"
      },
      {
        "kind": "Bank",
        "value": "HDFC Bank"
      },
      {
        "kind": "IFSC",
        "value": "HDFC0000123"
      }
    ]
  },
  "ACC029": {
    "id": "ACC029",
    "type": "account",
    "label": "ICICI Bank •••• 0706",
    "value": "294823500706",
    "accountNumber": "294823500706",
    "bankName": "ICICI Bank",
    "ifsc": "ICIC0000456",
    "accountType": "Current",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "ICICI Bank Current (IFSC: ICIC0000456).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "294823500706"
      },
      {
        "kind": "Bank",
        "value": "ICICI Bank"
      },
      {
        "kind": "IFSC",
        "value": "ICIC0000456"
      }
    ]
  },
  "ACC030": {
    "id": "ACC030",
    "type": "account",
    "label": "HDFC Bank •••• 8494",
    "value": "687156468494",
    "accountNumber": "687156468494",
    "bankName": "HDFC Bank",
    "ifsc": "HDFC0000123",
    "accountType": "Savings",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "HDFC Bank Savings (IFSC: HDFC0000123).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "687156468494"
      },
      {
        "kind": "Bank",
        "value": "HDFC Bank"
      },
      {
        "kind": "IFSC",
        "value": "HDFC0000123"
      }
    ]
  },
  "ACC031": {
    "id": "ACC031",
    "type": "account",
    "label": "State Bank of India •••• 6198",
    "value": "705824576198",
    "accountNumber": "705824576198",
    "bankName": "State Bank of India",
    "ifsc": "SBIN0000789",
    "accountType": "Current",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "State Bank of India Current (IFSC: SBIN0000789).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "705824576198"
      },
      {
        "kind": "Bank",
        "value": "State Bank of India"
      },
      {
        "kind": "IFSC",
        "value": "SBIN0000789"
      }
    ]
  },
  "ACC032": {
    "id": "ACC032",
    "type": "account",
    "label": "ICICI Bank •••• 9762",
    "value": "640104129762",
    "accountNumber": "640104129762",
    "bankName": "ICICI Bank",
    "ifsc": "ICIC0000456",
    "accountType": "Savings",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "ICICI Bank Savings (IFSC: ICIC0000456).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "640104129762"
      },
      {
        "kind": "Bank",
        "value": "ICICI Bank"
      },
      {
        "kind": "IFSC",
        "value": "ICIC0000456"
      }
    ]
  },
  "ACC033": {
    "id": "ACC033",
    "type": "account",
    "label": "HDFC Bank •••• 2379",
    "value": "411703232379",
    "accountNumber": "411703232379",
    "bankName": "HDFC Bank",
    "ifsc": "HDFC0000123",
    "accountType": "Current",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "HDFC Bank Current (IFSC: HDFC0000123).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "411703232379"
      },
      {
        "kind": "Bank",
        "value": "HDFC Bank"
      },
      {
        "kind": "IFSC",
        "value": "HDFC0000123"
      }
    ]
  },
  "ACC034": {
    "id": "ACC034",
    "type": "account",
    "label": "Axis Bank •••• 3855",
    "value": "475553953855",
    "accountNumber": "475553953855",
    "bankName": "Axis Bank",
    "ifsc": "UTIB0000321",
    "accountType": "Savings",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "Axis Bank Savings (IFSC: UTIB0000321).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "475553953855"
      },
      {
        "kind": "Bank",
        "value": "Axis Bank"
      },
      {
        "kind": "IFSC",
        "value": "UTIB0000321"
      }
    ]
  },
  "ACC035": {
    "id": "ACC035",
    "type": "account",
    "label": "HDFC Bank •••• 2060",
    "value": "627687082060",
    "accountNumber": "627687082060",
    "bankName": "HDFC Bank",
    "ifsc": "HDFC0000123",
    "accountType": "Savings",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "HDFC Bank Savings (IFSC: HDFC0000123).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "627687082060"
      },
      {
        "kind": "Bank",
        "value": "HDFC Bank"
      },
      {
        "kind": "IFSC",
        "value": "HDFC0000123"
      }
    ]
  },
  "ACC036": {
    "id": "ACC036",
    "type": "account",
    "label": "HDFC Bank •••• 7347",
    "value": "638591937347",
    "accountNumber": "638591937347",
    "bankName": "HDFC Bank",
    "ifsc": "HDFC0000123",
    "accountType": "Savings",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "HDFC Bank Savings (IFSC: HDFC0000123).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "638591937347"
      },
      {
        "kind": "Bank",
        "value": "HDFC Bank"
      },
      {
        "kind": "IFSC",
        "value": "HDFC0000123"
      }
    ]
  },
  "ACC037": {
    "id": "ACC037",
    "type": "account",
    "label": "HDFC Bank •••• 9795",
    "value": "263860419795",
    "accountNumber": "263860419795",
    "bankName": "HDFC Bank",
    "ifsc": "HDFC0000123",
    "accountType": "Current",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "HDFC Bank Current (IFSC: HDFC0000123).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "263860419795"
      },
      {
        "kind": "Bank",
        "value": "HDFC Bank"
      },
      {
        "kind": "IFSC",
        "value": "HDFC0000123"
      }
    ]
  },
  "ACC038": {
    "id": "ACC038",
    "type": "account",
    "label": "HDFC Bank •••• 5492",
    "value": "374851785492",
    "accountNumber": "374851785492",
    "bankName": "HDFC Bank",
    "ifsc": "HDFC0000123",
    "accountType": "Savings",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "HDFC Bank Savings (IFSC: HDFC0000123).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "374851785492"
      },
      {
        "kind": "Bank",
        "value": "HDFC Bank"
      },
      {
        "kind": "IFSC",
        "value": "HDFC0000123"
      }
    ]
  },
  "ACC039": {
    "id": "ACC039",
    "type": "account",
    "label": "Axis Bank •••• 3467",
    "value": "755439143467",
    "accountNumber": "755439143467",
    "bankName": "Axis Bank",
    "ifsc": "UTIB0000321",
    "accountType": "Savings",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "Axis Bank Savings (IFSC: UTIB0000321).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "755439143467"
      },
      {
        "kind": "Bank",
        "value": "Axis Bank"
      },
      {
        "kind": "IFSC",
        "value": "UTIB0000321"
      }
    ]
  },
  "ACC040": {
    "id": "ACC040",
    "type": "account",
    "label": "Axis Bank •••• 6734",
    "value": "428318986734",
    "accountNumber": "428318986734",
    "bankName": "Axis Bank",
    "ifsc": "UTIB0000321",
    "accountType": "Current",
    "confidence": 96,
    "confidenceBand": "HIGH",
    "summary": "Axis Bank Current (IFSC: UTIB0000321).",
    "identifiers": [
      {
        "kind": "Account Number",
        "value": "428318986734"
      },
      {
        "kind": "Bank",
        "value": "Axis Bank"
      },
      {
        "kind": "IFSC",
        "value": "UTIB0000321"
      }
    ]
  },
  "FIR001": {
    "id": "FIR001",
    "type": "case",
    "label": "FIR/2026/0001",
    "value": "FIR/2026/0001",
    "confidence": 97,
    "confidenceBand": "HIGH",
    "summary": "Reported case of financial fraud involving subject P004 (Vikram Patel) under Connaught Place PS jurisdiction.",
    "jurisdictions": [
      {
        "state": "Delhi",
        "district": "New Delhi",
        "policeStation": "Connaught Place PS"
      }
    ],
    "identifiers": [
      {
        "kind": "FIR Number",
        "value": "FIR/2026/0001"
      },
      {
        "kind": "Crime Type",
        "value": "MONEY_LAUNDERING"
      },
      {
        "kind": "Police Station",
        "value": "Connaught Place PS"
      }
    ]
  },
  "FIR002": {
    "id": "FIR002",
    "type": "case",
    "label": "FIR/2026/0002",
    "value": "FIR/2026/0002",
    "confidence": 97,
    "confidenceBand": "HIGH",
    "summary": "Reported case of financial fraud under Bandra West PS jurisdiction.",
    "jurisdictions": [
      {
        "state": "Maharashtra",
        "district": "Mumbai Suburban",
        "policeStation": "Bandra West PS"
      }
    ],
    "identifiers": [
      {
        "kind": "FIR Number",
        "value": "FIR/2026/0002"
      },
      {
        "kind": "Crime Type",
        "value": "FINANCIAL_FRAUD"
      },
      {
        "kind": "Police Station",
        "value": "Bandra West PS"
      }
    ]
  },
  "FIR003": {
    "id": "FIR003",
    "type": "case",
    "label": "FIR/2026/0003",
    "value": "FIR/2026/0003",
    "confidence": 97,
    "confidenceBand": "HIGH",
    "summary": "Reported case of cyber heist under Indiranagar PS jurisdiction.",
    "jurisdictions": [
      {
        "state": "Karnataka",
        "district": "Bengaluru Urban",
        "policeStation": "Indiranagar PS"
      }
    ],
    "identifiers": [
      {
        "kind": "FIR Number",
        "value": "FIR/2026/0003"
      },
      {
        "kind": "Crime Type",
        "value": "CYBER_HEIST"
      },
      {
        "kind": "Police Station",
        "value": "Indiranagar PS"
      }
    ]
  },
  "FIR004": {
    "id": "FIR004",
    "type": "case",
    "label": "FIR/2026/0004",
    "value": "FIR/2026/0004",
    "confidence": 97,
    "confidenceBand": "HIGH",
    "summary": "Reported case of car jacking under Park Street PS jurisdiction.",
    "jurisdictions": [
      {
        "state": "West Bengal",
        "district": "Kolkata",
        "policeStation": "Park Street PS"
      }
    ],
    "identifiers": [
      {
        "kind": "FIR Number",
        "value": "FIR/2026/0004"
      },
      {
        "kind": "Crime Type",
        "value": "CAR_JACKING"
      },
      {
        "kind": "Police Station",
        "value": "Park Street PS"
      }
    ]
  },
  "FIR005": {
    "id": "FIR005",
    "type": "case",
    "label": "FIR/2026/0005",
    "value": "FIR/2026/0005",
    "confidence": 97,
    "confidenceBand": "HIGH",
    "summary": "Reported case of money laundering under Cyber Crime PS Gurugram jurisdiction.",
    "jurisdictions": [
      {
        "state": "Haryana",
        "district": "Gurugram",
        "policeStation": "Cyber Crime PS Gurugram"
      }
    ],
    "identifiers": [
      {
        "kind": "FIR Number",
        "value": "FIR/2026/0005"
      },
      {
        "kind": "Crime Type",
        "value": "MONEY_LAUNDERING"
      },
      {
        "kind": "Police Station",
        "value": "Cyber Crime PS Gurugram"
      }
    ]
  },
  "FIR006": {
    "id": "FIR006",
    "type": "case",
    "label": "FIR/2026/0006",
    "value": "FIR/2026/0006",
    "confidence": 97,
    "confidenceBand": "HIGH",
    "summary": "Reported case of car jacking under Gachibowli PS jurisdiction.",
    "jurisdictions": [
      {
        "state": "Telangana",
        "district": "Hyderabad",
        "policeStation": "Gachibowli PS"
      }
    ],
    "identifiers": [
      {
        "kind": "FIR Number",
        "value": "FIR/2026/0006"
      },
      {
        "kind": "Crime Type",
        "value": "CAR_JACKING"
      },
      {
        "kind": "Police Station",
        "value": "Gachibowli PS"
      }
    ]
  },
  "FIR007": {
    "id": "FIR007",
    "type": "case",
    "label": "FIR/2026/0007",
    "value": "FIR/2026/0007",
    "confidence": 97,
    "confidenceBand": "HIGH",
    "summary": "Reported case of car jacking under Anna Nagar PS jurisdiction.",
    "jurisdictions": [
      {
        "state": "Tamil Nadu",
        "district": "Chennai",
        "policeStation": "Anna Nagar PS"
      }
    ],
    "identifiers": [
      {
        "kind": "FIR Number",
        "value": "FIR/2026/0007"
      },
      {
        "kind": "Crime Type",
        "value": "CAR_JACKING"
      },
      {
        "kind": "Police Station",
        "value": "Anna Nagar PS"
      }
    ]
  },
  "FIR008": {
    "id": "FIR008",
    "type": "case",
    "label": "FIR/2026/0008",
    "value": "FIR/2026/0008",
    "confidence": 97,
    "confidenceBand": "HIGH",
    "summary": "Reported case of money laundering under Deccan Gymkhana PS jurisdiction.",
    "jurisdictions": [
      {
        "state": "Maharashtra",
        "district": "Pune",
        "policeStation": "Deccan Gymkhana PS"
      }
    ],
    "identifiers": [
      {
        "kind": "FIR Number",
        "value": "FIR/2026/0008"
      },
      {
        "kind": "Crime Type",
        "value": "MONEY_LAUNDERING"
      },
      {
        "kind": "Police Station",
        "value": "Deccan Gymkhana PS"
      }
    ]
  },
  "FIR009": {
    "id": "FIR009",
    "type": "case",
    "label": "FIR/2026/0009",
    "value": "FIR/2026/0009",
    "confidence": 97,
    "confidenceBand": "HIGH",
    "summary": "Reported case of car jacking under Sarkhej PS jurisdiction.",
    "jurisdictions": [
      {
        "state": "Gujarat",
        "district": "Ahmedabad",
        "policeStation": "Sarkhej PS"
      }
    ],
    "identifiers": [
      {
        "kind": "FIR Number",
        "value": "FIR/2026/0009"
      },
      {
        "kind": "Crime Type",
        "value": "CAR_JACKING"
      },
      {
        "kind": "Police Station",
        "value": "Sarkhej PS"
      }
    ]
  },
  "FIR010": {
    "id": "FIR010",
    "type": "case",
    "label": "FIR/2026/0010",
    "value": "FIR/2026/0010",
    "confidence": 97,
    "confidenceBand": "HIGH",
    "summary": "Reported case of identity theft under Hazratganj PS jurisdiction.",
    "jurisdictions": [
      {
        "state": "Uttar Pradesh",
        "district": "Lucknow",
        "policeStation": "Hazratganj PS"
      }
    ],
    "identifiers": [
      {
        "kind": "FIR Number",
        "value": "FIR/2026/0010"
      },
      {
        "kind": "Crime Type",
        "value": "IDENTITY_THEFT"
      },
      {
        "kind": "Police Station",
        "value": "Hazratganj PS"
      }
    ]
  },
  "FIR011": {
    "id": "FIR011",
    "type": "case",
    "label": "FIR/2026/0011",
    "value": "FIR/2026/0011",
    "confidence": 97,
    "confidenceBand": "HIGH",
    "summary": "Reported case of hawala network under Vidhadhar Nagar PS jurisdiction.",
    "jurisdictions": [
      {
        "state": "Rajasthan",
        "district": "Jaipur",
        "policeStation": "Vidhadhar Nagar PS"
      }
    ],
    "identifiers": [
      {
        "kind": "FIR Number",
        "value": "FIR/2026/0011"
      },
      {
        "kind": "Crime Type",
        "value": "HAWALA_NETWORK"
      },
      {
        "kind": "Police Station",
        "value": "Vidhadhar Nagar PS"
      }
    ]
  },
  "FIR012": {
    "id": "FIR012",
    "type": "case",
    "label": "FIR/2026/0012",
    "value": "FIR/2026/0012",
    "confidence": 97,
    "confidenceBand": "HIGH",
    "summary": "Reported case of sim swap racket under Sector 17 PS jurisdiction.",
    "jurisdictions": [
      {
        "state": "Punjab",
        "district": "Chandigarh",
        "policeStation": "Sector 17 PS"
      }
    ],
    "identifiers": [
      {
        "kind": "FIR Number",
        "value": "FIR/2026/0012"
      },
      {
        "kind": "Crime Type",
        "value": "SIM_SWAP_RACKET"
      },
      {
        "kind": "Police Station",
        "value": "Sector 17 PS"
      }
    ]
  },
  "FIR013": {
    "id": "FIR013",
    "type": "case",
    "label": "FIR/2026/0013",
    "value": "FIR/2026/0013",
    "confidence": 97,
    "confidenceBand": "HIGH",
    "summary": "Reported case of money laundering under Bani Park PS jurisdiction.",
    "jurisdictions": [
      {
        "state": "Rajasthan",
        "district": "Jaipur",
        "policeStation": "Bani Park PS"
      }
    ],
    "identifiers": [
      {
        "kind": "FIR Number",
        "value": "FIR/2026/0013"
      },
      {
        "kind": "Crime Type",
        "value": "MONEY_LAUNDERING"
      },
      {
        "kind": "Police Station",
        "value": "Bani Park PS"
      }
    ]
  },
  "FIR014": {
    "id": "FIR014",
    "type": "case",
    "label": "FIR/2026/0014",
    "value": "FIR/2026/0014",
    "confidence": 97,
    "confidenceBand": "HIGH",
    "summary": "Reported case of hawala network under Central PS Kochi jurisdiction.",
    "jurisdictions": [
      {
        "state": "Kerala",
        "district": "Ernakulam",
        "policeStation": "Central PS Kochi"
      }
    ],
    "identifiers": [
      {
        "kind": "FIR Number",
        "value": "FIR/2026/0014"
      },
      {
        "kind": "Crime Type",
        "value": "HAWALA_NETWORK"
      },
      {
        "kind": "Police Station",
        "value": "Central PS Kochi"
      }
    ]
  },
  "FIR015": {
    "id": "FIR015",
    "type": "case",
    "label": "FIR/2026/0015",
    "value": "FIR/2026/0015",
    "confidence": 97,
    "confidenceBand": "HIGH",
    "summary": "Reported case of financial fraud under Bidhannagar PS jurisdiction.",
    "jurisdictions": [
      {
        "state": "West Bengal",
        "district": "North 24 Parganas",
        "policeStation": "Bidhannagar PS"
      }
    ],
    "identifiers": [
      {
        "kind": "FIR Number",
        "value": "FIR/2026/0015"
      },
      {
        "kind": "Crime Type",
        "value": "FINANCIAL_FRAUD"
      },
      {
        "kind": "Police Station",
        "value": "Bidhannagar PS"
      }
    ]
  },
  "FIR016": {
    "id": "FIR016",
    "type": "case",
    "label": "FIR/2026/0016",
    "value": "FIR/2026/0016",
    "confidence": 97,
    "confidenceBand": "HIGH",
    "summary": "Reported case of sim swap racket under Vashi PS jurisdiction.",
    "jurisdictions": [
      {
        "state": "Maharashtra",
        "district": "Thane",
        "policeStation": "Vashi PS"
      }
    ],
    "identifiers": [
      {
        "kind": "FIR Number",
        "value": "FIR/2026/0016"
      },
      {
        "kind": "Crime Type",
        "value": "SIM_SWAP_RACKET"
      },
      {
        "kind": "Police Station",
        "value": "Vashi PS"
      }
    ]
  },
  "FIR017": {
    "id": "FIR017",
    "type": "case",
    "label": "FIR/2026/0017",
    "value": "FIR/2026/0017",
    "confidence": 97,
    "confidenceBand": "HIGH",
    "summary": "Reported case of sim swap racket under Whitefield PS jurisdiction.",
    "jurisdictions": [
      {
        "state": "Karnataka",
        "district": "Bengaluru Urban",
        "policeStation": "Whitefield PS"
      }
    ],
    "identifiers": [
      {
        "kind": "FIR Number",
        "value": "FIR/2026/0017"
      },
      {
        "kind": "Crime Type",
        "value": "SIM_SWAP_RACKET"
      },
      {
        "kind": "Police Station",
        "value": "Whitefield PS"
      }
    ]
  },
  "FIR018": {
    "id": "FIR018",
    "type": "case",
    "label": "FIR/2026/0018",
    "value": "FIR/2026/0018",
    "confidence": 97,
    "confidenceBand": "HIGH",
    "summary": "Reported case of hawala network under Koramangala PS jurisdiction.",
    "jurisdictions": [
      {
        "state": "Karnataka",
        "district": "Bengaluru Urban",
        "policeStation": "Koramangala PS"
      }
    ],
    "identifiers": [
      {
        "kind": "FIR Number",
        "value": "FIR/2026/0018"
      },
      {
        "kind": "Crime Type",
        "value": "HAWALA_NETWORK"
      },
      {
        "kind": "Police Station",
        "value": "Koramangala PS"
      }
    ]
  },
  "FIR019": {
    "id": "FIR019",
    "type": "case",
    "label": "FIR/2026/0019",
    "value": "FIR/2026/0019",
    "confidence": 97,
    "confidenceBand": "HIGH",
    "summary": "Reported case of car jacking under Madhapur PS jurisdiction.",
    "jurisdictions": [
      {
        "state": "Telangana",
        "district": "Rangareddy",
        "policeStation": "Madhapur PS"
      }
    ],
    "identifiers": [
      {
        "kind": "FIR Number",
        "value": "FIR/2026/0019"
      },
      {
        "kind": "Crime Type",
        "value": "CAR_JACKING"
      },
      {
        "kind": "Police Station",
        "value": "Madhapur PS"
      }
    ]
  },
  "FIR020": {
    "id": "FIR020",
    "type": "case",
    "label": "FIR/2026/0020",
    "value": "FIR/2026/0020",
    "confidence": 97,
    "confidenceBand": "HIGH",
    "summary": "Reported case of sim swap racket under Juhu PS jurisdiction.",
    "jurisdictions": [
      {
        "state": "Maharashtra",
        "district": "Mumbai Suburban",
        "policeStation": "Juhu PS"
      }
    ],
    "identifiers": [
      {
        "kind": "FIR Number",
        "value": "FIR/2026/0020"
      },
      {
        "kind": "Crime Type",
        "value": "SIM_SWAP_RACKET"
      },
      {
        "kind": "Police Station",
        "value": "Juhu PS"
      }
    ]
  }
};

export const syntheticNodes: GraphNode[] = [
  {
    "id": "P001",
    "type": "person",
    "label": "Aarav Sharma",
    "sublabel": "New Delhi, Delhi",
    "val": 12
  },
  {
    "id": "P002",
    "type": "person",
    "label": "Aditya Verma",
    "sublabel": "Mumbai Suburban, Maharashtra",
    "val": 12
  },
  {
    "id": "P003",
    "type": "person",
    "label": "Rohan Gupta",
    "sublabel": "Bengaluru Urban, Karnataka",
    "val": 12
  },
  {
    "id": "P004",
    "type": "person",
    "label": "Vikram Patel",
    "sublabel": "Kolkata, West Bengal",
    "val": 12
  },
  {
    "id": "P005",
    "type": "person",
    "label": "Karan Singh",
    "sublabel": "Gurugram, Haryana",
    "val": 12
  },
  {
    "id": "P006",
    "type": "person",
    "label": "Siddharth Kumar",
    "sublabel": "Hyderabad, Telangana",
    "val": 12
  },
  {
    "id": "P007",
    "type": "person",
    "label": "Priya Reddy",
    "sublabel": "Chennai, Tamil Nadu",
    "val": 12
  },
  {
    "id": "P008",
    "type": "person",
    "label": "Ananya Rao",
    "sublabel": "Pune, Maharashtra",
    "val": 12
  },
  {
    "id": "P009",
    "type": "person",
    "label": "Rajesh Joshi",
    "sublabel": "Ahmedabad, Gujarat",
    "val": 12
  },
  {
    "id": "P010",
    "type": "person",
    "label": "Suresh Nair",
    "sublabel": "Lucknow, Uttar Pradesh",
    "val": 12
  },
  {
    "id": "P011",
    "type": "person",
    "label": "Meera Mehta",
    "sublabel": "Jaipur, Rajasthan",
    "val": 12
  },
  {
    "id": "P012",
    "type": "person",
    "label": "Deepak Deshmukh",
    "sublabel": "Chandigarh, Punjab",
    "val": 12
  },
  {
    "id": "P013",
    "type": "person",
    "label": "Sunil Chawla",
    "sublabel": "Jaipur, Rajasthan",
    "val": 12
  },
  {
    "id": "P014",
    "type": "person",
    "label": "Manish Agarwal",
    "sublabel": "Ernakulam, Kerala",
    "val": 12
  },
  {
    "id": "P015",
    "type": "person",
    "label": "Pooja Bhatnagar",
    "sublabel": "North 24 Parganas, West Bengal",
    "val": 12
  },
  {
    "id": "P016",
    "type": "person",
    "label": "Rahul Iyer",
    "sublabel": "Thane, Maharashtra",
    "val": 12
  },
  {
    "id": "P017",
    "type": "person",
    "label": "Vijay Choudhury",
    "sublabel": "Bengaluru Urban, Karnataka",
    "val": 12
  },
  {
    "id": "P018",
    "type": "person",
    "label": "Anita Saxena",
    "sublabel": "Bengaluru Urban, Karnataka",
    "val": 12
  },
  {
    "id": "P019",
    "type": "person",
    "label": "Nikhil Kapoor",
    "sublabel": "Rangareddy, Telangana",
    "val": 12
  },
  {
    "id": "P020",
    "type": "person",
    "label": "Amit Mishra",
    "sublabel": "Mumbai Suburban, Maharashtra",
    "val": 12
  },
  {
    "id": "P021",
    "type": "person",
    "label": "Harish Sharma",
    "sublabel": "South West Delhi, Delhi",
    "val": 12
  },
  {
    "id": "P022",
    "type": "person",
    "label": "Sanjay Verma",
    "sublabel": "Pune, Maharashtra",
    "val": 12
  },
  {
    "id": "P023",
    "type": "person",
    "label": "Ramesh Gupta",
    "sublabel": "Kolkata, West Bengal",
    "val": 12
  },
  {
    "id": "P024",
    "type": "person",
    "label": "Gautam Patel",
    "sublabel": "Chennai, Tamil Nadu",
    "val": 12
  },
  {
    "id": "P025",
    "type": "person",
    "label": "Neha Singh",
    "sublabel": "Chennai, Tamil Nadu",
    "val": 12
  },
  {
    "id": "P026",
    "type": "person",
    "label": "Divya Kumar",
    "sublabel": "New Delhi, Delhi",
    "val": 12
  },
  {
    "id": "P027",
    "type": "person",
    "label": "Arjun Reddy",
    "sublabel": "Mumbai Suburban, Maharashtra",
    "val": 12
  },
  {
    "id": "P028",
    "type": "person",
    "label": "Preeti Rao",
    "sublabel": "Bengaluru Urban, Karnataka",
    "val": 12
  },
  {
    "id": "P029",
    "type": "person",
    "label": "Alok Joshi",
    "sublabel": "Kolkata, West Bengal",
    "val": 12
  },
  {
    "id": "P030",
    "type": "person",
    "label": "Varun Nair",
    "sublabel": "Gurugram, Haryana",
    "val": 12
  },
  {
    "id": "P031",
    "type": "person",
    "label": "Simran Mehta",
    "sublabel": "Hyderabad, Telangana",
    "val": 12
  },
  {
    "id": "P032",
    "type": "person",
    "label": "Kabir Deshmukh",
    "sublabel": "Chennai, Tamil Nadu",
    "val": 12
  },
  {
    "id": "P033",
    "type": "person",
    "label": "Tarun Chawla",
    "sublabel": "Pune, Maharashtra",
    "val": 12
  },
  {
    "id": "P034",
    "type": "person",
    "label": "Bhavna Agarwal",
    "sublabel": "Ahmedabad, Gujarat",
    "val": 12
  },
  {
    "id": "P035",
    "type": "person",
    "label": "Vishal Bhatnagar",
    "sublabel": "Lucknow, Uttar Pradesh",
    "val": 12
  },
  {
    "id": "P036",
    "type": "person",
    "label": "Yash Iyer",
    "sublabel": "Jaipur, Rajasthan",
    "val": 12
  },
  {
    "id": "P037",
    "type": "person",
    "label": "Sneha Choudhury",
    "sublabel": "Chandigarh, Punjab",
    "val": 12
  },
  {
    "id": "P038",
    "type": "person",
    "label": "Nitin Saxena",
    "sublabel": "Jaipur, Rajasthan",
    "val": 12
  },
  {
    "id": "P039",
    "type": "person",
    "label": "Mohit Kapoor",
    "sublabel": "Ernakulam, Kerala",
    "val": 12
  },
  {
    "id": "P040",
    "type": "person",
    "label": "Ashok Mishra",
    "sublabel": "North 24 Parganas, West Bengal",
    "val": 12
  },
  {
    "id": "PH001",
    "type": "phone",
    "label": "+919863551839",
    "sublabel": "Vi (Aarav Sharma)",
    "val": 8
  },
  {
    "id": "PH002",
    "type": "phone",
    "label": "+919868800797",
    "sublabel": "BSNL (Aditya Verma)",
    "val": 8
  },
  {
    "id": "PH003",
    "type": "phone",
    "label": "+919826240908",
    "sublabel": "Jio (Rohan Gupta)",
    "val": 8
  },
  {
    "id": "PH004",
    "type": "phone",
    "label": "+919840158366",
    "sublabel": "Airtel (Vikram Patel)",
    "val": 8
  },
  {
    "id": "PH005",
    "type": "phone",
    "label": "+919855377076",
    "sublabel": "Airtel (Karan Singh)",
    "val": 8
  },
  {
    "id": "PH006",
    "type": "phone",
    "label": "+919888961459",
    "sublabel": "Jio (Siddharth Kumar)",
    "val": 8
  },
  {
    "id": "PH007",
    "type": "phone",
    "label": "+919888979095",
    "sublabel": "Jio (Priya Reddy)",
    "val": 8
  },
  {
    "id": "PH008",
    "type": "phone",
    "label": "+919810965138",
    "sublabel": "Airtel (Ananya Rao)",
    "val": 8
  },
  {
    "id": "PH009",
    "type": "phone",
    "label": "+919894705205",
    "sublabel": "Airtel (Rajesh Joshi)",
    "val": 8
  },
  {
    "id": "PH010",
    "type": "phone",
    "label": "+919840728046",
    "sublabel": "Airtel (Suresh Nair)",
    "val": 8
  },
  {
    "id": "PH011",
    "type": "phone",
    "label": "+919814216175",
    "sublabel": "Vi (Meera Mehta)",
    "val": 8
  },
  {
    "id": "PH012",
    "type": "phone",
    "label": "+919819510312",
    "sublabel": "Jio (Deepak Deshmukh)",
    "val": 8
  },
  {
    "id": "PH013",
    "type": "phone",
    "label": "+919847376585",
    "sublabel": "BSNL (Sunil Chawla)",
    "val": 8
  },
  {
    "id": "PH014",
    "type": "phone",
    "label": "+919838754377",
    "sublabel": "Jio (Manish Agarwal)",
    "val": 8
  },
  {
    "id": "PH015",
    "type": "phone",
    "label": "+919886644106",
    "sublabel": "BSNL (Pooja Bhatnagar)",
    "val": 8
  },
  {
    "id": "PH016",
    "type": "phone",
    "label": "+919842614537",
    "sublabel": "BSNL (Rahul Iyer)",
    "val": 8
  },
  {
    "id": "PH017",
    "type": "phone",
    "label": "+919864634663",
    "sublabel": "Jio (Vijay Choudhury)",
    "val": 8
  },
  {
    "id": "PH018",
    "type": "phone",
    "label": "+919822660194",
    "sublabel": "Airtel (Anita Saxena)",
    "val": 8
  },
  {
    "id": "PH019",
    "type": "phone",
    "label": "+919898447167",
    "sublabel": "BSNL (Nikhil Kapoor)",
    "val": 8
  },
  {
    "id": "PH020",
    "type": "phone",
    "label": "+919857553014",
    "sublabel": "BSNL (Amit Mishra)",
    "val": 8
  },
  {
    "id": "PH021",
    "type": "phone",
    "label": "+919865177213",
    "sublabel": "BSNL (Harish Sharma)",
    "val": 8
  },
  {
    "id": "PH022",
    "type": "phone",
    "label": "+919817270733",
    "sublabel": "Airtel (Sanjay Verma)",
    "val": 8
  },
  {
    "id": "PH023",
    "type": "phone",
    "label": "+919818135295",
    "sublabel": "BSNL (Ramesh Gupta)",
    "val": 8
  },
  {
    "id": "PH024",
    "type": "phone",
    "label": "+919855540424",
    "sublabel": "Airtel (Gautam Patel)",
    "val": 8
  },
  {
    "id": "PH025",
    "type": "phone",
    "label": "+919843374088",
    "sublabel": "Jio (Neha Singh)",
    "val": 8
  },
  {
    "id": "PH026",
    "type": "phone",
    "label": "+919835529407",
    "sublabel": "BSNL (Divya Kumar)",
    "val": 8
  },
  {
    "id": "PH027",
    "type": "phone",
    "label": "+919828814949",
    "sublabel": "BSNL (Arjun Reddy)",
    "val": 8
  },
  {
    "id": "PH028",
    "type": "phone",
    "label": "+919834627347",
    "sublabel": "Vi (Preeti Rao)",
    "val": 8
  },
  {
    "id": "PH029",
    "type": "phone",
    "label": "+919872092888",
    "sublabel": "Jio (Alok Joshi)",
    "val": 8
  },
  {
    "id": "PH030",
    "type": "phone",
    "label": "+919820117988",
    "sublabel": "BSNL (Varun Nair)",
    "val": 8
  },
  {
    "id": "PH031",
    "type": "phone",
    "label": "+919883863413",
    "sublabel": "Airtel (Simran Mehta)",
    "val": 8
  },
  {
    "id": "PH032",
    "type": "phone",
    "label": "+919816789850",
    "sublabel": "Airtel (Kabir Deshmukh)",
    "val": 8
  },
  {
    "id": "PH033",
    "type": "phone",
    "label": "+919822517517",
    "sublabel": "Jio (Tarun Chawla)",
    "val": 8
  },
  {
    "id": "PH034",
    "type": "phone",
    "label": "+919832321899",
    "sublabel": "BSNL (Bhavna Agarwal)",
    "val": 8
  },
  {
    "id": "PH035",
    "type": "phone",
    "label": "+919875181648",
    "sublabel": "BSNL (Vishal Bhatnagar)",
    "val": 8
  },
  {
    "id": "PH036",
    "type": "phone",
    "label": "+919838688676",
    "sublabel": "BSNL (Yash Iyer)",
    "val": 8
  },
  {
    "id": "PH037",
    "type": "phone",
    "label": "+919817869910",
    "sublabel": "Jio (Sneha Choudhury)",
    "val": 8
  },
  {
    "id": "PH038",
    "type": "phone",
    "label": "+919860864911",
    "sublabel": "Airtel (Nitin Saxena)",
    "val": 8
  },
  {
    "id": "PH039",
    "type": "phone",
    "label": "+919862401521",
    "sublabel": "Vi (Mohit Kapoor)",
    "val": 8
  },
  {
    "id": "PH040",
    "type": "phone",
    "label": "+919871070189",
    "sublabel": "Vi (Ashok Mishra)",
    "val": 8
  },
  {
    "id": "PH041",
    "type": "phone",
    "label": "+919866775103",
    "sublabel": "BSNL (Aarav Sharma)",
    "val": 8
  },
  {
    "id": "PH042",
    "type": "phone",
    "label": "+919830776478",
    "sublabel": "Jio (Aditya Verma)",
    "val": 8
  },
  {
    "id": "PH043",
    "type": "phone",
    "label": "+919849823450",
    "sublabel": "Jio (Rohan Gupta)",
    "val": 8
  },
  {
    "id": "PH044",
    "type": "phone",
    "label": "+919817849494",
    "sublabel": "Airtel (Vikram Patel)",
    "val": 8
  },
  {
    "id": "PH045",
    "type": "phone",
    "label": "+919852091325",
    "sublabel": "Airtel (Karan Singh)",
    "val": 8
  },
  {
    "id": "PH046",
    "type": "phone",
    "label": "+919816729990",
    "sublabel": "BSNL (Siddharth Kumar)",
    "val": 8
  },
  {
    "id": "PH047",
    "type": "phone",
    "label": "+919877491435",
    "sublabel": "Jio (Priya Reddy)",
    "val": 8
  },
  {
    "id": "PH048",
    "type": "phone",
    "label": "+919817634247",
    "sublabel": "Airtel (Ananya Rao)",
    "val": 8
  },
  {
    "id": "PH049",
    "type": "phone",
    "label": "+919834941004",
    "sublabel": "Airtel (Rajesh Joshi)",
    "val": 8
  },
  {
    "id": "PH050",
    "type": "phone",
    "label": "+919889864260",
    "sublabel": "Airtel (Suresh Nair)",
    "val": 8
  },
  {
    "id": "V001",
    "type": "vehicle",
    "label": "DL07CB1475",
    "sublabel": "Tata Harrier",
    "val": 9
  },
  {
    "id": "V002",
    "type": "vehicle",
    "label": "DL06CX7624",
    "sublabel": "Mahindra Thar",
    "val": 9
  },
  {
    "id": "V003",
    "type": "vehicle",
    "label": "DL08CA9751",
    "sublabel": "Maruti Swift",
    "val": 9
  },
  {
    "id": "V004",
    "type": "vehicle",
    "label": "DL07CX1444",
    "sublabel": "Hyundai Creta",
    "val": 9
  },
  {
    "id": "V005",
    "type": "vehicle",
    "label": "DL11CB3223",
    "sublabel": "Hyundai Creta",
    "val": 9
  },
  {
    "id": "V006",
    "type": "vehicle",
    "label": "DL03CA5262",
    "sublabel": "Mahindra Thar",
    "val": 9
  },
  {
    "id": "V007",
    "type": "vehicle",
    "label": "DL06CA8449",
    "sublabel": "Mahindra Thar",
    "val": 9
  },
  {
    "id": "V008",
    "type": "vehicle",
    "label": "DL06CB5558",
    "sublabel": "Tata Harrier",
    "val": 9
  },
  {
    "id": "V009",
    "type": "vehicle",
    "label": "DL05CA8705",
    "sublabel": "Mahindra Thar",
    "val": 9
  },
  {
    "id": "V010",
    "type": "vehicle",
    "label": "DL12CX1853",
    "sublabel": "Hyundai Creta",
    "val": 9
  },
  {
    "id": "V011",
    "type": "vehicle",
    "label": "DL04CX2124",
    "sublabel": "Tata Harrier",
    "val": 9
  },
  {
    "id": "V012",
    "type": "vehicle",
    "label": "DL01CA4266",
    "sublabel": "Hyundai Creta",
    "val": 9
  },
  {
    "id": "V013",
    "type": "vehicle",
    "label": "DL10CA4908",
    "sublabel": "Hyundai Creta",
    "val": 9
  },
  {
    "id": "V014",
    "type": "vehicle",
    "label": "DL08CX2874",
    "sublabel": "Maruti Swift",
    "val": 9
  },
  {
    "id": "V015",
    "type": "vehicle",
    "label": "DL04CB5198",
    "sublabel": "Honda City",
    "val": 9
  },
  {
    "id": "V016",
    "type": "vehicle",
    "label": "DL03CX2876",
    "sublabel": "Tata Harrier",
    "val": 9
  },
  {
    "id": "V017",
    "type": "vehicle",
    "label": "DL05CA1420",
    "sublabel": "Maruti Swift",
    "val": 9
  },
  {
    "id": "V018",
    "type": "vehicle",
    "label": "DL10CX7149",
    "sublabel": "Tata Harrier",
    "val": 9
  },
  {
    "id": "V019",
    "type": "vehicle",
    "label": "DL12CA2245",
    "sublabel": "Mahindra Thar",
    "val": 9
  },
  {
    "id": "V020",
    "type": "vehicle",
    "label": "DL12CX4978",
    "sublabel": "Honda City",
    "val": 9
  },
  {
    "id": "ACC001",
    "type": "account",
    "label": "HDFC Bank •••• 8448",
    "sublabel": "Current",
    "val": 8
  },
  {
    "id": "ACC002",
    "type": "account",
    "label": "HDFC Bank •••• 0992",
    "sublabel": "Savings",
    "val": 8
  },
  {
    "id": "ACC003",
    "type": "account",
    "label": "State Bank of India •••• 8680",
    "sublabel": "Current",
    "val": 8
  },
  {
    "id": "ACC004",
    "type": "account",
    "label": "HDFC Bank •••• 8886",
    "sublabel": "Current",
    "val": 8
  },
  {
    "id": "ACC005",
    "type": "account",
    "label": "HDFC Bank •••• 0205",
    "sublabel": "Current",
    "val": 8
  },
  {
    "id": "ACC006",
    "type": "account",
    "label": "HDFC Bank •••• 7725",
    "sublabel": "Current",
    "val": 8
  },
  {
    "id": "ACC007",
    "type": "account",
    "label": "ICICI Bank •••• 1370",
    "sublabel": "Current",
    "val": 8
  },
  {
    "id": "ACC008",
    "type": "account",
    "label": "Axis Bank •••• 7515",
    "sublabel": "Current",
    "val": 8
  },
  {
    "id": "ACC009",
    "type": "account",
    "label": "State Bank of India •••• 2512",
    "sublabel": "Savings",
    "val": 8
  },
  {
    "id": "ACC010",
    "type": "account",
    "label": "State Bank of India •••• 6158",
    "sublabel": "Savings",
    "val": 8
  },
  {
    "id": "ACC011",
    "type": "account",
    "label": "Axis Bank •••• 3766",
    "sublabel": "Current",
    "val": 8
  },
  {
    "id": "ACC012",
    "type": "account",
    "label": "State Bank of India •••• 4833",
    "sublabel": "Current",
    "val": 8
  },
  {
    "id": "ACC013",
    "type": "account",
    "label": "ICICI Bank •••• 5021",
    "sublabel": "Current",
    "val": 8
  },
  {
    "id": "ACC014",
    "type": "account",
    "label": "State Bank of India •••• 2214",
    "sublabel": "Current",
    "val": 8
  },
  {
    "id": "ACC015",
    "type": "account",
    "label": "HDFC Bank •••• 4322",
    "sublabel": "Savings",
    "val": 8
  },
  {
    "id": "ACC016",
    "type": "account",
    "label": "Axis Bank •••• 1912",
    "sublabel": "Savings",
    "val": 8
  },
  {
    "id": "ACC017",
    "type": "account",
    "label": "Axis Bank •••• 9683",
    "sublabel": "Current",
    "val": 8
  },
  {
    "id": "ACC018",
    "type": "account",
    "label": "Axis Bank •••• 9939",
    "sublabel": "Savings",
    "val": 8
  },
  {
    "id": "ACC019",
    "type": "account",
    "label": "State Bank of India •••• 0796",
    "sublabel": "Savings",
    "val": 8
  },
  {
    "id": "ACC020",
    "type": "account",
    "label": "State Bank of India •••• 6386",
    "sublabel": "Current",
    "val": 8
  },
  {
    "id": "ACC021",
    "type": "account",
    "label": "Axis Bank •••• 3190",
    "sublabel": "Current",
    "val": 8
  },
  {
    "id": "ACC022",
    "type": "account",
    "label": "Axis Bank •••• 5791",
    "sublabel": "Current",
    "val": 8
  },
  {
    "id": "ACC023",
    "type": "account",
    "label": "State Bank of India •••• 5339",
    "sublabel": "Current",
    "val": 8
  },
  {
    "id": "ACC024",
    "type": "account",
    "label": "State Bank of India •••• 1033",
    "sublabel": "Savings",
    "val": 8
  },
  {
    "id": "ACC025",
    "type": "account",
    "label": "ICICI Bank •••• 6982",
    "sublabel": "Savings",
    "val": 8
  },
  {
    "id": "ACC026",
    "type": "account",
    "label": "ICICI Bank •••• 3898",
    "sublabel": "Current",
    "val": 8
  },
  {
    "id": "ACC027",
    "type": "account",
    "label": "State Bank of India •••• 3267",
    "sublabel": "Current",
    "val": 8
  },
  {
    "id": "ACC028",
    "type": "account",
    "label": "HDFC Bank •••• 9095",
    "sublabel": "Current",
    "val": 8
  },
  {
    "id": "ACC029",
    "type": "account",
    "label": "ICICI Bank •••• 0706",
    "sublabel": "Current",
    "val": 8
  },
  {
    "id": "ACC030",
    "type": "account",
    "label": "HDFC Bank •••• 8494",
    "sublabel": "Savings",
    "val": 8
  },
  {
    "id": "ACC031",
    "type": "account",
    "label": "State Bank of India •••• 6198",
    "sublabel": "Current",
    "val": 8
  },
  {
    "id": "ACC032",
    "type": "account",
    "label": "ICICI Bank •••• 9762",
    "sublabel": "Savings",
    "val": 8
  },
  {
    "id": "ACC033",
    "type": "account",
    "label": "HDFC Bank •••• 2379",
    "sublabel": "Current",
    "val": 8
  },
  {
    "id": "ACC034",
    "type": "account",
    "label": "Axis Bank •••• 3855",
    "sublabel": "Savings",
    "val": 8
  },
  {
    "id": "ACC035",
    "type": "account",
    "label": "HDFC Bank •••• 2060",
    "sublabel": "Savings",
    "val": 8
  },
  {
    "id": "ACC036",
    "type": "account",
    "label": "HDFC Bank •••• 7347",
    "sublabel": "Savings",
    "val": 8
  },
  {
    "id": "ACC037",
    "type": "account",
    "label": "HDFC Bank •••• 9795",
    "sublabel": "Current",
    "val": 8
  },
  {
    "id": "ACC038",
    "type": "account",
    "label": "HDFC Bank •••• 5492",
    "sublabel": "Savings",
    "val": 8
  },
  {
    "id": "ACC039",
    "type": "account",
    "label": "Axis Bank •••• 3467",
    "sublabel": "Savings",
    "val": 8
  },
  {
    "id": "ACC040",
    "type": "account",
    "label": "Axis Bank •••• 6734",
    "sublabel": "Current",
    "val": 8
  },
  {
    "id": "FIR001",
    "type": "case",
    "label": "FIR/2026/0001",
    "sublabel": "MONEY_LAUNDERING",
    "val": 11
  },
  {
    "id": "FIR002",
    "type": "case",
    "label": "FIR/2026/0002",
    "sublabel": "FINANCIAL_FRAUD",
    "val": 11
  },
  {
    "id": "FIR003",
    "type": "case",
    "label": "FIR/2026/0003",
    "sublabel": "CYBER_HEIST",
    "val": 11
  },
  {
    "id": "FIR004",
    "type": "case",
    "label": "FIR/2026/0004",
    "sublabel": "CAR_JACKING",
    "val": 11
  },
  {
    "id": "FIR005",
    "type": "case",
    "label": "FIR/2026/0005",
    "sublabel": "MONEY_LAUNDERING",
    "val": 11
  },
  {
    "id": "FIR006",
    "type": "case",
    "label": "FIR/2026/0006",
    "sublabel": "CAR_JACKING",
    "val": 11
  },
  {
    "id": "FIR007",
    "type": "case",
    "label": "FIR/2026/0007",
    "sublabel": "CAR_JACKING",
    "val": 11
  },
  {
    "id": "FIR008",
    "type": "case",
    "label": "FIR/2026/0008",
    "sublabel": "MONEY_LAUNDERING",
    "val": 11
  },
  {
    "id": "FIR009",
    "type": "case",
    "label": "FIR/2026/0009",
    "sublabel": "CAR_JACKING",
    "val": 11
  },
  {
    "id": "FIR010",
    "type": "case",
    "label": "FIR/2026/0010",
    "sublabel": "IDENTITY_THEFT",
    "val": 11
  },
  {
    "id": "FIR011",
    "type": "case",
    "label": "FIR/2026/0011",
    "sublabel": "HAWALA_NETWORK",
    "val": 11
  },
  {
    "id": "FIR012",
    "type": "case",
    "label": "FIR/2026/0012",
    "sublabel": "SIM_SWAP_RACKET",
    "val": 11
  },
  {
    "id": "FIR013",
    "type": "case",
    "label": "FIR/2026/0013",
    "sublabel": "MONEY_LAUNDERING",
    "val": 11
  },
  {
    "id": "FIR014",
    "type": "case",
    "label": "FIR/2026/0014",
    "sublabel": "HAWALA_NETWORK",
    "val": 11
  },
  {
    "id": "FIR015",
    "type": "case",
    "label": "FIR/2026/0015",
    "sublabel": "FINANCIAL_FRAUD",
    "val": 11
  },
  {
    "id": "FIR016",
    "type": "case",
    "label": "FIR/2026/0016",
    "sublabel": "SIM_SWAP_RACKET",
    "val": 11
  },
  {
    "id": "FIR017",
    "type": "case",
    "label": "FIR/2026/0017",
    "sublabel": "SIM_SWAP_RACKET",
    "val": 11
  },
  {
    "id": "FIR018",
    "type": "case",
    "label": "FIR/2026/0018",
    "sublabel": "HAWALA_NETWORK",
    "val": 11
  },
  {
    "id": "FIR019",
    "type": "case",
    "label": "FIR/2026/0019",
    "sublabel": "CAR_JACKING",
    "val": 11
  },
  {
    "id": "FIR020",
    "type": "case",
    "label": "FIR/2026/0020",
    "sublabel": "SIM_SWAP_RACKET",
    "val": 11
  }
];

export const syntheticEdges: GraphEdge[] = [
  {
    "id": "E-P001-PH001",
    "source": "P001",
    "target": "PH001",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919863551839 repeatedly observed active under subscriber profile Aarav Sharma."
  },
  {
    "id": "E-P002-PH002",
    "source": "P002",
    "target": "PH002",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919868800797 repeatedly observed active under subscriber profile Aditya Verma."
  },
  {
    "id": "E-P003-PH003",
    "source": "P003",
    "target": "PH003",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919826240908 repeatedly observed active under subscriber profile Rohan Gupta."
  },
  {
    "id": "E-P004-PH004",
    "source": "P004",
    "target": "PH004",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919840158366 repeatedly observed active under subscriber profile Vikram Patel."
  },
  {
    "id": "E-P005-PH005",
    "source": "P005",
    "target": "PH005",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919855377076 repeatedly observed active under subscriber profile Karan Singh."
  },
  {
    "id": "E-P006-PH006",
    "source": "P006",
    "target": "PH006",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919888961459 repeatedly observed active under subscriber profile Siddharth Kumar."
  },
  {
    "id": "E-P007-PH007",
    "source": "P007",
    "target": "PH007",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919888979095 repeatedly observed active under subscriber profile Priya Reddy."
  },
  {
    "id": "E-P008-PH008",
    "source": "P008",
    "target": "PH008",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919810965138 repeatedly observed active under subscriber profile Ananya Rao."
  },
  {
    "id": "E-P009-PH009",
    "source": "P009",
    "target": "PH009",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919894705205 repeatedly observed active under subscriber profile Rajesh Joshi."
  },
  {
    "id": "E-P010-PH010",
    "source": "P010",
    "target": "PH010",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919840728046 repeatedly observed active under subscriber profile Suresh Nair."
  },
  {
    "id": "E-P011-PH011",
    "source": "P011",
    "target": "PH011",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919814216175 repeatedly observed active under subscriber profile Meera Mehta."
  },
  {
    "id": "E-P012-PH012",
    "source": "P012",
    "target": "PH012",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919819510312 repeatedly observed active under subscriber profile Deepak Deshmukh."
  },
  {
    "id": "E-P013-PH013",
    "source": "P013",
    "target": "PH013",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919847376585 repeatedly observed active under subscriber profile Sunil Chawla."
  },
  {
    "id": "E-P014-PH014",
    "source": "P014",
    "target": "PH014",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919838754377 repeatedly observed active under subscriber profile Manish Agarwal."
  },
  {
    "id": "E-P015-PH015",
    "source": "P015",
    "target": "PH015",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919886644106 repeatedly observed active under subscriber profile Pooja Bhatnagar."
  },
  {
    "id": "E-P016-PH016",
    "source": "P016",
    "target": "PH016",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919842614537 repeatedly observed active under subscriber profile Rahul Iyer."
  },
  {
    "id": "E-P017-PH017",
    "source": "P017",
    "target": "PH017",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919864634663 repeatedly observed active under subscriber profile Vijay Choudhury."
  },
  {
    "id": "E-P018-PH018",
    "source": "P018",
    "target": "PH018",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919822660194 repeatedly observed active under subscriber profile Anita Saxena."
  },
  {
    "id": "E-P019-PH019",
    "source": "P019",
    "target": "PH019",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919898447167 repeatedly observed active under subscriber profile Nikhil Kapoor."
  },
  {
    "id": "E-P020-PH020",
    "source": "P020",
    "target": "PH020",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919857553014 repeatedly observed active under subscriber profile Amit Mishra."
  },
  {
    "id": "E-P021-PH021",
    "source": "P021",
    "target": "PH021",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919865177213 repeatedly observed active under subscriber profile Harish Sharma."
  },
  {
    "id": "E-P022-PH022",
    "source": "P022",
    "target": "PH022",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919817270733 repeatedly observed active under subscriber profile Sanjay Verma."
  },
  {
    "id": "E-P023-PH023",
    "source": "P023",
    "target": "PH023",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919818135295 repeatedly observed active under subscriber profile Ramesh Gupta."
  },
  {
    "id": "E-P024-PH024",
    "source": "P024",
    "target": "PH024",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919855540424 repeatedly observed active under subscriber profile Gautam Patel."
  },
  {
    "id": "E-P025-PH025",
    "source": "P025",
    "target": "PH025",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919843374088 repeatedly observed active under subscriber profile Neha Singh."
  },
  {
    "id": "E-P026-PH026",
    "source": "P026",
    "target": "PH026",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919835529407 repeatedly observed active under subscriber profile Divya Kumar."
  },
  {
    "id": "E-P027-PH027",
    "source": "P027",
    "target": "PH027",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919828814949 repeatedly observed active under subscriber profile Arjun Reddy."
  },
  {
    "id": "E-P028-PH028",
    "source": "P028",
    "target": "PH028",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919834627347 repeatedly observed active under subscriber profile Preeti Rao."
  },
  {
    "id": "E-P029-PH029",
    "source": "P029",
    "target": "PH029",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919872092888 repeatedly observed active under subscriber profile Alok Joshi."
  },
  {
    "id": "E-P030-PH030",
    "source": "P030",
    "target": "PH030",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919820117988 repeatedly observed active under subscriber profile Varun Nair."
  },
  {
    "id": "E-P031-PH031",
    "source": "P031",
    "target": "PH031",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919883863413 repeatedly observed active under subscriber profile Simran Mehta."
  },
  {
    "id": "E-P032-PH032",
    "source": "P032",
    "target": "PH032",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919816789850 repeatedly observed active under subscriber profile Kabir Deshmukh."
  },
  {
    "id": "E-P033-PH033",
    "source": "P033",
    "target": "PH033",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919822517517 repeatedly observed active under subscriber profile Tarun Chawla."
  },
  {
    "id": "E-P034-PH034",
    "source": "P034",
    "target": "PH034",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919832321899 repeatedly observed active under subscriber profile Bhavna Agarwal."
  },
  {
    "id": "E-P035-PH035",
    "source": "P035",
    "target": "PH035",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919875181648 repeatedly observed active under subscriber profile Vishal Bhatnagar."
  },
  {
    "id": "E-P036-PH036",
    "source": "P036",
    "target": "PH036",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919838688676 repeatedly observed active under subscriber profile Yash Iyer."
  },
  {
    "id": "E-P037-PH037",
    "source": "P037",
    "target": "PH037",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919817869910 repeatedly observed active under subscriber profile Sneha Choudhury."
  },
  {
    "id": "E-P038-PH038",
    "source": "P038",
    "target": "PH038",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919860864911 repeatedly observed active under subscriber profile Nitin Saxena."
  },
  {
    "id": "E-P039-PH039",
    "source": "P039",
    "target": "PH039",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919862401521 repeatedly observed active under subscriber profile Mohit Kapoor."
  },
  {
    "id": "E-P040-PH040",
    "source": "P040",
    "target": "PH040",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919871070189 repeatedly observed active under subscriber profile Ashok Mishra."
  },
  {
    "id": "E-P001-PH041",
    "source": "P001",
    "target": "PH041",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919866775103 repeatedly observed active under subscriber profile Aarav Sharma."
  },
  {
    "id": "E-P002-PH042",
    "source": "P002",
    "target": "PH042",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919830776478 repeatedly observed active under subscriber profile Aditya Verma."
  },
  {
    "id": "E-P003-PH043",
    "source": "P003",
    "target": "PH043",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919849823450 repeatedly observed active under subscriber profile Rohan Gupta."
  },
  {
    "id": "E-P004-PH044",
    "source": "P004",
    "target": "PH044",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919817849494 repeatedly observed active under subscriber profile Vikram Patel."
  },
  {
    "id": "E-P005-PH045",
    "source": "P005",
    "target": "PH045",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919852091325 repeatedly observed active under subscriber profile Karan Singh."
  },
  {
    "id": "E-P006-PH046",
    "source": "P006",
    "target": "PH046",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919816729990 repeatedly observed active under subscriber profile Siddharth Kumar."
  },
  {
    "id": "E-P007-PH047",
    "source": "P007",
    "target": "PH047",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919877491435 repeatedly observed active under subscriber profile Priya Reddy."
  },
  {
    "id": "E-P008-PH048",
    "source": "P008",
    "target": "PH048",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919817634247 repeatedly observed active under subscriber profile Ananya Rao."
  },
  {
    "id": "E-P009-PH049",
    "source": "P009",
    "target": "PH049",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919834941004 repeatedly observed active under subscriber profile Rajesh Joshi."
  },
  {
    "id": "E-P010-PH050",
    "source": "P010",
    "target": "PH050",
    "type": "USED",
    "confidence": 93,
    "confidenceBand": "HIGH",
    "validFrom": "2025-06-01",
    "validTo": "2026-06-30",
    "evidenceCount": 4,
    "summary": "Phone line +919889864260 repeatedly observed active under subscriber profile Suresh Nair."
  },
  {
    "id": "E-P001-V001",
    "source": "P001",
    "target": "V001",
    "type": "OWNS",
    "confidence": 95,
    "confidenceBand": "HIGH",
    "validFrom": "2025-01-01",
    "evidenceCount": 3,
    "summary": "RTO vehicle registration certificate links DL07CB1475 to owner Aarav Sharma."
  },
  {
    "id": "E-P002-V002",
    "source": "P002",
    "target": "V002",
    "type": "OWNS",
    "confidence": 95,
    "confidenceBand": "HIGH",
    "validFrom": "2025-01-01",
    "evidenceCount": 3,
    "summary": "RTO vehicle registration certificate links DL06CX7624 to owner Aditya Verma."
  },
  {
    "id": "E-P003-V003",
    "source": "P003",
    "target": "V003",
    "type": "OWNS",
    "confidence": 95,
    "confidenceBand": "HIGH",
    "validFrom": "2025-01-01",
    "evidenceCount": 3,
    "summary": "RTO vehicle registration certificate links DL08CA9751 to owner Rohan Gupta."
  },
  {
    "id": "E-P004-V004",
    "source": "P004",
    "target": "V004",
    "type": "OWNS",
    "confidence": 95,
    "confidenceBand": "HIGH",
    "validFrom": "2025-01-01",
    "evidenceCount": 3,
    "summary": "RTO vehicle registration certificate links DL07CX1444 to owner Vikram Patel."
  },
  {
    "id": "E-P005-V005",
    "source": "P005",
    "target": "V005",
    "type": "OWNS",
    "confidence": 95,
    "confidenceBand": "HIGH",
    "validFrom": "2025-01-01",
    "evidenceCount": 3,
    "summary": "RTO vehicle registration certificate links DL11CB3223 to owner Karan Singh."
  },
  {
    "id": "E-P006-V006",
    "source": "P006",
    "target": "V006",
    "type": "OWNS",
    "confidence": 95,
    "confidenceBand": "HIGH",
    "validFrom": "2025-01-01",
    "evidenceCount": 3,
    "summary": "RTO vehicle registration certificate links DL03CA5262 to owner Siddharth Kumar."
  },
  {
    "id": "E-P007-V007",
    "source": "P007",
    "target": "V007",
    "type": "OWNS",
    "confidence": 95,
    "confidenceBand": "HIGH",
    "validFrom": "2025-01-01",
    "evidenceCount": 3,
    "summary": "RTO vehicle registration certificate links DL06CA8449 to owner Priya Reddy."
  },
  {
    "id": "E-P008-V008",
    "source": "P008",
    "target": "V008",
    "type": "OWNS",
    "confidence": 95,
    "confidenceBand": "HIGH",
    "validFrom": "2025-01-01",
    "evidenceCount": 3,
    "summary": "RTO vehicle registration certificate links DL06CB5558 to owner Ananya Rao."
  },
  {
    "id": "E-P009-V009",
    "source": "P009",
    "target": "V009",
    "type": "OWNS",
    "confidence": 95,
    "confidenceBand": "HIGH",
    "validFrom": "2025-01-01",
    "evidenceCount": 3,
    "summary": "RTO vehicle registration certificate links DL05CA8705 to owner Rajesh Joshi."
  },
  {
    "id": "E-P010-V010",
    "source": "P010",
    "target": "V010",
    "type": "OWNS",
    "confidence": 95,
    "confidenceBand": "HIGH",
    "validFrom": "2025-01-01",
    "evidenceCount": 3,
    "summary": "RTO vehicle registration certificate links DL12CX1853 to owner Suresh Nair."
  },
  {
    "id": "E-P011-V011",
    "source": "P011",
    "target": "V011",
    "type": "OWNS",
    "confidence": 95,
    "confidenceBand": "HIGH",
    "validFrom": "2025-01-01",
    "evidenceCount": 3,
    "summary": "RTO vehicle registration certificate links DL04CX2124 to owner Meera Mehta."
  },
  {
    "id": "E-P012-V012",
    "source": "P012",
    "target": "V012",
    "type": "OWNS",
    "confidence": 95,
    "confidenceBand": "HIGH",
    "validFrom": "2025-01-01",
    "evidenceCount": 3,
    "summary": "RTO vehicle registration certificate links DL01CA4266 to owner Deepak Deshmukh."
  },
  {
    "id": "E-P013-V013",
    "source": "P013",
    "target": "V013",
    "type": "OWNS",
    "confidence": 95,
    "confidenceBand": "HIGH",
    "validFrom": "2025-01-01",
    "evidenceCount": 3,
    "summary": "RTO vehicle registration certificate links DL10CA4908 to owner Sunil Chawla."
  },
  {
    "id": "E-P014-V014",
    "source": "P014",
    "target": "V014",
    "type": "OWNS",
    "confidence": 95,
    "confidenceBand": "HIGH",
    "validFrom": "2025-01-01",
    "evidenceCount": 3,
    "summary": "RTO vehicle registration certificate links DL08CX2874 to owner Manish Agarwal."
  },
  {
    "id": "E-P015-V015",
    "source": "P015",
    "target": "V015",
    "type": "OWNS",
    "confidence": 95,
    "confidenceBand": "HIGH",
    "validFrom": "2025-01-01",
    "evidenceCount": 3,
    "summary": "RTO vehicle registration certificate links DL04CB5198 to owner Pooja Bhatnagar."
  },
  {
    "id": "E-P016-V016",
    "source": "P016",
    "target": "V016",
    "type": "OWNS",
    "confidence": 95,
    "confidenceBand": "HIGH",
    "validFrom": "2025-01-01",
    "evidenceCount": 3,
    "summary": "RTO vehicle registration certificate links DL03CX2876 to owner Rahul Iyer."
  },
  {
    "id": "E-P017-V017",
    "source": "P017",
    "target": "V017",
    "type": "OWNS",
    "confidence": 95,
    "confidenceBand": "HIGH",
    "validFrom": "2025-01-01",
    "evidenceCount": 3,
    "summary": "RTO vehicle registration certificate links DL05CA1420 to owner Vijay Choudhury."
  },
  {
    "id": "E-P018-V018",
    "source": "P018",
    "target": "V018",
    "type": "OWNS",
    "confidence": 95,
    "confidenceBand": "HIGH",
    "validFrom": "2025-01-01",
    "evidenceCount": 3,
    "summary": "RTO vehicle registration certificate links DL10CX7149 to owner Anita Saxena."
  },
  {
    "id": "E-P019-V019",
    "source": "P019",
    "target": "V019",
    "type": "OWNS",
    "confidence": 95,
    "confidenceBand": "HIGH",
    "validFrom": "2025-01-01",
    "evidenceCount": 3,
    "summary": "RTO vehicle registration certificate links DL12CA2245 to owner Nikhil Kapoor."
  },
  {
    "id": "E-P020-V020",
    "source": "P020",
    "target": "V020",
    "type": "OWNS",
    "confidence": 95,
    "confidenceBand": "HIGH",
    "validFrom": "2025-01-01",
    "evidenceCount": 3,
    "summary": "RTO vehicle registration certificate links DL12CX4978 to owner Amit Mishra."
  },
  {
    "id": "E-P001-ACC001",
    "source": "P001",
    "target": "ACC001",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Aarav Sharma."
  },
  {
    "id": "E-P002-ACC002",
    "source": "P002",
    "target": "ACC002",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Aditya Verma."
  },
  {
    "id": "E-P003-ACC003",
    "source": "P003",
    "target": "ACC003",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Rohan Gupta."
  },
  {
    "id": "E-P004-ACC004",
    "source": "P004",
    "target": "ACC004",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Vikram Patel."
  },
  {
    "id": "E-P005-ACC005",
    "source": "P005",
    "target": "ACC005",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Karan Singh."
  },
  {
    "id": "E-P006-ACC006",
    "source": "P006",
    "target": "ACC006",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Siddharth Kumar."
  },
  {
    "id": "E-P007-ACC007",
    "source": "P007",
    "target": "ACC007",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Priya Reddy."
  },
  {
    "id": "E-P008-ACC008",
    "source": "P008",
    "target": "ACC008",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Ananya Rao."
  },
  {
    "id": "E-P009-ACC009",
    "source": "P009",
    "target": "ACC009",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Rajesh Joshi."
  },
  {
    "id": "E-P010-ACC010",
    "source": "P010",
    "target": "ACC010",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Suresh Nair."
  },
  {
    "id": "E-P011-ACC011",
    "source": "P011",
    "target": "ACC011",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Meera Mehta."
  },
  {
    "id": "E-P012-ACC012",
    "source": "P012",
    "target": "ACC012",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Deepak Deshmukh."
  },
  {
    "id": "E-P013-ACC013",
    "source": "P013",
    "target": "ACC013",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Sunil Chawla."
  },
  {
    "id": "E-P014-ACC014",
    "source": "P014",
    "target": "ACC014",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Manish Agarwal."
  },
  {
    "id": "E-P015-ACC015",
    "source": "P015",
    "target": "ACC015",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Pooja Bhatnagar."
  },
  {
    "id": "E-P016-ACC016",
    "source": "P016",
    "target": "ACC016",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Rahul Iyer."
  },
  {
    "id": "E-P017-ACC017",
    "source": "P017",
    "target": "ACC017",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Vijay Choudhury."
  },
  {
    "id": "E-P018-ACC018",
    "source": "P018",
    "target": "ACC018",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Anita Saxena."
  },
  {
    "id": "E-P019-ACC019",
    "source": "P019",
    "target": "ACC019",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Nikhil Kapoor."
  },
  {
    "id": "E-P020-ACC020",
    "source": "P020",
    "target": "ACC020",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Amit Mishra."
  },
  {
    "id": "E-P021-ACC021",
    "source": "P021",
    "target": "ACC021",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Harish Sharma."
  },
  {
    "id": "E-P022-ACC022",
    "source": "P022",
    "target": "ACC022",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Sanjay Verma."
  },
  {
    "id": "E-P023-ACC023",
    "source": "P023",
    "target": "ACC023",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Ramesh Gupta."
  },
  {
    "id": "E-P024-ACC024",
    "source": "P024",
    "target": "ACC024",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Gautam Patel."
  },
  {
    "id": "E-P025-ACC025",
    "source": "P025",
    "target": "ACC025",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Neha Singh."
  },
  {
    "id": "E-P026-ACC026",
    "source": "P026",
    "target": "ACC026",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Divya Kumar."
  },
  {
    "id": "E-P027-ACC027",
    "source": "P027",
    "target": "ACC027",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Arjun Reddy."
  },
  {
    "id": "E-P028-ACC028",
    "source": "P028",
    "target": "ACC028",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Preeti Rao."
  },
  {
    "id": "E-P029-ACC029",
    "source": "P029",
    "target": "ACC029",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Alok Joshi."
  },
  {
    "id": "E-P030-ACC030",
    "source": "P030",
    "target": "ACC030",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Varun Nair."
  },
  {
    "id": "E-P031-ACC031",
    "source": "P031",
    "target": "ACC031",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Simran Mehta."
  },
  {
    "id": "E-P032-ACC032",
    "source": "P032",
    "target": "ACC032",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Kabir Deshmukh."
  },
  {
    "id": "E-P033-ACC033",
    "source": "P033",
    "target": "ACC033",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Tarun Chawla."
  },
  {
    "id": "E-P034-ACC034",
    "source": "P034",
    "target": "ACC034",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Bhavna Agarwal."
  },
  {
    "id": "E-P035-ACC035",
    "source": "P035",
    "target": "ACC035",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Vishal Bhatnagar."
  },
  {
    "id": "E-P036-ACC036",
    "source": "P036",
    "target": "ACC036",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Yash Iyer."
  },
  {
    "id": "E-P037-ACC037",
    "source": "P037",
    "target": "ACC037",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Sneha Choudhury."
  },
  {
    "id": "E-P038-ACC038",
    "source": "P038",
    "target": "ACC038",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Nitin Saxena."
  },
  {
    "id": "E-P039-ACC039",
    "source": "P039",
    "target": "ACC039",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Mohit Kapoor."
  },
  {
    "id": "E-P040-ACC040",
    "source": "P040",
    "target": "ACC040",
    "type": "OWNS",
    "confidence": 98,
    "confidenceBand": "HIGH",
    "validFrom": "2024-01-01",
    "evidenceCount": 4,
    "summary": "Bank KYC record verifies account ownership by Ashok Mishra."
  }
];
