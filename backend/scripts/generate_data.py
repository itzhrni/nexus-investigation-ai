import json
import random
import os
import sys
import csv
from pathlib import Path
from datetime import datetime, timedelta

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

# Set fixed random seed for deterministic reproducibility
random.seed(42)

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "data" / "synthetic"

FIRST_NAMES = ["Aarav", "Aditya", "Rohan", "Vikram", "Karan", "Siddharth", "Priya", "Ananya", "Rajesh", "Suresh",
               "Meera", "Deepak", "Sunil", "Manish", "Pooja", "Rahul", "Vijay", "Anita", "Nikhil", "Amit",
               "Harish", "Sanjay", "Ramesh", "Gautam", "Neha", "Divya", "Arjun", "Preeti", "Alok", "Varun",
               "Simran", "Kabir", "Tarun", "Bhavna", "Vishal", "Yash", "Sneha", "Nitin", "Mohit", "Ashok"]

LAST_NAMES = ["Sharma", "Verma", "Gupta", "Patel", "Singh", "Kumar", "Reddy", "Rao", "Joshi", "Nair",
              "Mehta", "Deshmukh", "Chawla", "Agarwal", "Bhatnagar", "Iyer", "Choudhury", "Saxena", "Kapoor", "Mishra"]

CITIES_WITH_JURISDICTION = [
    {"name": "Connaught Place, New Delhi", "state": "Delhi", "district": "New Delhi", "police_station": "Connaught Place PS", "jurisdiction_id": "JUR_DEL_001", "lat": 28.6315, "lng": 77.2167},
    {"name": "Bandra West, Mumbai", "state": "Maharashtra", "district": "Mumbai Suburban", "police_station": "Bandra West PS", "jurisdiction_id": "JUR_MAH_002", "lat": 19.0596, "lng": 72.8295},
    {"name": "Indiranagar, Bengaluru", "state": "Karnataka", "district": "Bengaluru Urban", "police_station": "Indiranagar PS", "jurisdiction_id": "JUR_KAR_003", "lat": 12.9784, "lng": 77.6408},
    {"name": "Park Street, Kolkata", "state": "West Bengal", "district": "Kolkata", "police_station": "Park Street PS", "jurisdiction_id": "JUR_WB_004", "lat": 22.5551, "lng": 88.3517},
    {"name": "Cyber City, Gurugram", "state": "Haryana", "district": "Gurugram", "police_station": "Cyber Crime PS Gurugram", "jurisdiction_id": "JUR_HAR_005", "lat": 28.4950, "lng": 77.0895},
    {"name": "Gachibowli, Hyderabad", "state": "Telangana", "district": "Hyderabad", "police_station": "Gachibowli PS", "jurisdiction_id": "JUR_TEL_006", "lat": 17.4401, "lng": 78.3489},
    {"name": "Anna Nagar, Chennai", "state": "Tamil Nadu", "district": "Chennai", "police_station": "Anna Nagar PS", "jurisdiction_id": "JUR_TN_007", "lat": 13.0850, "lng": 80.2101},
    {"name": "FC Road, Pune", "state": "Maharashtra", "district": "Pune", "police_station": "Deccan Gymkhana PS", "jurisdiction_id": "JUR_MAH_008", "lat": 18.5204, "lng": 73.8415},
    {"name": "SG Highway, Ahmedabad", "state": "Gujarat", "district": "Ahmedabad", "police_station": "Sarkhej PS", "jurisdiction_id": "JUR_GUJ_009", "lat": 23.0225, "lng": 72.5714},
    {"name": "Hazratganj, Lucknow", "state": "Uttar Pradesh", "district": "Lucknow", "police_station": "Hazratganj PS", "jurisdiction_id": "JUR_UP_010", "lat": 26.8467, "lng": 80.9462},
    {"name": "MI Road, Jaipur", "state": "Rajasthan", "district": "Jaipur", "police_station": "Vidhadhar Nagar PS", "jurisdiction_id": "JUR_RAJ_011", "lat": 26.9124, "lng": 75.7873},
    {"name": "Sector 17, Chandigarh", "state": "Punjab", "district": "Chandigarh", "police_station": "Sector 17 PS", "jurisdiction_id": "JUR_PUN_012", "lat": 30.7398, "lng": 76.7827},
    {"name": "Bani Park, Jaipur", "state": "Rajasthan", "district": "Jaipur", "police_station": "Bani Park PS", "jurisdiction_id": "JUR_RAJ_013", "lat": 26.9260, "lng": 75.7920},
    {"name": "MG Road, Kochi", "state": "Kerala", "district": "Ernakulam", "police_station": "Central PS Kochi", "jurisdiction_id": "JUR_KER_014", "lat": 9.9726, "lng": 76.2780},
    {"name": "Salt Lake, Kolkata", "state": "West Bengal", "district": "North 24 Parganas", "police_station": "Bidhannagar PS", "jurisdiction_id": "JUR_WB_015", "lat": 22.5867, "lng": 88.4171},
    {"name": "Vashi, Navi Mumbai", "state": "Maharashtra", "district": "Thane", "police_station": "Vashi PS", "jurisdiction_id": "JUR_MAH_016", "lat": 19.0770, "lng": 73.0033},
    {"name": "Whitefield, Bengaluru", "state": "Karnataka", "district": "Bengaluru Urban", "police_station": "Whitefield PS", "jurisdiction_id": "JUR_KAR_017", "lat": 12.9698, "lng": 77.7500},
    {"name": "Koramangala, Bengaluru", "state": "Karnataka", "district": "Bengaluru Urban", "police_station": "Koramangala PS", "jurisdiction_id": "JUR_KAR_018", "lat": 12.9352, "lng": 77.6245},
    {"name": "Hitech City, Hyderabad", "state": "Telangana", "district": "Rangareddy", "police_station": "Madhapur PS", "jurisdiction_id": "JUR_TEL_019", "lat": 17.4435, "lng": 78.3772},
    {"name": "Juhu, Mumbai", "state": "Maharashtra", "district": "Mumbai Suburban", "police_station": "Juhu PS", "jurisdiction_id": "JUR_MAH_020", "lat": 19.1075, "lng": 72.8263},
    {"name": "Aerocity, New Delhi", "state": "Delhi", "district": "South West Delhi", "police_station": "IGI Airport PS", "jurisdiction_id": "JUR_DEL_021", "lat": 28.5520, "lng": 77.1215},
    {"name": "Viman Nagar, Pune", "state": "Maharashtra", "district": "Pune", "police_station": "Viman Nagar PS", "jurisdiction_id": "JUR_MAH_022", "lat": 18.5679, "lng": 73.9143},
    {"name": "Alipore, Kolkata", "state": "West Bengal", "district": "Kolkata", "police_station": "Alipore PS", "jurisdiction_id": "JUR_WB_023", "lat": 22.5323, "lng": 88.3308},
    {"name": "Adyar, Chennai", "state": "Tamil Nadu", "district": "Chennai", "police_station": "Adyar PS", "jurisdiction_id": "JUR_TN_024", "lat": 13.0012, "lng": 80.2565},
    {"name": "Nungambakkam, Chennai", "state": "Tamil Nadu", "district": "Chennai", "police_station": "Nungambakkam PS", "jurisdiction_id": "JUR_TN_025", "lat": 13.0604, "lng": 80.2496}
]

CRIME_TYPES = ["FINANCIAL_FRAUD", "CYBER_HEIST", "SIM_SWAP_RACKET", "IDENTITY_THEFT", "MONEY_LAUNDERING", "HAWALA_NETWORK", "CAR_JACKING"]

def generate_phonetic_key(name: str) -> str:
    """Simple deterministic soundex/phonetic key representation for testing."""
    parts = name.upper().split()
    first = parts[0] if parts else "X"
    last = parts[-1] if len(parts) > 1 else "X"
    return f"{first[0]}{len(first)}{last[0]}{len(last)}"

def generate_synthetic_dataset():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    base_time = datetime(2026, 1, 1, 10, 0, 0)
    anchor_event_time = datetime(2026, 1, 15, 12, 0, 0)

    # 1. Persons (40) - Enriched for Bharat-aware Entity Resolution
    persons = []
    for i in range(1, 41):
        pid = f"P{i:03d}"
        first = FIRST_NAMES[(i-1) % len(FIRST_NAMES)]
        last = LAST_NAMES[(i-1) % len(LAST_NAMES)]
        canonical = f"{first} {last}"
        city_info = CITIES_WITH_JURISDICTION[(i-1) % len(CITIES_WITH_JURISDICTION)]

        variants = [canonical]
        if i % 3 == 0:
            variants.append(f"{first[0]}. {last}")
            variants.append(f"{first} {last.lower()}")
        if i % 4 == 0:
            variants.append(f"संभावित_{first}")

        # Forensic Aadhaar Generation (Valid, Collision, Fabricated fixtures)
        from app.services.aadhaar_service import aadhaar_service
        if pid in ["P005", "P015"]:
            # Intentional Forensic Collision Fixture: P005 and P015 share stolen Aadhaar
            aadhaar_raw = "548912349015"
            a_masked = "XXXX-XXXX-9015"
            a_hash = aadhaar_service.hash_aadhaar(aadhaar_raw)
            a_status = "COLLISION_FLAGGED"
        elif pid == "P010":
            # Intentional Fabricated Fixture: mathematically invalid Verhoeff checksum
            a_masked = "XXXX-XXXX-9999"
            a_hash = aadhaar_service.hash_aadhaar("999999999999")
            a_status = "VERHOEFF_INVALID"
        else:
            base11 = f"5489{i:03d}{1000 + i}"
            chk = aadhaar_service.generate_checksum_digit(base11)
            full_12 = f"{base11}{chk}"
            a_masked = aadhaar_service.mask_aadhaar(full_12)
            a_hash = aadhaar_service.hash_aadhaar(full_12)
            a_status = "VERHOEFF_VALID"

        persons.append({
            "id": pid,
            "name": canonical,
            "canonical_name": canonical,
            "name_variants": variants,
            "aliases": [f"Alias_{first}", f"Shadow_{i}"],
            "gender": "Male" if i % 2 != 0 else "Female",
            "dob": f"{random.randint(1975, 2002)}-{random.randint(1,12):02d}-{random.randint(1,28):02d}",
            "nationality": "Indian",
            "language": random.choice(["Hindi", "Tamil", "Bengali", "Marathi", "English", "Telugu"]),
            "address": f"Flat {random.randint(101, 909)}, Block {random.choice(['A','B','C'])}, {city_info['name']}",
            "state": city_info["state"],
            "district": city_info["district"],
            "phonetic_key": generate_phonetic_key(canonical),
            "notes": "Synthetic profile for investigation simulation",
            "aadhaar_masked": a_masked,
            "aadhaar_hash": a_hash,
            "aadhaar_status": a_status
        })

    # 2. Phones (50)
    phones = []
    for i in range(1, 51):
        phid = f"PH{i:03d}"
        msisdn = f"+9198{random.randint(10000000, 99999999)}"
        phones.append({
            "id": phid,
            "msisdn": msisdn,
            "carrier": random.choice(["Airtel", "Jio", "Vi", "BSNL"]),
            "status": "active",
            "registered_name": persons[(i-1) % len(persons)]["name"]
        })

    # 3. SIM Cards (40)
    sims = []
    for i in range(1, 41):
        simid = f"SIM{i:03d}"
        sims.append({
            "id": simid,
            "iccid": f"8991{random.randint(1000000000000000, 9999999999999999)}",
            "imsi": f"40445{random.randint(1000000000, 9999999999)}",
            "operator": random.choice(["Airtel", "Jio", "Vi", "BSNL"]),
            "registered_to_person_id": persons[(i-1) % len(persons)]["id"],
            "status": "active"
        })

    # 4. Devices (40)
    devices = []
    brands = [("Samsung", "Galaxy S23"), ("Apple", "iPhone 14"), ("OnePlus", "11R"), ("Xiaomi", "Redmi Note 12"), ("Realme", "GT Neo 3")]
    for i in range(1, 41):
        devid = f"DEV{i:03d}"
        brand, model = random.choice(brands)
        devices.append({
            "id": devid,
            "imei": f"86{random.randint(10000000000000, 99999999999999)}",
            "brand": brand,
            "model": model,
            "os": "Android" if brand != "Apple" else "iOS",
            "status": "active"
        })

    # 5. Vehicles (20)
    vehicles = []
    v_makes = [("Hyundai", "Creta", "White"), ("Maruti", "Swift", "Silver"), ("Tata", "Harrier", "Black"), ("Mahindra", "Thar", "Red"), ("Honda", "City", "Grey")]
    for i in range(1, 21):
        vid = f"V{i:03d}"
        make, model, color = random.choice(v_makes)
        vehicles.append({
            "id": vid,
            "registration_number": f"DL{random.randint(1,12):02d}C{random.choice(['A','B','X'])}{random.randint(1000,9999)}",
            "vehicle_type": "SUV" if make in ["Mahindra", "Tata", "Hyundai"] else "Sedan",
            "make": make,
            "model": model,
            "color": color,
            "owner_person_id": persons[(i-1) % len(persons)]["id"]
        })

    # 6. Bank Accounts (40)
    accounts = []
    banks = [("HDFC Bank", "HDFC0000123"), ("ICICI Bank", "ICIC0000456"), ("State Bank of India", "SBIN0000789"), ("Axis Bank", "UTIB0000321")]
    for i in range(1, 41):
        accid = f"ACC{i:03d}"
        bank_name, ifsc = random.choice(banks)
        accounts.append({
            "id": accid,
            "account_number": f"{random.randint(100000000000, 999999999999)}",
            "bank_name": bank_name,
            "ifsc": ifsc,
            "account_type": random.choice(["Savings", "Current"]),
            "holder_person_id": persons[(i-1) % len(persons)]["id"]
        })

    # 7. Locations (25) - Enriched with State & Jurisdiction Metadata
    locations = []
    for i in range(1, 26):
        locid = f"LOC{i:03d}"
        loc_info = CITIES_WITH_JURISDICTION[i-1]
        locations.append({
            "id": locid,
            "name": loc_info["name"],
            "location_type": random.choice(["Commercial Hub", "Residential Area", "Transit Hub", "Industrial Zone"]),
            "address": loc_info["name"],
            "state": loc_info["state"],
            "district": loc_info["district"],
            "police_station": loc_info["police_station"],
            "jurisdiction_id": loc_info["jurisdiction_id"],
            "latitude": loc_info["lat"],
            "longitude": loc_info["lng"]
        })

    # 8. Organizations (15)
    organizations = []
    for i in range(1, 16):
        orgid = f"ORG{i:03d}"
        organizations.append({
            "id": orgid,
            "name": f"Nexus Tech Ventures {i}" if i % 2 == 0 else f"Global Trading Corp {i}",
            "org_type": "Private Limited",
            "registration_no": f"U{random.randint(10000,99999)}DL2022PTC{random.randint(1000,9999)}",
            "address": locations[(i-1) % len(locations)]["name"]
        })

    # 9. FIRs (20) & Crimes (20) - Enriched with Jurisdiction Metadata
    firs = []
    crimes = []
    for i in range(1, 21):
        firid = f"FIR{i:03d}"
        crmid = f"CRM{i:03d}"
        c_type = random.choice(CRIME_TYPES)
        inc_date = (base_time + timedelta(days=i*3)).strftime("%Y-%m-%d")
        loc_ref = locations[(i-1)%len(locations)]
        
        summary_text = f"Reported case of {c_type.lower().replace('_', ' ')} under {loc_ref['police_station']} jurisdiction."
        if i == 1:
            summary_text = f"Reported case of financial fraud involving subject P004 (Vikram Patel) under Connaught Place PS jurisdiction."

        firs.append({
            "id": firid,
            "fir_number": f"FIR/{2026}/{i:04d}",
            "police_station": loc_ref["police_station"],
            "district": loc_ref["district"],
            "state": loc_ref["state"],
            "jurisdiction_id": loc_ref["jurisdiction_id"],
            "crime_type": c_type,
            "status": "UNDER_INVESTIGATION",
            "incident_date": inc_date,
            "summary": summary_text
        })

        crimes.append({
            "id": crmid,
            "crime_code": f"SEC_{400+i}",
            "title": f"Incident {c_type}",
            "category": c_type,
            "severity": random.choice(["HIGH", "CRITICAL", "MEDIUM"]),
            "status": "OPEN",
            "location_id": loc_ref["id"],
            "police_station": loc_ref["police_station"],
            "district": loc_ref["district"],
            "state": loc_ref["state"],
            "jurisdiction_id": loc_ref["jurisdiction_id"],
            "date": inc_date
        })

    # 10. Events (20) - Enriched with Jurisdiction Metadata
    events = []
    for i in range(1, 21):
        evtid = f"EVT{i:03d}"
        loc_ref = locations[(i-1)%len(locations)]
        events.append({
            "id": evtid,
            "title": f"Investigation Milestone Event {i}",
            "event_type": random.choice(["MEETING_SIGHTING", "ATM_WITHDRAWAL", "CALL_BURST", "SIM_ACTIVATION"]),
            "timestamp": (base_time + timedelta(days=i*2, hours=i)).isoformat(),
            "location_id": loc_ref["id"],
            "police_station": loc_ref["police_station"],
            "district": loc_ref["district"],
            "state": loc_ref["state"],
            "jurisdiction_id": loc_ref["jurisdiction_id"],
            "description": f"Suspicious event flagged in {loc_ref['police_station']} area."
        })

    # 11. CDR Records (350 background calls)
    # FIX: Isolate PH010 completely from random background calls (both before and after EVT010)
    cdr_records = []
    for i in range(1, 351):
        cdrid = f"CDR{i:03d}"
        caller_idx = random.randint(0, len(phones)-1)
        receiver_idx = (caller_idx + random.randint(1, len(phones)-1)) % len(phones)

        # Completely exclude PH010 from random background CDR generation
        if phones[caller_idx]["id"] == "PH010":
            caller_idx = (caller_idx + 1) % len(phones)
        if phones[receiver_idx]["id"] == "PH010":
            receiver_idx = (receiver_idx + 2) % len(phones)

        sim_idx = caller_idx % len(sims)
        dev_idx = caller_idx % len(devices)
        ts_dt = base_time + timedelta(hours=i*2, minutes=random.randint(0,59))
        ts = ts_dt.isoformat()

        # Fix 1: Ensure SIM001 transitions from DEV001 to DEV002 after 2026-01-10
        device_id = devices[dev_idx]["id"]
        if sims[sim_idx]["id"] == "SIM001":
            if ts_dt >= datetime(2026, 1, 10, 0, 0, 0):
                device_id = "DEV002"
            else:
                device_id = "DEV001"

        cdr_records.append({
            "id": cdrid,
            "caller_phone_id": phones[caller_idx]["id"],
            "receiver_phone_id": phones[receiver_idx]["id"],
            "sim_id": sims[sim_idx]["id"],
            "device_id": device_id,
            "call_type": random.choice(["CALL", "SMS"]),
            "duration_seconds": random.randint(10, 600) if i % 2 == 0 else 0,
            "timestamp": ts,
            "cell_tower_id": f"TOWER_{random.randint(100,999)}"
        })

    # 12. Financial Transactions (250 background transactions)
    # FIX: Isolate ACC010 completely from random background transactions (both before and after EVT010)
    transactions = []
    for i in range(1, 251):
        txid = f"TX{i:03d}"
        sender_idx = random.randint(0, len(accounts)-1)
        receiver_idx = (sender_idx + random.randint(1, len(accounts)-1)) % len(accounts)

        # Completely exclude ACC010 from random background transaction generation
        if accounts[sender_idx]["id"] == "ACC010":
            sender_idx = (sender_idx + 1) % len(accounts)
        if accounts[receiver_idx]["id"] == "ACC010":
            receiver_idx = (receiver_idx + 2) % len(accounts)

        ts_dt = base_time + timedelta(hours=i*3, minutes=random.randint(0,59))
        ts = ts_dt.isoformat()

        transactions.append({
            "id": txid,
            "sender_account_id": accounts[sender_idx]["id"],
            "receiver_account_id": accounts[receiver_idx]["id"],
            "amount": round(random.uniform(5000.0, 500000.0), 2),
            "currency": "INR",
            "transaction_type": random.choice(["UPI", "NEFT", "RTGS", "IMPS"]),
            "status": "COMPLETED",
            "timestamp": ts
        })

    # 13. Vehicle Sightings (80 background sightings)
    # FIX: Isolate V010 completely from random background vehicle sightings
    sightings = []
    for i in range(1, 81):
        sgtid = f"SIGHT{i:03d}"
        v_idx = random.randint(0, len(vehicles)-1)
        if vehicles[v_idx]["id"] == "V010":
            v_idx = (v_idx + 1) % len(vehicles)

        loc_idx = random.randint(0, len(locations)-1)
        ts_dt = base_time + timedelta(hours=i*4)
        ts = ts_dt.isoformat()

        sightings.append({
            "id": sgtid,
            "vehicle_id": vehicles[v_idx]["id"],
            "location_id": locations[loc_idx]["id"],
            "sighting_timestamp": ts,
            "camera_id": f"CAM_{locations[loc_idx]['id']}_{random.randint(1,5)}",
            "confidence": round(random.uniform(0.88, 0.99), 2),
            "image_url": f"/data/processed/cctv_{sgtid}.jpg"
        })

    # 14. Intelligence Reports (25)
    reports = []
    for i in range(1, 26):
        repid = f"REP{i:03d}"
        r_date = (base_time + timedelta(days=i*2)).strftime("%Y-%m-%d")
        p_name = persons[(i-1)%len(persons)]["name"]
        ph_num = phones[(i-1)%len(phones)]["msisdn"]
        v_num = vehicles[(i-1)%len(vehicles)]["registration_number"]
        
        reports.append({
            "id": repid,
            "report_number": f"INT-REP-2026-{i:03d}",
            "title": f"Field Intelligence Summary #{i}",
            "source_agency": random.choice(["Special Cell", "Cyber Crime Unit", "Financial Intelligence Unit", "State CID"]),
            "author": f"Officer_{random.choice(['Rathore', 'Desai', 'Kulkarni', 'Banerjee'])}",
            "report_date": r_date,
            "text_content": f"Intelligence report detailing subject {p_name} using phone {ph_num} and vehicle {v_num} around {locations[(i-1)%len(locations)]['name']}."
        })

    # =========================================================================
    # PLANT INTENTIONALLY HIDDEN RELATIONSHIPS & GROUND TRUTH MAPPINGS
    # =========================================================================
    ground_truth = {
        "description": "Ground truth of planted hidden criminal network patterns for testing evaluation.",
        "generated_at": datetime.now().isoformat(),
        "hidden_patterns": []
    }

    # Pattern 1: SIM & Device Switch
    ground_truth["hidden_patterns"].append({
        "pattern_id": "PATTERN_001_SIM_SWITCH",
        "pattern_type": "SIM_DEVICE_SWITCH",
        "focal_person": "P001",
        "initial_identifiers": {"phone": "PH001", "sim": "SIM001", "device": "DEV001"},
        "switched_identifiers": {"phone": "PH002", "sim": "SIM001", "device": "DEV002"},
        "transition_date": "2026-01-10",
        "planted_evidence": "SIM001 reused across DEV001 (before 2026-01-10) and DEV002 (after 2026-01-10) in consecutive CDR logs."
    })

    # Pattern 2: Financial Transfer Loop
    transactions.append({
        "id": "TX_RING_001", "sender_account_id": "ACC001", "receiver_account_id": "ACC005", "amount": 450000.0, "currency": "INR", "transaction_type": "RTGS", "status": "COMPLETED", "timestamp": "2026-01-06T10:00:00"
    })
    transactions.append({
        "id": "TX_RING_002", "sender_account_id": "ACC005", "receiver_account_id": "ACC012", "amount": 445000.0, "currency": "INR", "transaction_type": "NEFT", "status": "COMPLETED", "timestamp": "2026-01-07T10:00:00"
    })
    transactions.append({
        "id": "TX_RING_003", "sender_account_id": "ACC012", "receiver_account_id": "ACC001", "amount": 440000.0, "currency": "INR", "transaction_type": "UPI", "status": "COMPLETED", "timestamp": "2026-01-08T10:00:00"
    })
    ground_truth["hidden_patterns"].append({
        "pattern_id": "PATTERN_002_FINANCIAL_LOOP",
        "pattern_type": "CIRCULAR_TRANSACTIONS",
        "participating_accounts": ["ACC001", "ACC005", "ACC012"],
        "participating_persons": ["P001", "P005", "P012"],
        "planted_evidence": "Sequential high-value transactions forming a financial loop within 48 hours."
    })

    # Pattern 3: Location Convergence
    sightings.append({
        "id": "SIGHT_CONV_001", "vehicle_id": "V002", "location_id": "LOC005", "sighting_timestamp": "2026-01-15T14:10:00", "camera_id": "CAM_LOC005_1", "confidence": 0.98, "image_url": "/data/processed/conv1.jpg"
    })
    sightings.append({
        "id": "SIGHT_CONV_002", "vehicle_id": "V003", "location_id": "LOC005", "sighting_timestamp": "2026-01-15T14:25:00", "camera_id": "CAM_LOC005_2", "confidence": 0.96, "image_url": "/data/processed/conv2.jpg"
    })
    ground_truth["hidden_patterns"].append({
        "pattern_id": "PATTERN_003_LOCATION_CONVERGENCE",
        "pattern_type": "SPATIAL_TEMPORAL_CONVERGENCE",
        "location_id": "LOC005",
        "participating_vehicles": ["V002", "V003"],
        "participating_persons": ["P002", "P003"],
        "time_window": "2026-01-15T14:10:00 to 2026-01-15T14:25:00",
        "planted_evidence": "Multiple suspect vehicles appearing at the same location within a 15-minute window."
    })

    # Pattern 4: Cross-State / Cross-Jurisdiction Operations
    sightings.append({
        "id": "SIGHT_CROSS_001", "vehicle_id": "V004", "location_id": "LOC002", "sighting_timestamp": "2026-01-18T10:00:00", "camera_id": "CAM_LOC002_1", "confidence": 0.97, "image_url": "/data/processed/cctv_cross1.jpg"
    })
    ground_truth["hidden_patterns"].append({
        "pattern_id": "PATTERN_CROSS_STATE_JURISDICTION",
        "pattern_type": "CROSS_JURISDICTION_ACTIVITY",
        "focal_person": "P004",
        "associated_states": ["Delhi", "Maharashtra"],
        "jurisdiction_ids": ["JUR_DEL_001", "JUR_MAH_002"],
        "police_stations": ["Connaught Place PS", "Bandra West PS"],
        "planted_evidence": "Subject P004 linked to FIR001 in Delhi (JUR_DEL_001) and vehicle sighting SIGHT_CROSS_001 of V004 at LOC002 in Bandra West PS, Mumbai (JUR_MAH_002)."
    })

    # Pattern 5: Identity Continuity Transition
    cdr_records.append({
        "id": "CDR_CONT_001", "caller_phone_id": "PH005", "receiver_phone_id": "PH001", "sim_id": "SIM005", "device_id": "DEV005", "call_type": "CALL", "duration_seconds": 120, "timestamp": "2026-01-10T11:00:00", "cell_tower_id": "TOWER_101"
    })
    cdr_records.append({
        "id": "CDR_CONT_002", "caller_phone_id": "PH015", "receiver_phone_id": "PH001", "sim_id": "SIM015", "device_id": "DEV015", "call_type": "CALL", "duration_seconds": 140, "timestamp": "2026-01-12T15:30:00", "cell_tower_id": "TOWER_101"
    })
    ground_truth["hidden_patterns"].append({
        "pattern_id": "PATTERN_IDENTITY_CONTINUITY",
        "pattern_type": "IDENTIFIER_TRANSITION",
        "focal_person": "P005",
        "initial_identifiers": {"phone": "PH005", "sim": "SIM005", "device": "DEV005"},
        "new_identifiers": {"phone": "PH015", "sim": "SIM015", "device": "DEV015"},
        "transition_date": "2026-01-11",
        "supporting_signals": {
            "common_contacts": ["PH001"],
            "shared_locations": ["LOC003"],
            "temporal_proximity": "Calls to PH001 made within 48h of transition date."
        },
        "planted_evidence": "Sudden drop in PH005 calls followed by PH015 calling identical contact network (PH001) from same cell tower."
    })

    # Pattern 6: "What Changed?" Temporal Before/After Baseline
    # Anchor Event: EVT010 (Cyber Heist Incident at 2026-01-15T12:00:00)
    events[9] = {
        "id": "EVT010",
        "title": "Major Cyber Heist Incident",
        "event_type": "CYBER_ATTACK",
        "timestamp": "2026-01-15T12:00:00",
        "location_id": "LOC005",
        "police_station": "Cyber Crime PS Gurugram",
        "district": "Gurugram",
        "state": "Haryana",
        "jurisdiction_id": "JUR_HAR_005",
        "description": "Anchor event for temporal before/after baseline investigation analysis."
    }

    # Plant EXACTLY 2 BEFORE CDRs & 1 BEFORE Transaction (₹10,000) & 1 BEFORE Sighting (LOC001) for P010
    cdr_records.append({
        "id": "CDR_BEFORE_001", "caller_phone_id": "PH010", "receiver_phone_id": "PH002", "sim_id": "SIM010", "device_id": "DEV010", "call_type": "CALL", "duration_seconds": 60, "timestamp": "2026-01-05T10:00:00", "cell_tower_id": "TOWER_100"
    })
    cdr_records.append({
        "id": "CDR_BEFORE_002", "caller_phone_id": "PH010", "receiver_phone_id": "PH003", "sim_id": "SIM010", "device_id": "DEV010", "call_type": "CALL", "duration_seconds": 90, "timestamp": "2026-01-10T14:00:00", "cell_tower_id": "TOWER_100"
    })
    transactions.append({
        "id": "TX_BEFORE_001", "sender_account_id": "ACC010", "receiver_account_id": "ACC002", "amount": 10000.0, "currency": "INR", "transaction_type": "UPI", "status": "COMPLETED", "timestamp": "2026-01-08T12:00:00"
    })
    sightings.append({
        "id": "SIGHT_BEFORE_001", "vehicle_id": "V010", "location_id": "LOC001", "sighting_timestamp": "2026-01-07T09:00:00", "camera_id": "CAM_LOC001_1", "confidence": 0.95, "image_url": "/data/processed/cctv_before1.jpg"
    })

    # Plant EXACTLY 25 AFTER CDRs & 2 AFTER Transactions (₹250k + ₹200k = ₹450,000) & 3 AFTER Sightings (LOC005, LOC010, LOC015) for P010
    for idx in range(1, 26):
        receiver_id = "PH012" if idx % 2 == 0 else "PH015"
        cdr_records.append({
            "id": f"CDR_AFTER_PAT_{idx:03d}",
            "caller_phone_id": "PH010",
            "receiver_phone_id": receiver_id,
            "sim_id": "SIM010",
            "device_id": "DEV010",
            "call_type": "CALL" if idx % 2 == 0 else "SMS",
            "duration_seconds": random.randint(100, 500),
            "timestamp": (anchor_event_time + timedelta(hours=idx*4)).isoformat(),
            "cell_tower_id": f"TOWER_{(idx % 5) + 500}"
        })

    transactions.append({
        "id": "TX_AFTER_001", "sender_account_id": "ACC010", "receiver_account_id": "ACC012", "amount": 250000.0, "currency": "INR", "transaction_type": "RTGS", "status": "COMPLETED", "timestamp": "2026-01-16T11:00:00"
    })
    transactions.append({
        "id": "TX_AFTER_002", "sender_account_id": "ACC010", "receiver_account_id": "ACC015", "amount": 200000.0, "currency": "INR", "transaction_type": "NEFT", "status": "COMPLETED", "timestamp": "2026-01-17T15:30:00"
    })

    sightings.append({
        "id": "SIGHT_AFTER_001", "vehicle_id": "V010", "location_id": "LOC005", "sighting_timestamp": "2026-01-16T16:00:00", "camera_id": "CAM_LOC005_1", "confidence": 0.96, "image_url": "/data/processed/cctv_after1.jpg"
    })
    sightings.append({
        "id": "SIGHT_AFTER_002", "vehicle_id": "V010", "location_id": "LOC010", "sighting_timestamp": "2026-01-17T11:20:00", "camera_id": "CAM_LOC010_1", "confidence": 0.94, "image_url": "/data/processed/cctv_after2.jpg"
    })
    sightings.append({
        "id": "SIGHT_AFTER_003", "vehicle_id": "V010", "location_id": "LOC015", "sighting_timestamp": "2026-01-18T18:45:00", "camera_id": "CAM_LOC015_1", "confidence": 0.95, "image_url": "/data/processed/cctv_after3.jpg"
    })

    ground_truth["hidden_patterns"].append({
        "pattern_id": "PATTERN_TEMPORAL_CHANGE",
        "pattern_type": "TEMPORAL_BEFORE_AFTER_CHANGE",
        "anchor_event_id": "EVT010",
        "anchor_timestamp": "2026-01-15T12:00:00",
        "focal_entity": "P010",
        "baseline_before": {
            "call_frequency": 2,
            "locations": ["LOC001"],
            "total_transaction_amount": 10000.0
        },
        "baseline_after": {
            "call_frequency": 25,
            "new_locations": ["LOC005", "LOC010", "LOC015"],
            "total_transaction_amount": 450000.0,
            "new_connections": ["P012", "P015"]
        },
        "planted_evidence": "Immediate post-event escalation in communication burst (25 calls), high-value transaction (₹4.5 Lakhs total), and 3 new interstate location sightings."
    })

    # Save all datasets to synthetic folder
    datasets = {
        "persons.json": persons,
        "phones.json": phones,
        "sims.json": sims,
        "devices.json": devices,
        "vehicles.json": vehicles,
        "accounts.json": accounts,
        "locations.json": locations,
        "organizations.json": organizations,
        "firs.json": firs,
        "crimes.json": crimes,
        "events.json": events,
        "cdr.json": cdr_records,
        "transactions.json": transactions,
        "sightings.json": sightings,
        "reports.json": reports,
        "ground_truth.json": ground_truth
    }

    for filename, content in datasets.items():
        filepath = OUTPUT_DIR / filename
        with open(filepath, "w", encoding="utf-8") as f:
            json.dump(content, f, indent=2)
        print(f"[Synthetic Data] Generated {filepath.name} ({len(content) if isinstance(content, list) else '1 dict'} records)")

    # 15. Generate Sample FIR Ingestion CSV
    csv_path = OUTPUT_DIR / "sample_fir_ingestion.csv"
    with open(csv_path, "w", newline="", encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["record_id", "date", "time", "person_name", "phone", "vehicle", "location", "district", "state", "police_station", "description"])
        writer.writerow(["REC_001", "2026-01-10", "14:30:00", "Aarav Sharma", "+919810012345", "DL01CA1234", "Connaught Place, New Delhi", "New Delhi", "Delhi", "Connaught Place PS", "Suspicious gathering near bank entrance"])
        writer.writerow(["REC_002", "2026-01-12", "18:15:00", "Vikram Patel", "+919820054321", "MH02CB5678", "Bandra West, Mumbai", "Mumbai Suburban", "Maharashtra", "Bandra West PS", "Vehicle spotted with altered registration plate"])
        writer.writerow(["REC_003", "2026-01-16", "09:00:00", "Deepak Kumar", "+919830098765", "KA03CX9999", "Indiranagar, Bengaluru", "Bengaluru Urban", "Karnataka", "Indiranagar PS", "Reported SIM swap transaction at local kiosk"])
    print(f"[Synthetic Data] Generated sample FIR CSV at {csv_path.name}")

    print("[Synthetic Data] Dataset generation successfully completed!")

if __name__ == "__main__":
    generate_synthetic_dataset()
