from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_DETAILS = os.getenv("MONGO_DETAILS")

client = AsyncIOMotorClient(MONGO_DETAILS)
database = client["mydatabase"]

user_collection = database.get_collection("users")
ingredient_collection = database.get_collection("ingredients")
history_collection = database.get_collection("history")
share_collection = database.get_collection("shares")
reset_token_collection = database.get_collection("reset_tokens")

def user_helper(user) -> dict:
    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "email": user["email"],
    }