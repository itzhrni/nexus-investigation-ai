from sqlalchemy import Column, String, Integer, DateTime, Text, JSON, Float, ForeignKey, Boolean
from sqlalchemy.sql import func
from app.db.postgres import Base

class Entity(Base):
    __tablename__ = "entities"

    id = Column(String, primary_key=True, index=True)
    entity_type = Column(String, nullable=False, index=True)  # Person, Phone, SIM, Device, Vehicle, BankAccount, Location, Organization, Crime, FIR, Event
    primary_identifier = Column(String, nullable=False, index=True)
    metadata_json = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Person(Base):
    __tablename__ = "persons"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    aliases = Column(JSON, nullable=True)  # List of aliases
    gender = Column(String, nullable=True)
    dob = Column(String, nullable=True)
    nationality = Column(String, nullable=True)
    address = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Phone(Base):
    __tablename__ = "phones"

    id = Column(String, primary_key=True, index=True)
    msisdn = Column(String, nullable=False, index=True, unique=True)
    carrier = Column(String, nullable=True)
    status = Column(String, default="active")
    registered_name = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SIM(Base):
    __tablename__ = "sims"

    id = Column(String, primary_key=True, index=True)
    iccid = Column(String, nullable=False, index=True, unique=True)
    imsi = Column(String, nullable=True)
    operator = Column(String, nullable=True)
    registered_to_person_id = Column(String, ForeignKey("persons.id"), nullable=True)
    status = Column(String, default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Device(Base):
    __tablename__ = "devices"

    id = Column(String, primary_key=True, index=True)
    imei = Column(String, nullable=False, index=True, unique=True)
    model = Column(String, nullable=True)
    brand = Column(String, nullable=True)
    os = Column(String, nullable=True)
    status = Column(String, default="active")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Vehicle(Base):
    __tablename__ = "vehicles"

    id = Column(String, primary_key=True, index=True)
    registration_number = Column(String, nullable=False, index=True, unique=True)
    vehicle_type = Column(String, nullable=True)
    make = Column(String, nullable=True)
    model = Column(String, nullable=True)
    color = Column(String, nullable=True)
    owner_person_id = Column(String, ForeignKey("persons.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class BankAccount(Base):
    __tablename__ = "bank_accounts"

    id = Column(String, primary_key=True, index=True)
    account_number = Column(String, nullable=False, index=True, unique=True)
    bank_name = Column(String, nullable=False)
    ifsc = Column(String, nullable=True)
    account_type = Column(String, nullable=True)
    holder_person_id = Column(String, ForeignKey("persons.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Organization(Base):
    __tablename__ = "organizations"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    org_type = Column(String, nullable=True)
    registration_no = Column(String, nullable=True)
    address = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Location(Base):
    __tablename__ = "locations"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    location_type = Column(String, nullable=True)
    address = Column(Text, nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class FIR(Base):
    __tablename__ = "firs"

    id = Column(String, primary_key=True, index=True)
    fir_number = Column(String, nullable=False, index=True, unique=True)
    police_station = Column(String, nullable=False)
    crime_type = Column(String, nullable=False)
    status = Column(String, default="UNDER_INVESTIGATION")
    incident_date = Column(String, nullable=True)
    summary = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Crime(Base):
    __tablename__ = "crimes"

    id = Column(String, primary_key=True, index=True)
    crime_code = Column(String, nullable=False, index=True)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    severity = Column(String, default="MEDIUM")
    status = Column(String, default="OPEN")
    location_id = Column(String, ForeignKey("locations.id"), nullable=True)
    date = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Event(Base):
    __tablename__ = "events"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    event_type = Column(String, nullable=False)
    timestamp = Column(String, nullable=False)
    location_id = Column(String, ForeignKey("locations.id"), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class CDRRecord(Base):
    __tablename__ = "cdr_records"

    id = Column(String, primary_key=True, index=True)
    caller_phone_id = Column(String, ForeignKey("phones.id"), nullable=False, index=True)
    receiver_phone_id = Column(String, ForeignKey("phones.id"), nullable=False, index=True)
    sim_id = Column(String, ForeignKey("sims.id"), nullable=True)
    device_id = Column(String, ForeignKey("devices.id"), nullable=True)
    call_type = Column(String, nullable=False)  # CALL, SMS
    duration_seconds = Column(Integer, default=0)
    timestamp = Column(String, nullable=False, index=True)
    cell_tower_id = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class FinancialTransaction(Base):
    __tablename__ = "financial_transactions"

    id = Column(String, primary_key=True, index=True)
    sender_account_id = Column(String, ForeignKey("bank_accounts.id"), nullable=False, index=True)
    receiver_account_id = Column(String, ForeignKey("bank_accounts.id"), nullable=False, index=True)
    amount = Column(Float, nullable=False)
    currency = Column(String, default="INR")
    transaction_type = Column(String, nullable=False)  # UPI, NEFT, RTGS, CASH
    status = Column(String, default="COMPLETED")
    timestamp = Column(String, nullable=False, index=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class VehicleSighting(Base):
    __tablename__ = "vehicle_sightings"

    id = Column(String, primary_key=True, index=True)
    vehicle_id = Column(String, ForeignKey("vehicles.id"), nullable=False, index=True)
    location_id = Column(String, ForeignKey("locations.id"), nullable=False, index=True)
    sighting_timestamp = Column(String, nullable=False, index=True)
    camera_id = Column(String, nullable=True)
    confidence = Column(Float, default=0.95)
    image_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class IntelligenceReport(Base):
    __tablename__ = "reports"

    id = Column(String, primary_key=True, index=True)
    report_number = Column(String, nullable=False, index=True, unique=True)
    title = Column(String, nullable=False)
    source_agency = Column(String, nullable=False)
    author = Column(String, nullable=True)
    report_date = Column(String, nullable=False)
    text_content = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class EvidenceRecord(Base):
    __tablename__ = "evidence_records"

    id = Column(String, primary_key=True, index=True)
    evidence_type = Column(String, nullable=False, index=True)  # FIR, CCTV, CDR, BANK_TX, INT_REPORT
    source = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    confidence = Column(Float, default=1.0)
    raw_data = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
