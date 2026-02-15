from fastapi import APIRouter, HTTPException
from models.ingredient import IngredientModel
from database import ingredient_collection, history_collection
from bson import ObjectId
from datetime import datetime
from typing import List

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
        "user_id": ingredient.get("user_id"),  # Make sure this field exists
    }


@router.get("/user/{user_id}")
async def get_user_ingredients(user_id: str):
    """Get ingredients for a specific user (for shared pantry)"""
    try:
        ingredients = []
        # Assuming each ingredient has a user_id field
        async for ingredient in ingredient_collection.find({"user_id": user_id}):
            ingredients.append(ingredient_helper(ingredient))
        return ingredients
    except Exception as e:
        print(f"Error fetching user ingredients: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/")
async def create_ingredient(ingredient: IngredientModel):
    # Get current user ID from somewhere (you need to implement this)
    # For now, you might need to pass user_id in the request
    new_ingredient = await ingredient_collection.insert_one(ingredient.dict())
    created = await ingredient_collection.find_one({"_id": new_ingredient.inserted_id})

    # ✅ Log history
    await history_collection.insert_one({
    "user_id": ingredient.user_id,
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
    "user_id": ingredient.user_id, 
    "ingredientName": ingredient.name,
    "action": "updated",
    "quantity": ingredient.quantity,
    "unit": ingredient.unit,
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
    "user_id": existing["user_id"],  
    "ingredientName": existing["name"],
    "action": "deleted",
    "details": "Ingredient removed",
    "timestamp": datetime.utcnow()
})

    return {"message": "Deleted successfully"}