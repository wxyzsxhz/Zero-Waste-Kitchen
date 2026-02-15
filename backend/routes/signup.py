from fastapi import APIRouter, HTTPException, Header
from passlib.context import CryptContext
from fastapi.responses import JSONResponse
from bson import ObjectId

from models.signup_struct import UserModel, LoginModel, ForgotPasswordModel, ChangePasswordModel
from database import user_collection, user_helper

import base64


router = APIRouter()
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
    
    # Create auth token (basic auth for now)
    auth_string = f"{user['username']}:{data.password}"
    auth_token = base64.b64encode(auth_string.encode()).decode()
    
    return {
    "message": f"Welcome {user['username']}!",
    "id": str(user["_id"]),
    "username": user["username"],
    "email": user["email"],
    "auth_token": auth_token
}

# ------------------ CHANGE PASSWORD ENDPOINT ------------------

@router.post("/change-password")
async def change_password(
    password_data: ChangePasswordModel,
    authorization: str = Header(...)
):
    try:
        # Check if authorization header exists and is Basic
        if not authorization or not authorization.startswith("Basic "):
            raise HTTPException(status_code=401, detail="Invalid authorization header")
        
        # Decode base64 credentials
        auth_base64 = authorization.replace("Basic ", "")
        try:
            decoded_bytes = base64.b64decode(auth_base64)
            decoded_string = decoded_bytes.decode()
            username, password = decoded_string.split(":", 1)
        except:
            raise HTTPException(status_code=401, detail="Invalid authorization token")
        
        # Find user by username
        user = await user_collection.find_one({"username": username})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Verify current password
        if not verify_password(password_data.current_password, user["password"]):
            raise HTTPException(status_code=400, detail="Current password is incorrect")
        
        # Hash new password
        new_hashed_password = hash_password(password_data.new_password)
        
        # Update password in database
        await user_collection.update_one(
            {"_id": user["_id"]},
            {"$set": {"password": new_hashed_password}}
        )
        
        return {"message": "Password updated successfully"}
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ------------------ Forgot Password ------------------

@router.post("/forgot-password")
async def forgot_password(data: ForgotPasswordModel):
    user = await user_collection.find_one({"email": data.email})
    
    if not user:
        raise HTTPException(status_code=404, detail="Email not found")
    
    # Hash new password
    new_hashed_password = hash_password(data.new_password)
    
    # Update password in database
    await user_collection.update_one(
        {"_id": user["_id"]},
        {"$set": {"password": new_hashed_password}}
    )
    
    return {"message": "Password reset successfully"}