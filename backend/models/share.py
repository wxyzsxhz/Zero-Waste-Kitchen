from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime

class ShareRequestModel(BaseModel):
    from_user_id: str
    to_username: str  # Changed from to_email
    permission: Literal["view", "edit"] = "view"
    status: Literal["pending", "accepted", "rejected"] = "pending"

class ShareResponseModel(BaseModel):
    id: str
    from_user_id: str
    from_username: str
    from_email: str
    to_username: str
    to_email: str  # Keep for reference
    status: str
    permission: str
    created_at: datetime
    updated_at: Optional[datetime] = None

class ShareActionModel(BaseModel):
    request_id: str
    action: Literal["accept", "reject"]