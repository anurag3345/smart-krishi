from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from services.auth import get_current_user
from models.notification import Notification
from schemas.notification import NotificationOut
from models.user import User  # import User here

router = APIRouter()

@router.get("/notifications", response_model=List[NotificationOut])
async def get_notifications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    notifications = db.query(Notification).filter(Notification.user_id == current_user.id).order_by(Notification.created_at.desc()).all()
    return notifications
