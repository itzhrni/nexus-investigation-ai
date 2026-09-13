import json
import random
import os
from pathlib import Path
from datetime import datetime, timedelta

# Set fixed random seed for deterministic reproducibility
random.seed(42)

OUTPUT_DIR = Path(__file__).resolve().parent.parent / "data" / "synthetic"

FIRST_NAMES = ["Aarav", "Aditya", "Rohan", "Vikram", "Karan", "Siddharth", "Priya", "Ananya", "Rajesh", "Suresh",
               "Meera", "Deepak", "Sunil", "Manish", "Pooja", "Rahul", "Vijay", "Anita", "Nikhil", "Amit",
               "Harish", "Sanjay", "Ramesh", "Gautam", "Neha", "Divya", "Arjun", "Preeti", "Alok", "Varun",
               "Simran", "Kabir", "Tarun", "Bhavna", "Vishal", "Yash", "Sneha", "Nitin", "Mohit", "Ashok"]

LAST_NAMES = ["Sharma", "Verma", "Gupta", "Patel", "Singh", "Kumar", "Reddy", "Rao", "Joshi", "Nair",
              "Mehta", "Deshmukh", "Chawla", "Agarwal", "Bhatnagar", "Iyer", "Choudhury", "Saxena", "Kapoor", "Mishra"]

CITIES = [
    {"name": "Connaught Place, New Delhi", "lat": 28.6315, "lng": 77.2167},
    {"name": "Bandra West, Mumbai", "lat": 19.0596, "lng": 72.8295},
    {"name": "Indiranagar, Bengaluru", "lat": 12.9784, "lng": 77.6408},
    {"name": "Park Street, Kolkata", "lat": 22.5551, "lng": 88.3517},
    {"name": "Cyber City, Gurugram", "lat": 28.4950, "lng": 77.0895},
    {"name": "Gachibowli, Hyderabad", "lat": 17.4401, "lng": 78.3489},
    {"name": "Anna Nagar, Chennai", "lat": 13.0850, "lng": 80.2101},
    {"name": "FC Road, Pune", "lat": 18.5204, "lng": 73.8415},
    {"name": "SG Highway, Ahmedabad", "lat": 23.0225, "lng": 72.5714},
    {"name": "Hazratganj, Lucknow", "lat": 26.8467, "lng": 80.9462},
    {"name": "MI Road, Jaipur", "lat": 26.9124, "lng": 75.7873},
    {"name": "Sector 17, Chandigarh", "lat": 30.7398, "lng": 76.7827},
    {"name": "Bani Park, Jaipur", "lat": 26.9260, "lng": 75.7920},
    {"name": "MG Road, Kochi", "lat": 9.9726, "lng": 76.2780},
    {"name": "Salt Lake, Kolkata", "lat": 22.5867, "lng": 88.4171},
    {"name": "Vashi, Navi Mumbai", "lat": 19.0770, "lng": 73.0033},
    {"name": "Whitefield, Bengaluru", "lat": 12.9698, "lng": 77.7500},
    {"name": "Koramangala, Bengaluru", "lat": 12.9352, "lng": 77.6245},
    {"name": "Hitech City, Hyderabad", "lat": 17.4435, "lng": 78.3772},
    {"name": "Juhu, Mumbai", "lat": 19.1075, "lng": 72.8263},
    {"name": "Aerocity, New Delhi", "lat": 28.5520, "lng": 77.1215},
    {"name": "Viman Nagar, Pune", "lat": 18.5679, "lng": 73.9143},
    {"name": "Alipore, Kolkata", "lat": 22.5323, "lng": 88.3308},
    {"name": "Adyar, Chennai", "lat": 13.0012, "lng": 80.2565},
    {"name": "Nungambakkam, Chennai", "lat": 13.0604, "lng": 80.2496}
]

CRIME_TYPES = ["FINANCIAL_FRAUD", "CYBER_HEIST", "SIM_SWAP_RACKET", "IDENTITY_THEFT", "MONEY_LAUNDERING", "HAWALA_NETWORK", "CAR_JACKING"]

def generate_synthetic_dataset():
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    base_time = datetime(2026, 1, 1, 10, 0, 0)

    # 1. Persons (40)
    persons = []
    for i in range(1, 41):
        pid = f"P{i:03d}"
        name = f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"
        persons.append({
            "id": pid,
            "name": name,
            "aliases": [f"Alias_{name.split()[0]}", f"Shadow_{i}"],
            "gender": random.choice(["Male", "Female"]),
            "dob": f"{random.randint(1975, 2002)}-{random.randint(1,12):02d}-{random.randint(1,28):02d}",
            "nationality": "Indian",
            "address": f"Flat {random.randint(101, 909)}, Block {random.choice(['A','B','C'])}, {CITIES[(i-1)%len(CITIES)]['name']}",
            "notes": "Synthetic profile for investigation simulation"
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

    # 7. Locations (25)
    locations = []
    for i in range(1, 26):
        locid = f"LOC{i:03d}"
        loc_info = CITIES[i-1]
        locations.append({
            "id": locid,
            "name": loc_info["name"],
            "location_type": random.choice(["Commercial Hub", "Residential Area", "Transit Hub", "Industrial Zone"]),
            "address": loc_info["name"],
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

    # 9. FIRs (20) & Crimes (20)
    firs = []
    crimes = []
    for i in range(1, 21):
        firid = f"FIR{i:03d}"
        crmid = f"CRM{i:03d}"
        c_type = random.choice(CRIME_TYPES)
        inc_date = (base_time + timedelta(days=i*3)).strftime("%Y-%m-%d")
        
        firs.append({
            "id": firid,
            "fir_number": f"FIR/{2026}/{i:04d}",
            "police_station": f"PS_{locations[(i-1)%len(locations)]['name'].split(',')[0]}",
            "crime_type": c_type,
            "status": "UNDER_INVESTIGATION",
            "incident_date": inc_date,
            "summary": f"Reported case of {c_type.lower().replace('_', ' ')} involving suspicious digital & financial activity."
        })

        crimes.append({
            "id": crmid,
            "crime_code": f"SEC_{400+i}",
            "title": f"Incident {c_type}",
            "category": c_type,
            "severity": random.choice(["HIGH", "CRITICAL", "MEDIUM"]),
            "status": "OPEN",
            "location_id": locations[(i-1)%len(locations)]["id"],
            "date": inc_date
        })

    # 10. Events (20)
    events = []
    for i in range(1, 21):
        evtid = f"EVT{i:03d}"
        events.append({
            "id": evtid,
            "title": f"Investigation Milestone Event {i}",
            "event_type": random.choice(["MEETING_SIGHTING", "ATM_WITHDRAWAL", "CALL_BURST", "SIM_ACTIVATION"]),
            "timestamp": (base_time + timedelta(days=i*2, hours=i)).isoformat(),
            "location_id": locations[(i-1)%len(locations)]["id"],
            "description": "Suspicious event flagged during multi-agency correlation."
        })

    # 11. CDR Records (350)
    cdr_records = []
    for i in range(1, 351):
        cdrid = f"CDR{i:03d}"
        caller_idx = random.randint(0, len(phones)-1)
        receiver_idx = (caller_idx + random.randint(1, len(phones)-1)) % len(phones)
        sim_idx = caller_idx % len(sims)
        dev_idx = caller_idx % len(devices)
        ts = (base_time + timedelta(hours=i*2, minutes=random.randint(0,59))).isoformat()
        
        cdr_records.append({
            "id": cdrid,
            "caller_phone_id": phones[caller_idx]["id"],
            "receiver_phone_id": phones[receiver_idx]["id"],
            "sim_id": sims[sim_idx]["id"],
            "device_id": devices[dev_idx]["id"],
            "call_type": random.choice(["CALL", "SMS"]),
            "duration_seconds": random.randint(10, 600) if i % 2 == 0 else 0,
            "timestamp": ts,
            "cell_tower_id": f"TOWER_{random.randint(100,999)}"
        })

    # 12. Financial Transactions (250)
    transactions = []
    for i in range(1, 251):
        txid = f"TX{i:03d}"
        sender_idx = random.randint(0, len(accounts)-1)
        receiver_idx = (sender_idx + random.randint(1, len(accounts)-1)) % len(accounts)
        ts = (base_time + timedelta(hours=i*3, minutes=random.randint(0,59))).isoformat()
        
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

    # 13. Vehicle Sightings (80)
    sightings = []
    for i in range(1, 81):
        sgtid = f"SIGHT{i:03d}"
        v_idx = random.randint(0, len(vehicles)-1)
        loc_idx = random.randint(0, len(locations)-1)
        ts = (base_time + timedelta(hours=i*4)).isoformat()
        
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

    # Pattern A: Multi-phone Person & SIM Swap Transition
    # Person P001 owns Phone PH001 and PH002, SIM001 transitioned to DEV002
    ground_truth["hidden_patterns"].append({
        "pattern_id": "PATTERN_001_SIM_SWITCH",
        "pattern_type": "SIM_DEVICE_SWITCH",
        "focal_person": "P001",
        "initial_identifiers": {"phone": "PH001", "sim": "SIM001", "device": "DEV001"},
        "switched_identifiers": {"phone": "PH002", "sim": "SIM001", "device": "DEV002"},
        "planted_evidence": "SIM001 reused across DEV001 and DEV002 in consecutive CDR logs."
    })

    # Pattern B: Financial Transfer Loop (Money Laundering Ring)
    # ACC001 -> ACC005 -> ACC012 -> ACC001
    transactions.append({
        "id": "TX_RING_001", "sender_account_id": "ACC001", "receiver_account_id": "ACC005", "amount": 450000.0, "currency": "INR", "transaction_type": "RTGS", "status": "COMPLETED", "timestamp": (base_time + timedelta(days=5)).isoformat()
    })
    transactions.append({
        "id": "TX_RING_002", "sender_account_id": "ACC005", "receiver_account_id": "ACC012", "amount": 445000.0, "currency": "INR", "transaction_type": "NEFT", "status": "COMPLETED", "timestamp": (base_time + timedelta(days=6)).isoformat()
    })
    transactions.append({
        "id": "TX_RING_003", "sender_account_id": "ACC012", "receiver_account_id": "ACC001", "amount": 440000.0, "currency": "INR", "transaction_type": "UPI", "status": "COMPLETED", "timestamp": (base_time + timedelta(days=7)).isoformat()
    })
    ground_truth["hidden_patterns"].append({
        "pattern_id": "PATTERN_002_FINANCIAL_LOOP",
        "pattern_type": "CIRCULAR_TRANSACTIONS",
        "participating_accounts": ["ACC001", "ACC005", "ACC012"],
        "participating_persons": ["P001", "P005", "P012"],
        "planted_evidence": "Sequential high-value transactions forming a financial loop within 48 hours."
    })

    # Pattern C: Location Convergence (Syndicate Meeting)
    # Persons P002, P003, P007 sighted at LOC005 (Cyber City) within 30 minutes
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

    print("[Synthetic Data] Dataset generation successfully completed!")

if __name__ == "__main__":
    generate_synthetic_dataset()
