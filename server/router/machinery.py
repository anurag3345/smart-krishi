from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File,Form 
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List,Optional
import os
import uuid
from PIL import Image
import io
from datetime import datetime, timezone
from models.notification import Notification

from schemas.machinery import (
    MachineryCreate,
    MachineryOut,
    BookingCreate,
    BookingOut,
    DeliveryType,
    
    
)
from schemas.machinery import MachineryUpdate
from models.machinery import Machinery, Booking
from database import get_db
from services.auth import get_current_user
from models.user import User
from math import radians, cos, sin, asin, sqrt
from fastapi import Depends
from services.auth import get_current_user
# Define haversine function here
def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Radius of earth in km
    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)
    a = sin(dlat / 2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2)**2
    c = 2 * asin(sqrt(a))
    distance = R * c
    return distance

router = APIRouter(prefix="/machinery", tags=["machinery"])

# Image upload directory setup
MACHINERY_IMAGES_DIR = "static/machinery_images"
os.makedirs(MACHINERY_IMAGES_DIR, exist_ok=True)

  
@router.post("/", response_model=MachineryOut)
async def create_machinery(
    name: str = Form(...),
    description: Optional[str] = Form(None),
    price_per_hour: float = Form(...),
    latitude: float = Form(...),
    longitude: float = Form(...),
    owner_name: str = Depends(get_current_user),  # <- **Change here explained below**
    owner_phone: str = Depends(get_current_user), # <- same here
    available_from: datetime = Form(...),
    available_to: datetime = Form(...),
    delivery_available: bool = Form(False),
    delivery_charge: Optional[float] = Form(None),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Use current_user for owner info
    owner_name = current_user.name
    owner_phone = current_user.phone

    # Save image with error handling
    try:
        contents = await image.read()
        img = Image.open(io.BytesIO(contents))
        img.thumbnail((800, 800))
        file_ext = image.filename.split('.')[-1].lower()
        save_format = "JPEG" if file_ext in ['jpg', 'jpeg'] else "PNG"
        filename = f"{uuid.uuid4()}.{file_ext}"
        filepath = os.path.join(MACHINERY_IMAGES_DIR, filename)
        img.save(filepath, save_format)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image processing error: {str(e)}")

    machinery = Machinery(
         name=name,
        description=description,
        price_per_hour=price_per_hour,
        latitude=latitude,
        longitude=longitude,
        owner_name=owner_name,
        owner_phone=owner_phone,
        image_url=f"/{MACHINERY_IMAGES_DIR}/{filename}",
        available_from=available_from,
        available_to=available_to,
        delivery_available=delivery_available,
        delivery_charge=delivery_charge
    )
    db.add(machinery)
    db.commit()
    db.refresh(machinery)
    return machinery




@router.get("/", response_model=List[MachineryOut])
async def get_machinery(
    machine_name:str,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    max_distance: int = 20,  # Default 20km radius
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Machinery).filter(Machinery.is_available == True)

    if min_price:
        query = query.filter(Machinery.price_per_hour >= min_price)

    if max_price:
        query = query.filter(Machinery.price_per_hour <= max_price)

    all_machines = query.all()

    if latitude is not None and longitude is not None:
        # Filter by Haversine distance
        filtered = []
        for machine in all_machines:
            if machine.latitude is not None and machine.longitude is not None:
                dist = haversine(latitude, longitude, machine.latitude, machine.longitude)
                if dist <= max_distance:
                    filtered.append(machine)
        return filtered

    return all_machines

# booking machinery

@router.post("/book", response_model=BookingOut)
async def book_machinery(
    booking: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Debug print to check what machinery is being queried
    print(f"Looking for machinery with ID: {booking.machinery_id} and is_available=True")

    machinery = db.query(Machinery).filter(
        Machinery.id == booking.machinery_id,
        Machinery.is_available == True
    ).first()
    
    print(f"Queried machinery: {machinery}")  # This should show None or Machinery object

    if not machinery:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Machinery not found or not available"
        )
    
    # Optional: check booking times fall within machinery availability
    if booking.start_time < machinery.available_from or booking.end_time > machinery.available_to:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Booking time is outside machinery availability window"
        )
    
    # ... rest of your booking logic

@router.get("/bookings", response_model=List[BookingOut])
async def get_user_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    bookings = db.query(Booking).filter(
        Booking.user_phone == current_user.phone
    ).join(Machinery).all()
    
    return [{
        **booking.__dict__,
        "machinery_name": booking.machinery.name,
        "owner_name": booking.machinery.owner_name,
        "owner_phone": booking.machinery.owner_phone,
        "price_per_hour": booking.machinery.price_per_hour,
        "delivery_charge": booking.machinery.delivery_charge if booking.delivery_type == DeliveryType.OWNER_DELIVERY else None
    } for booking in bookings]

# 🛠️ Update machinery
@router.put("/update/{machinery_id}")
async def update_machinery(
    machinery_id: int,
    updates: MachineryUpdate,
    db: Session = Depends(get_db)
):
    machinery = db.query(Machinery).filter(Machinery.id == machinery_id).first()
    
    if not machinery:
        raise HTTPException(status_code=404, detail="Machinery not found")

    # Apply updates dynamically
    update_data = updates.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(machinery, key, value)

    db.commit()
    db.refresh(machinery)

    return machinery


# ❌ Delete machinery
@router.delete("/delete/{machinery_id}")
def delete_machinery(
    machinery_id: int,
    owner_phone: str,
    db: Session = Depends(get_db)
):
    machinery = db.query(Machinery).filter(Machinery.id == machinery_id).first()

    if not machinery:
        raise HTTPException(status_code=404, detail="Machinery not found")

    if machinery.owner_phone != owner_phone:
        raise HTTPException(status_code=403, detail="Unauthorized to delete this machinery")

    db.delete(machinery)
    db.commit()

    return {"message": "Machinery deleted successfully"}