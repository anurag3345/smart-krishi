from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum

class DeliveryType(str, Enum):
    SELF_PICKUP = "self_pickup"
    OWNER_DELIVERY = "owner_delivery"

class MachineryBase(BaseModel):
    machine_name: str = Field(..., min_length=3, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    price_per_hour: float = Field(..., gt=0)
    location: str
    available_from: datetime
    available_to: datetime
    delivery_available: bool = False
    delivery_charge: Optional[float] = Field(None, ge=0)

class MachineryCreate(MachineryBase):
    owner_name: str
    owner_phone: str 

class MachineryOut(MachineryBase):
    id: int
    owner_name: str
    owner_phone: str
    image_url: Optional[str]
    is_available: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class BookingCreate(BaseModel):
    machinery_id: int
    start_time: datetime
    end_time: datetime
    delivery_type: DeliveryType
    user_phone: str 

class BookingOut(BaseModel):
    id: int
    machinery_name: str
    owner_name: str
    owner_phone: str
    location: str
    price_per_hour: float
    total_price: float
    start_time: datetime
    end_time: datetime
    delivery_type: DeliveryType
    delivery_charge: Optional[float]
    booking_date: datetime
    
    class Config:
        from_attributes = True

class MachineryUpdate(BaseModel):
    machine_name: Optional[str]
    description: Optional[str]
    price_per_hour: Optional[float]
    latitude: Optional[float]
    longitude: Optional[float]
    available_from: Optional[datetime]
    available_to: Optional[datetime]
    delivery_available: Optional[bool]
    delivery_charge: Optional[float]
    is_available: Optional[bool]