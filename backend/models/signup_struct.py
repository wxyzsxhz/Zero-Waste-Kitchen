from pydantic import BaseModel, EmailStr, Field

# For Sign Up
class UserModel(BaseModel):
    username: str = Field(..., min_length=3, max_length=50)
    email: EmailStr
    password: str = Field(..., min_length=8)

# For Sign In
class LoginModel(BaseModel):
    email: EmailStr
    password: str

# For Forgot Password
class ForgotPasswordModel(BaseModel):
    email: EmailStr
    new_password: str = Field(..., min_length=8)

# ADD THIS NEW CLASS
class ChangePasswordModel(BaseModel):
    current_password: str
    new_password: str = Field(..., min_length=8)