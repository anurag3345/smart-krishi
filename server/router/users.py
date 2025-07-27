from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional

from schemas.user import UserBase, UserCreate, UserOut, Token, TokenData
from models.user import User
from database import get_db
from services.auth import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_active_user
)

router = APIRouter(prefix="/users", tags=["users"])
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

# User Registration Endpoint
@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register_user(user_data: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user with email, name, password, and optional location
    """
    # Check if email already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    # Hash password and create user
    hashed_password = get_password_hash(user_data.password)
    new_user = User(
        email=user_data.email,
        name=user_data.name,
        password=hashed_password,
        phone=user_data.phone,  # Add phone field
        # location=user_data.location,
        latitude=user_data.latitude,
        longitude=user_data.longitude,

        is_active=True,
        created_at=datetime.utcnow()
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user

# Get Current User Endpoint
@router.get("/me", response_model=UserOut)
async def read_current_user(
    current_user: User = Depends(get_current_active_user)
):
    """
    Get details of the currently authenticated user
    """
    return current_user

# Update User Profile Endpoint
@router.patch("/me", response_model=UserOut)
async def update_user_profile(
    name: Optional[str] = None,
    # location: Optional[str] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,

    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Update user profile information (partial update)
    """
    if name is not None:
        current_user.name = name
    if latitude is not None:
        current_user.latitude = latitude
    if longitude is not None:
        current_user.longitude = longitude

    
    db.commit()
    db.refresh(current_user)
    return current_user

# Change Password Endpoint
@router.post("/change-password", status_code=status.HTTP_204_NO_CONTENT)
async def change_password(
    current_password: str,
    new_password: str,
    current_user: User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """
    Change user password after verifying current password
    """
    if not verify_password(current_password, current_user.password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    
    current_user.password = get_password_hash(new_password)
    db.commit()

# Admin-only: Get All Users
@router.get("/", response_model=list[UserOut])
async def get_all_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
):
    """
    Get list of all users (admin only)
    """
    if not current_user.is_admin:  # Assuming you have an is_admin field
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can access this endpoint"
        )
    
    users = db.query(User).offset(skip).limit(limit).all()
    return users