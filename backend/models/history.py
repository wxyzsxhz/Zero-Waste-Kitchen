from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class HistoryModel(BaseModel):
    ingredientName: str
    action: str  # "added" | "updated" | "deleted" | "used"
    quantity: Optional[float] = None
    unit: Optional[str] = None
    details: Optional[str] = None
    timestamp: Optional[datetime] = None
