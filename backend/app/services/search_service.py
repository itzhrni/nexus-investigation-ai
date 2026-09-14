import logging
from typing import List, Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.models.database_models import (
    Entity, Person, Phone, SIM, Device, Vehicle, BankAccount, Location, FIR, Organization, Crime, Event
)
from app.models.schemas import SearchResponse, EntitySearchResult

logger = logging.getLogger("nexus.services.search")

class SearchService:
    def search(
        self,
        db: Session,
        query_str: str,
        entity_type_filter: Optional[str] = None,
        limit: int = 10
    ) -> SearchResponse:
        """
        Unified Any-Clue Search across all investigation entities.
        Searches across ID, name, MSISDN, ICCID, IMEI, Registration Number, Account Number, FIR number.
        """
        import re
        q = query_str.strip()
        clean_q = re.sub(r"[\s\-_+.]", "", q)
        results: List[EntitySearchResult] = []
        seen_ids = set()

        def add_res(eid: str, etype: str, label: str, mtype: str, conf: float, props: dict = None):
            if eid in seen_ids:
                return
            seen_ids.add(eid)
            results.append(
                EntitySearchResult(
                    entity_id=eid,
                    entity_type=etype,
                    label=label,
                    match_type=mtype,
                    confidence=conf,
                    properties=props or {}
                )
            )

        # 1. Search Persons
        if not entity_type_filter or entity_type_filter.lower() in ["person", "persons"]:
            persons = db.query(Person).filter(
                or_(
                    Person.id.ilike(f"%{q}%"),
                    Person.id.ilike(f"%{clean_q}%"),
                    Person.name.ilike(f"%{q}%"),
                    Person.canonical_name.ilike(f"%{q}%"),
                    Person.address.ilike(f"%{q}%")
                )
            ).limit(limit).all()

            for p in persons:
                mtype = "exact" if p.id.upper() == clean_q.upper() or p.name.lower() == q.lower() else "partial"
                conf = 1.0 if mtype == "exact" else 0.85
                add_res(p.id, "Person", p.name, mtype, conf, {"canonical_name": p.canonical_name, "state": p.state})

            # Search aliases in JSON
            all_persons = db.query(Person).all()
            for p in all_persons:
                if p.id not in seen_ids:
                    if p.aliases and any(q.lower() in str(alias).lower() or clean_q.lower() in str(alias).lower() for alias in p.aliases):
                        add_res(p.id, "Person", p.name, "alias", 0.90, {"matched_alias": q, "state": p.state})

        # 2. Search Phones
        if not entity_type_filter or entity_type_filter.lower() in ["phone", "phones"]:
            phones = db.query(Phone).filter(
                or_(
                    Phone.id.ilike(f"%{q}%"),
                    Phone.id.ilike(f"%{clean_q}%"),
                    Phone.msisdn.ilike(f"%{q}%"),
                    Phone.msisdn.ilike(f"%{clean_q}%"),
                    Phone.registered_name.ilike(f"%{q}%")
                )
            ).limit(limit).all()
            for ph in phones:
                mtype = "exact" if ph.id.upper() == clean_q.upper() or ph.msisdn == clean_q or ph.msisdn == q else "partial"
                add_res(ph.id, "Phone", ph.msisdn, mtype, 1.0 if mtype == "exact" else 0.85, {"carrier": ph.carrier, "registered_name": ph.registered_name})

        # 3. Search SIMs
        if not entity_type_filter or entity_type_filter.lower() in ["sim", "sims"]:
            sims = db.query(SIM).filter(
                or_(
                    SIM.id.ilike(f"%{q}%"),
                    SIM.id.ilike(f"%{clean_q}%"),
                    SIM.iccid.ilike(f"%{q}%"),
                    SIM.iccid.ilike(f"%{clean_q}%"),
                    SIM.imsi.ilike(f"%{q}%")
                )
            ).limit(limit).all()
            for s in sims:
                mtype = "exact" if s.id.upper() == clean_q.upper() or s.iccid == clean_q else "partial"
                add_res(s.id, "SIM", s.iccid or s.id, mtype, 1.0 if mtype == "exact" else 0.85, {"operator": s.operator})

        # 4. Search Devices
        if not entity_type_filter or entity_type_filter.lower() in ["device", "devices"]:
            devices = db.query(Device).filter(
                or_(
                    Device.id.ilike(f"%{q}%"),
                    Device.id.ilike(f"%{clean_q}%"),
                    Device.imei.ilike(f"%{q}%"),
                    Device.imei.ilike(f"%{clean_q}%"),
                    Device.model.ilike(f"%{q}%")
                )
            ).limit(limit).all()
            for d in devices:
                mtype = "exact" if d.id.upper() == clean_q.upper() or d.imei == clean_q else "partial"
                add_res(d.id, "Device", f"{d.brand} {d.model}" if d.brand else d.imei, mtype, 1.0 if mtype == "exact" else 0.85, {"imei": d.imei})

        # 5. Search Vehicles
        if not entity_type_filter or entity_type_filter.lower() in ["vehicle", "vehicles"]:
            vehicles = db.query(Vehicle).filter(
                or_(
                    Vehicle.id.ilike(f"%{q}%"),
                    Vehicle.id.ilike(f"%{clean_q}%"),
                    Vehicle.registration_number.ilike(f"%{q}%"),
                    Vehicle.registration_number.ilike(f"%{clean_q}%")
                )
            ).limit(limit).all()
            for v in vehicles:
                mtype = "exact" if v.id.upper() == clean_q.upper() or v.registration_number.upper() == clean_q.upper() else "partial"
                add_res(v.id, "Vehicle", v.registration_number, mtype, 1.0 if mtype == "exact" else 0.85, {"make": v.make, "model": v.model})

        # 6. Search Accounts
        if not entity_type_filter or entity_type_filter.lower() in ["bankaccount", "account", "accounts"]:
            accounts = db.query(BankAccount).filter(
                or_(
                    BankAccount.id.ilike(f"%{q}%"),
                    BankAccount.id.ilike(f"%{clean_q}%"),
                    BankAccount.account_number.ilike(f"%{q}%"),
                    BankAccount.account_number.ilike(f"%{clean_q}%")
                )
            ).limit(limit).all()
            for a in accounts:
                mtype = "exact" if a.id.upper() == clean_q.upper() or a.account_number == clean_q else "partial"
                add_res(a.id, "BankAccount", a.account_number, mtype, 1.0 if mtype == "exact" else 0.85, {"bank_name": a.bank_name})

        # 7. Search Locations
        if not entity_type_filter or entity_type_filter.lower() in ["location", "locations"]:
            locs = db.query(Location).filter(
                or_(
                    Location.id.ilike(f"%{q}%"),
                    Location.id.ilike(f"%{clean_q}%"),
                    Location.name.ilike(f"%{q}%"),
                    Location.police_station.ilike(f"%{q}%")
                )
            ).limit(limit).all()
            for loc in locs:
                mtype = "exact" if loc.id.upper() == clean_q.upper() or loc.name.lower() == q.lower() else "partial"
                add_res(loc.id, "Location", loc.name, mtype, 1.0 if mtype == "exact" else 0.85, {"state": loc.state, "police_station": loc.police_station})

        # 8. Search FIRs
        if not entity_type_filter or entity_type_filter.lower() in ["fir", "firs"]:
            firs = db.query(FIR).filter(
                or_(
                    FIR.id.ilike(f"%{q}%"),
                    FIR.id.ilike(f"%{clean_q}%"),
                    FIR.fir_number.ilike(f"%{q}%"),
                    FIR.fir_number.ilike(f"%{clean_q}%"),
                    FIR.summary.ilike(f"%{q}%")
                )
            ).limit(limit).all()
            for fir in firs:
                mtype = "exact" if fir.id.upper() == clean_q.upper() or clean_q.upper() in fir.fir_number.upper() else "partial"
                add_res(fir.id, "FIR", fir.fir_number, mtype, 1.0 if mtype == "exact" else 0.85, {"crime_type": fir.crime_type, "police_station": fir.police_station})

        return SearchResponse(
            query=query_str,
            total_matches=len(results[:limit]),
            results=results[:limit]
        )

search_service = SearchService()
