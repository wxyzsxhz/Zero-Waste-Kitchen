from pydantic import BaseModel
from typing import Optional

class IngredientModel(BaseModel):
    name: str
    quantity: float
    unit: str
    category: str
    expiryDate: Optional[str] = None
    notes: Optional[str] = None
