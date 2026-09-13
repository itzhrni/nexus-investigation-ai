-- NEXUS AI Criminal Network Analysis System
-- Supabase PostgreSQL Schema Initialization DDL (Enriched Version)

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Entities Registry Table
CREATE TABLE IF NOT EXISTS entities (
    id VARCHAR(64) PRIMARY KEY,
    entity_type VARCHAR(64) NOT NULL,
    primary_identifier VARCHAR(128) NOT NULL,
    metadata_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_entities_type ON entities(entity_type);
CREATE INDEX IF NOT EXISTS idx_entities_identifier ON entities(primary_identifier);

-- 2. Persons Table (Enriched for Bharat-aware Entity Resolution)
CREATE TABLE IF NOT EXISTS persons (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    canonical_name VARCHAR(128),
    name_variants JSONB,
    aliases JSONB,
    gender VARCHAR(16),
    dob VARCHAR(32),
    nationality VARCHAR(64),
    language VARCHAR(32),
    address TEXT,
    state VARCHAR(64),
    district VARCHAR(64),
    phonetic_key VARCHAR(64),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_persons_name ON persons(name);
CREATE INDEX IF NOT EXISTS idx_persons_canonical ON persons(canonical_name);
CREATE INDEX IF NOT EXISTS idx_persons_state ON persons(state);
CREATE INDEX IF NOT EXISTS idx_persons_district ON persons(district);
CREATE INDEX IF NOT EXISTS idx_persons_phonetic ON persons(phonetic_key);

-- 3. Phones Table
CREATE TABLE IF NOT EXISTS phones (
    id VARCHAR(64) PRIMARY KEY,
    msisdn VARCHAR(32) NOT NULL UNIQUE,
    carrier VARCHAR(64),
    status VARCHAR(32) DEFAULT 'active',
    registered_name VARCHAR(128),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_phones_msisdn ON phones(msisdn);

-- 4. SIM Cards Table
CREATE TABLE IF NOT EXISTS sims (
    id VARCHAR(64) PRIMARY KEY,
    iccid VARCHAR(64) NOT NULL UNIQUE,
    imsi VARCHAR(64),
    operator VARCHAR(64),
    registered_to_person_id VARCHAR(64) REFERENCES persons(id) ON DELETE SET NULL,
    status VARCHAR(32) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sims_iccid ON sims(iccid);

-- 5. Devices Table
CREATE TABLE IF NOT EXISTS devices (
    id VARCHAR(64) PRIMARY KEY,
    imei VARCHAR(64) NOT NULL UNIQUE,
    model VARCHAR(64),
    brand VARCHAR(64),
    os VARCHAR(64),
    status VARCHAR(32) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_devices_imei ON devices(imei);

-- 6. Vehicles Table
CREATE TABLE IF NOT EXISTS vehicles (
    id VARCHAR(64) PRIMARY KEY,
    registration_number VARCHAR(32) NOT NULL UNIQUE,
    vehicle_type VARCHAR(64),
    make VARCHAR(64),
    model VARCHAR(64),
    color VARCHAR(32),
    owner_person_id VARCHAR(64) REFERENCES persons(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vehicles_reg ON vehicles(registration_number);

-- 7. Bank Accounts Table
CREATE TABLE IF NOT EXISTS bank_accounts (
    id VARCHAR(64) PRIMARY KEY,
    account_number VARCHAR(64) NOT NULL UNIQUE,
    bank_name VARCHAR(128) NOT NULL,
    ifsc VARCHAR(32),
    account_type VARCHAR(32),
    holder_person_id VARCHAR(64) REFERENCES persons(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_bank_accounts_acc ON bank_accounts(account_number);

-- 8. Organizations Table
CREATE TABLE IF NOT EXISTS organizations (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    org_type VARCHAR(64),
    registration_no VARCHAR(64),
    address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orgs_name ON organizations(name);

-- 9. Locations Table (Enriched for Jurisdiction Metadata)
CREATE TABLE IF NOT EXISTS locations (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(128) NOT NULL,
    location_type VARCHAR(64),
    address TEXT,
    state VARCHAR(64),
    district VARCHAR(64),
    police_station VARCHAR(128),
    jurisdiction_id VARCHAR(64),
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_locations_name ON locations(name);
CREATE INDEX IF NOT EXISTS idx_locations_state ON locations(state);
CREATE INDEX IF NOT EXISTS idx_locations_district ON locations(district);
CREATE INDEX IF NOT EXISTS idx_locations_ps ON locations(police_station);

-- 10. FIRs Table (Enriched for Jurisdiction Metadata)
CREATE TABLE IF NOT EXISTS firs (
    id VARCHAR(64) PRIMARY KEY,
    fir_number VARCHAR(64) NOT NULL UNIQUE,
    police_station VARCHAR(128) NOT NULL,
    district VARCHAR(64),
    state VARCHAR(64),
    jurisdiction_id VARCHAR(64),
    crime_type VARCHAR(128) NOT NULL,
    status VARCHAR(64) DEFAULT 'UNDER_INVESTIGATION',
    incident_date VARCHAR(32),
    summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_firs_number ON firs(fir_number);
CREATE INDEX IF NOT EXISTS idx_firs_state ON firs(state);
CREATE INDEX IF NOT EXISTS idx_firs_ps ON firs(police_station);

-- 11. Crimes Table (Enriched for Jurisdiction Metadata)
CREATE TABLE IF NOT EXISTS crimes (
    id VARCHAR(64) PRIMARY KEY,
    crime_code VARCHAR(64) NOT NULL,
    title VARCHAR(128) NOT NULL,
    category VARCHAR(64) NOT NULL,
    severity VARCHAR(32) DEFAULT 'MEDIUM',
    status VARCHAR(32) DEFAULT 'OPEN',
    location_id VARCHAR(64) REFERENCES locations(id) ON DELETE SET NULL,
    police_station VARCHAR(128),
    district VARCHAR(64),
    state VARCHAR(64),
    jurisdiction_id VARCHAR(64),
    date VARCHAR(32),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_crimes_code ON crimes(crime_code);

-- 12. Events Table (Enriched for Jurisdiction Metadata)
CREATE TABLE IF NOT EXISTS events (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(128) NOT NULL,
    event_type VARCHAR(64) NOT NULL,
    timestamp VARCHAR(32) NOT NULL,
    location_id VARCHAR(64) REFERENCES locations(id) ON DELETE SET NULL,
    police_station VARCHAR(128),
    district VARCHAR(64),
    state VARCHAR(64),
    jurisdiction_id VARCHAR(64),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 13. Call Detail Records (CDR) Table
CREATE TABLE IF NOT EXISTS cdr_records (
    id VARCHAR(64) PRIMARY KEY,
    caller_phone_id VARCHAR(64) REFERENCES phones(id) ON DELETE CASCADE,
    receiver_phone_id VARCHAR(64) REFERENCES phones(id) ON DELETE CASCADE,
    sim_id VARCHAR(64) REFERENCES sims(id) ON DELETE SET NULL,
    device_id VARCHAR(64) REFERENCES devices(id) ON DELETE SET NULL,
    call_type VARCHAR(32) NOT NULL,
    duration_seconds INT DEFAULT 0,
    timestamp VARCHAR(32) NOT NULL,
    cell_tower_id VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_cdr_caller ON cdr_records(caller_phone_id);
CREATE INDEX IF NOT EXISTS idx_cdr_receiver ON cdr_records(receiver_phone_id);
CREATE INDEX IF NOT EXISTS idx_cdr_timestamp ON cdr_records(timestamp);

-- 14. Financial Transactions Table
CREATE TABLE IF NOT EXISTS financial_transactions (
    id VARCHAR(64) PRIMARY KEY,
    sender_account_id VARCHAR(64) REFERENCES bank_accounts(id) ON DELETE CASCADE,
    receiver_account_id VARCHAR(64) REFERENCES bank_accounts(id) ON DELETE CASCADE,
    amount DOUBLE PRECISION NOT NULL,
    currency VARCHAR(16) DEFAULT 'INR',
    transaction_type VARCHAR(32) NOT NULL,
    status VARCHAR(32) DEFAULT 'COMPLETED',
    timestamp VARCHAR(32) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tx_sender ON financial_transactions(sender_account_id);
CREATE INDEX IF NOT EXISTS idx_tx_receiver ON financial_transactions(receiver_account_id);
CREATE INDEX IF NOT EXISTS idx_tx_timestamp ON financial_transactions(timestamp);

-- 15. Vehicle Sightings Table
CREATE TABLE IF NOT EXISTS vehicle_sightings (
    id VARCHAR(64) PRIMARY KEY,
    vehicle_id VARCHAR(64) REFERENCES vehicles(id) ON DELETE CASCADE,
    location_id VARCHAR(64) REFERENCES locations(id) ON DELETE CASCADE,
    sighting_timestamp VARCHAR(32) NOT NULL,
    camera_id VARCHAR(64),
    confidence DOUBLE PRECISION DEFAULT 0.95,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_sightings_vehicle ON vehicle_sightings(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_sightings_location ON vehicle_sightings(location_id);
CREATE INDEX IF NOT EXISTS idx_sightings_timestamp ON vehicle_sightings(sighting_timestamp);

-- 16. Intelligence Reports Table
CREATE TABLE IF NOT EXISTS reports (
    id VARCHAR(64) PRIMARY KEY,
    report_number VARCHAR(64) NOT NULL UNIQUE,
    title VARCHAR(128) NOT NULL,
    source_agency VARCHAR(128) NOT NULL,
    author VARCHAR(128),
    report_date VARCHAR(32) NOT NULL,
    text_content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reports_number ON reports(report_number);

-- 17. Evidence Records Table
CREATE TABLE IF NOT EXISTS evidence_records (
    id VARCHAR(64) PRIMARY KEY,
    evidence_type VARCHAR(64) NOT NULL,
    source VARCHAR(128) NOT NULL,
    description TEXT,
    confidence DOUBLE PRECISION DEFAULT 1.0,
    raw_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_evidence_type ON evidence_records(evidence_type);

-- 18. Entity Relationships Table (PostgreSQL Graph Layer)
CREATE TABLE IF NOT EXISTS entity_relationships (
    id VARCHAR(64) PRIMARY KEY,
    source_entity_type VARCHAR(64) NOT NULL,
    source_entity_id VARCHAR(64) NOT NULL,
    target_entity_type VARCHAR(64) NOT NULL,
    target_entity_id VARCHAR(64) NOT NULL,
    relationship_type VARCHAR(64) NOT NULL,
    confidence DOUBLE PRECISION DEFAULT 1.0,
    event_timestamp VARCHAR(64),
    metadata_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_rel_source ON entity_relationships(source_entity_id);
CREATE INDEX IF NOT EXISTS idx_rel_target ON entity_relationships(target_entity_id);
CREATE INDEX IF NOT EXISTS idx_rel_source_type ON entity_relationships(source_entity_type);
CREATE INDEX IF NOT EXISTS idx_rel_target_type ON entity_relationships(target_entity_type);
CREATE INDEX IF NOT EXISTS idx_rel_type ON entity_relationships(relationship_type);
CREATE INDEX IF NOT EXISTS idx_rel_timestamp ON entity_relationships(event_timestamp);
CREATE INDEX IF NOT EXISTS idx_rel_src_tgt ON entity_relationships(source_entity_id, target_entity_id);

