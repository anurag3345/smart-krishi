from pydantic import BaseModel
from typing import Optional

class VegetableBase(BaseModel):
    veg_name: str
    category: str
    quantity: float

    rate: float
    image_url: Optional[str] = None
    description: Optional[str] = None

class VegetableCreate(VegetableBase):
    pass

class VegetableOut(VegetableBase):
    id: int

    class Config:
        from_attributes = True

