from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext
from fastapi.responses import JSONResponse

from models.signup_struct import UserModel, LoginModel, ForgotPasswordModel
from database import user_collection, user_helper

router = APIRouter()  # <-- Use router instead of FastAPI app
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# ------------------ Password Utils ------------------

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

# ------------------ Sign Up ------------------

@router.post("/signup")
async def signup(user: UserModel):
    if await user_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already exists")
    if await user_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")

    user_dict = user.model_dump()
    user_dict["password"] = hash_password(user.password)

    new_user = await user_collection.insert_one(user_dict)
    created_user = await user_collection.find_one({"_id": new_user.inserted_id})
    return JSONResponse(status_code=201, content=user_helper(created_user))

# ------------------ Login ------------------

@router.post("/login")
async def login(data: LoginModel):
    user = await user_collection.find_one({"email": data.email})
    
    if not user or not verify_password(data.password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return {
        "message": f"Welcome {user['username']}!",
        "username": user["username"],
        "email": user["email"]
    }

# ------------------ Forgot Password ------------------

@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordModel):
    user = await user_collection.find_one({"email": data.email})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    new_hashed_password = hash_password(data.new_password)
    await user_collection.update_one({"email": data.email}, {"$set": {"password": new_hashed_password}})
    return {"message": "Password updated successfully"}
