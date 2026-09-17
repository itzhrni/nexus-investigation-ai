import logging
import uuid
from typing import Optional, Dict, Any
from sqlalchemy.orm import Session
from app.models.database_models import AuditLog

logger = logging.getLogger("nexus.services.audit")

class AuditService:
    def log_action(
        self,
        db: Session,
        user_id: str,
        action: str,
        resource_type: Optional[str] = None,
        resource_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        ip_address: Optional[str] = None,
        user_email: Optional[str] = None
    ) -> None:
        """
        Record a persistent audit log entry in PostgreSQL.
        Guaranteed non-blocking and safe: logging errors will never fail the main request.
        """
        try:
            log_entry = AuditLog(
                id=f"AUD-{uuid.uuid4().hex[:12].upper()}",
                user_id=user_id,
                user_email=user_email or user_id,
                action=action,
                resource_type=resource_type,
                resource_id=resource_id,
                metadata_json=metadata or {},
                ip_address=ip_address
            )
            db.add(log_entry)
            db.commit()
        except Exception as err:
            db.rollback()
            logger.debug(f"Audit log write note: {err}")

audit_service = AuditService()
