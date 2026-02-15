from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class PasswordResetRequest(BaseModel):
    email: EmailStr

class PasswordResetConfirm(BaseModel):
    token: str
    new_password: str

class ResetTokenInDB(BaseModel):
    email: str
    token: str
    expires_at: datetime
    used: bool = False
