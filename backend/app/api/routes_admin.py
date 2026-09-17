import logging
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, Query, Request
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.db.postgres import get_db
from app.models.database_models import AuditLog, UserProfile
from app.api.deps import require_role
from app.services.audit_service import audit_service

logger = logging.getLogger("nexus.api.admin")
router = APIRouter(prefix="/admin", tags=["Administrative & Audit Control"])

class AuditLogItemSchema(BaseModel):
    id: str
    user_id: str
    user_email: Optional[str]
    action: str
    resource_type: Optional[str]
    resource_id: Optional[str]
    metadata_json: Optional[Dict[str, Any]]
    ip_address: Optional[str]
    timestamp: Optional[Any]

class UserProfileSchema(BaseModel):
    id: str
    email: str
    full_name: Optional[str]
    role: str
    unit: str

@router.get("/audit-logs", response_model=List[AuditLogItemSchema])
def get_system_audit_logs(
    limit: int = Query(50, ge=1, le=500),
    request: Request = None,
    db: Session = Depends(get_db),
    admin_user: Dict[str, Any] = Depends(require_role(["ADMIN"]))
):
    """
    Retrieve persistent system audit logs. Requires ADMIN role.
    """
    # Record admin access
    audit_service.log_action(
        db=db,
        user_id=admin_user["id"],
        user_email=admin_user["email"],
        action="ADMIN_VIEW_AUDIT_LOGS",
        resource_type="AUDIT_LOGS",
        resource_id=None,
        ip_address=request.client.host if request and request.client else "127.0.0.1"
    )

    logs = db.query(AuditLog).order_by(AuditLog.timestamp.desc()).limit(limit).all()
    return logs

@router.get("/users", response_model=List[UserProfileSchema])
def list_system_users(
    db: Session = Depends(get_db),
    admin_user: Dict[str, Any] = Depends(require_role(["ADMIN"]))
):
    """
    List user profiles in system. Requires ADMIN role.
    """
    users = db.query(UserProfile).all()
    return users
