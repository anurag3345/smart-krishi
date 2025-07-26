from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from enum import Enum


class DeliveryType(str, Enum):
    SELF_PICKUP = "SELF_PICKUP"
    OWNER_DELIVERY = "OWNER_DELIVERY"


class MachineryCreate(BaseModel):
    name: str
    description: Optional[str]
    price_per_hour: float
    latitude: float
    longitude: float
    available_from: datetime
    available_to: datetime
    delivery_available: Optional[bool] = False
    delivery_charge: Optional[float]


class MachineryUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]
    price_per_hour: Optional[float]
    latitude: Optional[float]
    longitude: Optional[float]
    available_from: Optional[datetime]
    available_to: Optional[datetime]
    delivery_available: Optional[bool]
    delivery_charge: Optional[float]
    is_available: Optional[bool]


class MachineryOut(MachineryCreate):
    id: int
    owner_name: str
    owner_phone: str
    image_url: Optional[str]
    is_available: bool = True

    class Config:
        orm_mode = True


class BookingCreate(BaseModel):
    machinery_id: int
    user_phone: str
    start_time: datetime
    end_time: datetime
    delivery_type: DeliveryType


class BookingOut(BookingCreate):
    id: int
    total_price: float
    machinery_name: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    owner_name: Optional[str]
    owner_phone: Optional[str]
    price_per_hour: Optional[float]
    delivery_charge: Optional[float]

    class Config:
        orm_mode = True
