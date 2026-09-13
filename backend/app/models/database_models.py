from sqlalchemy import Column, String, Integer, DateTime, Text, JSON, Float, ForeignKey
from sqlalchemy.sql import func
from app.db.postgres import Base

class EvidenceRecord(Base):
    __tablename__ = "evidence_records"

    id = Column(String, primary_key=True, index=True)
    evidence_type = Column(String, nullable=False, index=True)  # FIR, CCTV, CDR, BANK_TX
    source = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    confidence = Column(Float, default=1.0)
    raw_data = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class EntityRecord(Base):
    __tablename__ = "entity_records"

    id = Column(String, primary_key=True, index=True)
    entity_type = Column(String, nullable=False, index=True)  # Person, Phone, Vehicle, etc.
    identifier = Column(String, nullable=False, index=True)
    attributes = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
