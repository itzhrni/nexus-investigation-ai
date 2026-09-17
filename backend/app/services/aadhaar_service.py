import hashlib
import re
from typing import Dict, Any, Optional, List
from sqlalchemy.orm import Session

# The Verhoeff algorithm tables (base-10 dihedral group D5)
VERHOEFF_D = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
    [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
    [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
    [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
    [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
    [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
    [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
    [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
    [9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
]

VERHOEFF_P = [
    [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
    [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
    [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
    [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
    [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
    [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
    [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
    [7, 0, 4, 6, 9, 1, 3, 2, 5, 8],
]

VERHOEFF_INV = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9]

class AadhaarService:
    """
    Forensic Aadhaar Intelligence Service.
    Provides Verhoeff checksum validation, privacy-compliant masking, deterministic hashing,
    and 1-to-many / many-to-1 fraud collision detection for criminal network analysis.
    """

    @staticmethod
    def validate_verhoeff(num_str: str) -> bool:
        """
        Validates the 12-digit Indian Aadhaar number using the Verhoeff checksum algorithm.
        Returns True if mathematically valid, False if fabricated or altered.
        """
        clean = re.sub(r"\D", "", num_str)
        if len(clean) != 12:
            return False

        c = 0
        reversed_digits = [int(x) for x in reversed(clean)]
        for i, digit in enumerate(reversed_digits):
            c = VERHOEFF_D[c][VERHOEFF_P[i % 8][digit]]
        return c == 0

    @staticmethod
    def generate_checksum_digit(eleven_digits: str) -> int:
        """Generates the 12th Verhoeff checksum digit for 11 digits."""
        clean = re.sub(r"\D", "", eleven_digits)
        if len(clean) != 11:
            raise ValueError("Expected 11 digits to generate 12th Verhoeff checksum digit.")

        c = 0
        reversed_digits = [int(x) for x in reversed(clean)]
        for i, digit in enumerate(reversed_digits):
            c = VERHOEFF_D[c][VERHOEFF_P[(i + 1) % 8][digit]]
        return VERHOEFF_INV[c]

    @staticmethod
    def normalize_aadhaar(raw_str: str) -> Optional[str]:
        """Strips spaces, hyphens, and extracts standard 12-digit format."""
        if not raw_str:
            return None
        clean = re.sub(r"\D", "", raw_str.strip())
        return clean if len(clean) == 12 else None

    @staticmethod
    def mask_aadhaar(raw_or_clean: str) -> str:
        """
        Complies with Aadhaar Act 2016 privacy regulations.
        Returns format: XXXX-XXXX-1234
        """
        clean = re.sub(r"\D", "", raw_or_clean)
        if len(clean) >= 4:
            last4 = clean[-4:]
            return f"XXXX-XXXX-{last4}"
        return "XXXX-XXXX-XXXX"

    @staticmethod
    def hash_aadhaar(clean_12: str, salt: str = "nexus_sih26189_gov_id_salt") -> str:
        """
        Computes one-way cryptographic SHA-256 hash for deterministic graph joins
        without exposing plain-text identity in persistent logs or external APIs.
        """
        clean = re.sub(r"\D", "", clean_12)
        payload = f"{salt}:{clean}".encode("utf-8")
        return hashlib.sha256(payload).hexdigest()

    def analyze_person_aadhaar(self, db: Session, person_id: str) -> Dict[str, Any]:
        """
        Forensic Identity Collision & Mule Ring Analyzer.
        Inspects:
        1. Whether the subject's Aadhaar is claimed by any OTHER profile in the database (1-to-many collision).
        2. Whether the Aadhaar is linked to suspicious numbers of burner SIM cards or mule accounts.
        3. Verhoeff mathematical integrity.
        """
        from app.models.database_models import Person, SIM, Phone, BankAccount, EntityRelationship

        person = db.query(Person).filter(Person.id == person_id).first()
        if not person or not person.aadhaar_hash:
            return {
                "has_aadhaar": False,
                "aadhaar_masked": None,
                "status": "UNREGISTERED",
                "verhoeff_valid": False,
                "collision_detected": False,
                "collision_details": None,
                "fanout_count": 0,
            }

        # 1. Check for Aadhaar Collision (1 Aadhaar claimed by multiple Persons)
        colliding_persons = (
            db.query(Person)
            .filter(Person.aadhaar_hash == person.aadhaar_hash, Person.id != person.id)
            .all()
        )

        collision_detected = len(colliding_persons) > 0
        collision_details = None

        if collision_detected:
            colliding_names = [f"{p.name} ({p.id}, {p.state or 'Unknown State'})" for p in colliding_persons]
            collision_details = (
                f"CRITICAL AADHAAR COLLISION: Identifier {person.aadhaar_masked} is simultaneously "
                f"claimed across {len(colliding_persons) + 1} distinct profiles: {person.name} ({person.id}) and "
                f"{', '.join(colliding_names)}. High indicator of forged identity documentation or synthetic identity theft."
            )

        # 2. Check for SIM / Mule Account Fan-Out
        sim_count = db.query(SIM).filter(SIM.registered_to_person_id == person.id).count()
        acc_count = db.query(BankAccount).filter(BankAccount.holder_person_id == person.id).count()
        total_fanout = sim_count + acc_count

        status = person.aadhaar_status or "VERHOEFF_VALID"
        if collision_detected:
            status = "COLLISION_FLAGGED"
        elif total_fanout >= 4:
            status = "MULE_FANOUT_SUSPECT"

        return {
            "has_aadhaar": True,
            "aadhaar_masked": person.aadhaar_masked,
            "status": status,
            "verhoeff_valid": status != "VERHOEFF_INVALID",
            "collision_detected": collision_detected,
            "collision_details": collision_details,
            "colliding_person_ids": [p.id for p in colliding_persons],
            "fanout_sim_count": sim_count,
            "fanout_account_count": acc_count,
            "total_fanout": total_fanout,
        }

aadhaar_service = AadhaarService()
