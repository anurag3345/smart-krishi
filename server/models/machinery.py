from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Enum, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import enum


class DeliveryType(str, enum.Enum):
    SELF_PICKUP = "SELF_PICKUP"
    OWNER_DELIVERY = "OWNER_DELIVERY"


class Machinery(Base):
    __tablename__ = "machinery"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(String(500))
    price_per_hour = Column(Float, nullable=False)
    latitude = Column(Float)
    longitude = Column(Float)
    owner_name = Column(String(100))
    owner_phone = Column(String(20))
    image_url = Column(String(255))
    available_from = Column(DateTime)
    available_to = Column(DateTime)
    delivery_available = Column(Boolean, default=False)
    delivery_charge = Column(Float)
    is_available = Column(Boolean, default=True)

    bookings = relationship("Booking", back_populates="machinery")


class Booking(Base):
    __tablename__ = "booking"

    id = Column(Integer, primary_key=True, index=True)
    machinery_id = Column(Integer, ForeignKey("machinery.id"))
    user_phone = Column(String(20))  # ✅ Now valid for MySQL
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    delivery_type = Column(Enum(DeliveryType))
    total_price = Column(Float)

    machinery = relationship("Machinery", back_populates="bookings")
