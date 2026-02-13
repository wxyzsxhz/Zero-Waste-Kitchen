from fastapi import APIRouter, Query
from typing import Optional
from database import history_collection
from models.history import HistoryModel
from datetime import datetime

router = APIRouter(prefix="/history", tags=["History"])


def history_helper(entry) -> dict:
    return {
        "id": str(entry["_id"]),
        "ingredientName": entry["ingredientName"],
        "action": entry["action"],
        "quantity": entry.get("quantity"),
        "unit": entry.get("unit"),
        "details": entry.get("details"),
        "timestamp": entry["timestamp"],
    }


@router.get("/")
async def get_history(
    search: Optional[str] = Query(None),
    action: Optional[str] = Query(None),
):
    query = {}

    if action:
        query["action"] = action

    history = []
    async for entry in history_collection.find(query).sort("timestamp", -1):
        if search and search.lower() not in entry["ingredientName"].lower():
            continue
        history.append(history_helper(entry))

    return history


@router.post("/")
async def create_history(entry: HistoryModel):
    if not entry.timestamp:
        entry.timestamp = datetime.utcnow()

    new_entry = await history_collection.insert_one(entry.dict())
    created = await history_collection.find_one({"_id": new_entry.inserted_id})
    return history_helper(created)
