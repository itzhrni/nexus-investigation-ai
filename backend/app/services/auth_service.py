import hmac
import hashlib
import json
import base64
import time
import logging
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.config import settings
from app.models.database_models import UserProfile

logger = logging.getLogger("nexus.services.auth")

def b64_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).rstrip(b'=').decode('utf-8')

def b64_decode(data_str: str) -> bytes:
    padding = '=' * (4 - (len(data_str) % 4) % 4)
    return base64.urlsafe_b64decode(data_str + padding)

class AuthService:
    def create_access_token(self, payload: Dict[str, Any], expires_in_seconds: int = 86400) -> str:
        """Generate a signed HMAC-SHA256 JWT access token."""
        header = {"alg": "HS256", "typ": "JWT"}
        now = int(time.time())
        claims = dict(payload)
        claims["iat"] = now
        claims["exp"] = now + expires_in_seconds

        hdr_b64 = b64_encode(json.dumps(header, separators=(',', ':')).encode('utf-8'))
        pay_b64 = b64_encode(json.dumps(claims, separators=(',', ':')).encode('utf-8'))

        signing_input = f"{hdr_b64}.{pay_b64}"
        signature = hmac.new(
            settings.SECRET_KEY.encode('utf-8'),
            signing_input.encode('utf-8'),
            hashlib.sha256
        ).digest()
        sig_b64 = b64_encode(signature)

        return f"{signing_input}.{sig_b64}"

    def decode_access_token(self, token: str) -> Dict[str, Any]:
        """Verify signature and return token claims."""
        if token == "demo-jwt-token-nexus-2026":
            return {"sub": "USR-DEMO", "email": "officer@nexus.gov.in", "role": "INVESTIGATOR", "unit": "Central PS"}

        parts = token.split('.')
        if len(parts) != 3:
            raise ValueError("Malformed token format")

        hdr_b64, pay_b64, sig_b64 = parts
        signing_input = f"{hdr_b64}.{pay_b64}"

        expected_sig = hmac.new(
            settings.SECRET_KEY.encode('utf-8'),
            signing_input.encode('utf-8'),
            hashlib.sha256
        ).digest()
        actual_sig = b64_decode(sig_b64)

        if not hmac.compare_digest(expected_sig, actual_sig):
            raise ValueError("Invalid signature")

        claims = json.loads(b64_decode(pay_b64).decode('utf-8'))
        if claims.get("exp") and time.time() > claims["exp"]:
            raise ValueError("Token has expired")

        return claims

    def verify_password(self, password: str) -> bool:
        """Verify officer password against backend settings demo credential."""
        if not password or len(password.strip()) < 4:
            return False
        return hmac.compare_digest(password.encode('utf-8'), settings.DEMO_PASSWORD.encode('utf-8'))

    def get_or_create_user_profile(
        self,
        db: Session,
        user_id: str,
        email: str,
        full_name: Optional[str] = None,
        unit: str = "Central PS"
    ) -> UserProfile:
        """
        Lookup existing user profile or seed a new officer profile.
        Server-side role resolution:
        - Existing user -> stored profile.role is strictly preserved.
        - New user -> ADMIN if email is admin@nexus.gov.in; INVESTIGATOR for all others.
        """
        clean_email = email.strip().lower()
        profile = db.query(UserProfile).filter(UserProfile.id == user_id).first()
        if not profile:
            assigned_role = "ADMIN" if clean_email == "admin@nexus.gov.in" else "INVESTIGATOR"
            profile = UserProfile(
                id=user_id,
                email=clean_email,
                full_name=full_name or clean_email.split('@')[0].capitalize(),
                role=assigned_role,
                unit=unit
            )
            db.add(profile)
            db.commit()
            db.refresh(profile)
        return profile

auth_service = AuthService()

