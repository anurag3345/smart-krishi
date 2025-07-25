from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.sql import func
from database import Base

class Machinery(Base):
    __tablename__ = "machinery"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(500))
    price_per_hour = Column(Float, nullable=False)
    # location = Column(String(100), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    owner_name = Column(String(100), nullable=False)
    owner_phone = Column(String(20), nullable=False)
    image_url = Column(String(255))
    available_from = Column(DateTime)
    available_to = Column(DateTime)
    delivery_available = Column(Boolean, default=False)
    delivery_charge = Column(Float)
    is_available = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(Integer, primary_key=True, index=True)
    machinery_id = Column(Integer, ForeignKey("machinery.id"))
    user_phone = Column(String(20), nullable=False)
    start_time = Column(DateTime, nullable=False)
    end_time = Column(DateTime, nullable=False)
    delivery_type = Column(String(20), nullable=False)
    total_price = Column(Float, nullable=False)
    booking_date = Column(DateTime(timezone=True), server_default=func.now())