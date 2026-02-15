from fastapi import APIRouter, HTTPException, BackgroundTasks
import secrets
import hashlib
from datetime import datetime, timedelta
from models.reset_token import PasswordResetRequest, PasswordResetConfirm
from database import user_collection, reset_token_collection
from email_config import fm
from fastapi_mail import MessageSchema
from routes.signup import hash_password

router = APIRouter()

def generate_reset_token():
    """Generate a secure random token"""
    return secrets.token_urlsafe(32)

def hash_token(token: str) -> str:
    """Hash token for storage (so DB compromise doesn't expose valid tokens)"""
    return hashlib.sha256(token.encode()).hexdigest()

async def send_reset_email(email: str, token: str):
    """Send password reset email using fastapi-mail"""
    
    reset_link = f"http://localhost:8080/reset-password?token={token}"
    
    # Create HTML email body
    html = f"""
    <html>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #4CAF50; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Zero-Waste Kitchen</h1>
        </div>
        
        <div style="background-color: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #ddd;">
            <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
            
            <p style="color: #555; line-height: 1.6;">
                We received a request to reset your password. Click the button below to create a new password:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{reset_link}" 
                   style="background-color: #4CAF50; 
                          color: white; 
                          padding: 12px 30px; 
                          text-decoration: none; 
                          border-radius: 5px;
                          font-weight: bold;
                          display: inline-block;">
                    Reset Password
                </a>
            </div>
            
            <p style="color: #555; line-height: 1.6;">
                Or copy and paste this link into your browser:
                <br>
                <a href="{reset_link}" style="color: #4CAF50; word-break: break-all;">{reset_link}</a>
            </p>
            
            <p style="color: #777; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
                This link will expire in 1 hour. If you didn't request a password reset, please ignore this email.
            </p>
        </div>
    </body>
    </html>
    """
    
    # Create message
    message = MessageSchema(
        subject="Password Reset Request - Zero-Waste Kitchen",
        recipients=[email],
        body=html,
        subtype="html"
    )
    
    # Send email
    await fm.send_message(message)

@router.post("/forgot-password/request")
async def request_password_reset(request: PasswordResetRequest, background_tasks: BackgroundTasks):
    """Request a password reset email"""
    
    # Check if user exists
    user = await user_collection.find_one({"email": request.email})
    
    # Always return same message for security (don't reveal if email exists)
    response_message = {"message": "If your email is registered, you will receive reset instructions"}
    
    if not user:
        # User doesn't exist, but return same message
        return response_message
    
    # Generate token
    token = generate_reset_token()
    hashed_token = hash_token(token)
    
    # Set expiration (1 hour from now)
    expires_at = datetime.utcnow() + timedelta(hours=1)
    
    # Delete any existing unused tokens for this email
    await reset_token_collection.delete_many({
        "email": request.email,
        "used": False
    })
    
    # Store token in database
    await reset_token_collection.insert_one({
        "email": request.email,
        "token": hashed_token,
        "expires_at": expires_at,
        "used": False,
        "created_at": datetime.utcnow()
    })
    
    # Send email in background
    background_tasks.add_task(send_reset_email, request.email, token)
    
    return response_message

@router.post("/forgot-password/reset")
async def reset_password(confirm: PasswordResetConfirm):
    """Reset password using token"""
    
    # Hash the provided token
    hashed_token = hash_token(confirm.token)
    
    # Find valid token
    token_doc = await reset_token_collection.find_one({
        "token": hashed_token,
        "used": False,
        "expires_at": {"$gt": datetime.utcnow()}
    })
    
    if not token_doc:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    
    # Hash new password
    hashed_password = hash_password(confirm.new_password)
    
    # Update user's password
    await user_collection.update_one(
        {"email": token_doc["email"]},
        {"$set": {"password": hashed_password}}
    )
    
    # Mark token as used
    await reset_token_collection.update_one(
        {"_id": token_doc["_id"]},
        {"$set": {"used": True}}
    )
    
    return {"message": "Password reset successfully"}