# schemas/ingredient.py

from pydantic import BaseModel
from typing import Optional
from datetime import date

class IngredientBase(BaseModel):
    name: str
    quantity: int
    unit: str
    category: str
    expiryDate: Optional[date] = None
    notes: Optional[str] = None

class IngredientCreate(IngredientBase):
    pass

class Ingredient(IngredientBase):
    id: int

    class Config:
        orm_mode = True
