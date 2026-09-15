import logging
from typing import List, Optional, Dict, Any
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.db.postgres import get_db
from app.services.auth_service import auth_service
from app.services.audit_service import audit_service

logger = logging.getLogger("nexus.api.deps")
security = HTTPBearer(auto_error=False)

def get_current_user(
    request: Request,
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
    db: Session = Depends(get_db)
) -> Dict[str, Any]:
    """
    FastAPI dependency enforcing authentication via Bearer JWT.
    Returns current user dict or raises HTTP 401 Unauthorized.
    """
    if not credentials or not credentials.credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication token required. Provide 'Authorization: Bearer <token>'",
            headers={"WWW-Authenticate": "Bearer"}
        )

    token = credentials.credentials
    try:
        claims = auth_service.decode_access_token(token)
    except Exception as err:
        logger.debug(f"Authentication failure: {err}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired authentication token: {str(err)}",
            headers={"WWW-Authenticate": "Bearer"}
        )

    user_id = claims.get("sub") or claims.get("id")
    email = claims.get("email") or "officer@nexus.gov.in"
    role = claims.get("role") or "INVESTIGATOR"
    unit = claims.get("unit") or "Central PS"

    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token payload missing subject identifier",
            headers={"WWW-Authenticate": "Bearer"}
        )

    user_info = {
        "id": user_id,
        "email": email,
        "role": role,
        "unit": unit
    }

    # Attach to request state for audit logging
    request.state.user = user_info
    return user_info

class RoleChecker:
    def __init__(self, allowed_roles: List[str]):
        self.allowed_roles = allowed_roles

    def __call__(self, user: Dict[str, Any] = Depends(get_current_user)) -> Dict[str, Any]:
        user_role = (user.get("role") or "INVESTIGATOR").upper()
        allowed_upper = [r.upper() for r in self.allowed_roles]

        if user_role not in allowed_upper:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required role: {', '.join(self.allowed_roles)}. Current role: {user_role}"
            )
        return user

def require_role(roles: List[str]):
    return RoleChecker(roles)
