from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.vegetable import Vegetable
from schemas.vegetable import VegetableCreate, VegetableOut
from typing import List

router = APIRouter(prefix="/vegetables", tags=["Vegetables"])

# Create Vegetable
@router.post("/", response_model=VegetableOut)
def create_vegetable(data: VegetableCreate, db: Session = Depends(get_db)):
    veg = Vegetable(**data.dict())
    db.add(veg)
    db.commit()
    db.refresh(veg)
    return veg

# Get all Vegetables
@router.get("/", response_model=List[VegetableOut])
def get_vegetables(db: Session = Depends(get_db)):
    return db.query(Vegetable).all()

# ✅ Delete Vegetable by ID
@router.delete("/{veg_id}")
def delete_vegetable(veg_id: int, db: Session = Depends(get_db)):
    veg = db.query(Vegetable).filter(Vegetable.id == veg_id).first()
    if not veg:
        raise HTTPException(status_code=404, detail="Vegetable not found")
    
    db.delete(veg)
    db.commit()
    return {"message": "Vegetable deleted successfully"}

# ✅ Optional: Update Vegetable by ID
@router.put("/{veg_id}", response_model=VegetableOut)
def update_vegetable(veg_id: int, data: VegetableCreate, db: Session = Depends(get_db)):
    veg = db.query(Vegetable).filter(Vegetable.id == veg_id).first()
    if not veg:
        raise HTTPException(status_code=404, detail="Vegetable not found")
    
    for key, value in data.dict().items():
        setattr(veg, key, value)

    db.commit()
    db.refresh(veg)
    return veg
