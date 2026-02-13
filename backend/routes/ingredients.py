from fastapi import APIRouter
from models.ingredient import IngredientModel
from database import ingredient_collection, history_collection
from bson import ObjectId
from datetime import datetime

router = APIRouter(prefix="/ingredients", tags=["Ingredients"])


def ingredient_helper(ingredient) -> dict:
    return {
        "id": str(ingredient["_id"]),
        "name": ingredient["name"],
        "quantity": ingredient["quantity"],
        "unit": ingredient["unit"],
        "category": ingredient["category"],
        "expiryDate": ingredient.get("expiryDate"),
        "notes": ingredient.get("notes"),
    }


@router.get("/")
async def get_ingredients():
    ingredients = []
    async for ingredient in ingredient_collection.find():
        ingredients.append(ingredient_helper(ingredient))
    return ingredients


@router.post("/")
async def create_ingredient(ingredient: IngredientModel):
    new_ingredient = await ingredient_collection.insert_one(ingredient.dict())
    created = await ingredient_collection.find_one({"_id": new_ingredient.inserted_id})

    # ✅ Log history
    await history_collection.insert_one({
        "ingredientName": ingredient.name,
        "action": "added",
        "quantity": ingredient.quantity,
        "unit": ingredient.unit,
        "timestamp": datetime.utcnow()
    })

    return ingredient_helper(created)


@router.put("/{id}")
async def update_ingredient(id: str, ingredient: IngredientModel):
    await ingredient_collection.update_one(
        {"_id": ObjectId(id)},
        {"$set": ingredient.dict()}
    )

    updated = await ingredient_collection.find_one({"_id": ObjectId(id)})

    # ✅ Log history
    await history_collection.insert_one({
        "ingredientName": ingredient.name,
        "action": "updated",
        "details": "Ingredient updated",
        "timestamp": datetime.utcnow()
    })

    return ingredient_helper(updated)


@router.delete("/{id}")
async def delete_ingredient(id: str):
    existing = await ingredient_collection.find_one({"_id": ObjectId(id)})

    await ingredient_collection.delete_one({"_id": ObjectId(id)})

    # ✅ Log history
    if existing:
        await history_collection.insert_one({
            "ingredientName": existing["name"],
            "action": "deleted",
            "details": "Ingredient removed",
            "timestamp": datetime.utcnow()
        })

    return {"message": "Deleted successfully"}
