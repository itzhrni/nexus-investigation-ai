import logging
from typing import Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.db.postgres import get_db
from app.services.auth_service import auth_service
from app.services.audit_service import audit_service
from app.api.deps import get_current_user

logger = logging.getLogger("nexus.api.auth")
router = APIRouter(prefix="/auth", tags=["Authentication & Access Control"])

class LoginRequest(BaseModel):
    email: str = Field(..., example="officer@nexus.gov.in")
    password: str = Field(..., example="demo1234")
    unit: Optional[str] = Field("Central PS", example="Central PS")

class UserResponse(BaseModel):
    id: str
    email: str
    role: str
    unit: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

@router.post("/login", response_model=TokenResponse)
def login_for_access_token(
    req: LoginRequest,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Authenticate investigator/admin officer and issue signed JWT access token.
    Enforces password verification, trusted server-side role resolution, and audit logging.
    """
    client_ip = request.client.host if request and request.client else "127.0.0.1"
    clean_email = (req.email or "").strip().lower()

    if not clean_email or not req.password or not auth_service.verify_password(req.password):
        # Record failed login attempt
        audit_service.log_action(
            db=db,
            user_id=f"USR-{clean_email.split('@')[0].upper()}" if clean_email else "USR-UNKNOWN",
            user_email=clean_email or "unknown@nexus.gov.in",
            action="AUTH_LOGIN_FAILED",
            resource_type="USER_SESSION",
            resource_id=None,
            metadata={"reason": "Invalid credentials attempt"},
            ip_address=client_ip
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"}
        )

    user_id = f"USR-{clean_email.split('@')[0].upper()}"

    # Lookup or create UserProfile (role is determined strictly server-side)
    profile = auth_service.get_or_create_user_profile(
        db=db,
        user_id=user_id,
        email=clean_email,
        unit=req.unit or "Central PS"
    )

    # Issue JWT token with trusted server-side role
    claims = {
        "sub": profile.id,
        "email": profile.email,
        "role": profile.role,
        "unit": profile.unit
    }
    access_token = auth_service.create_access_token(claims)

    # Record persistent audit log entry for successful login
    audit_service.log_action(
        db=db,
        user_id=profile.id,
        user_email=profile.email,
        action="AUTH_LOGIN",
        resource_type="USER_SESSION",
        resource_id=profile.id,
        metadata={"unit": profile.unit, "role": profile.role},
        ip_address=client_ip
    )

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse(
            id=profile.id,
            email=profile.email,
            role=profile.role,
            unit=profile.unit
        )
    )


@router.get("/me", response_model=UserResponse)
def get_current_user_profile(user: Dict[str, Any] = Depends(get_current_user)):
    """Return currently authenticated officer profile."""
    return UserResponse(
        id=user["id"],
        email=user["email"],
        role=user["role"],
        unit=user["unit"]
    )
