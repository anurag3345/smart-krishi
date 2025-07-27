from sqlalchemy import Column, Integer, String, Float, Text
from database import Base  # your SQLAlchemy Base

class Vegetable(Base):
    __tablename__ = "vegetables"

    id = Column(Integer, primary_key=True, index=True)
    veg_name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)
    quantity = Column(Float, nullable=False)  # e.g., 5.5
    # unit = Column(String(10), nullable=False)  # e.g., "kg", "gm", "pcs"
    rate = Column(Float, nullable=False)
    image_url = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
