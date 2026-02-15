from fastapi import APIRouter, HTTPException
from typing import List
from bson import ObjectId
from datetime import datetime
from models.share import ShareRequestModel, ShareActionModel
from database import share_collection, user_collection
import logging

router = APIRouter(prefix="/share", tags=["Share"])
logger = logging.getLogger(__name__)

def share_helper(share) -> dict:
    return {
        "id": str(share["_id"]),
        "from_user_id": share["from_user_id"],
        "to_username": share["to_username"],
        "to_email": share.get("to_email"),
        "status": share["status"],
        "permission": share.get("permission", "view"),
        "created_at": share["created_at"],
        "updated_at": share.get("updated_at")
    }

async def get_user_by_id(user_id: str):
    """Helper to get user details by ID"""
    try:
        user = await user_collection.find_one({"_id": ObjectId(user_id)})
        if user:
            return {
                "id": str(user["_id"]),
                "username": user["username"],
                "email": user["email"]
            }
    except:
        pass
    return None

async def get_user_by_username(username: str):
    """Helper to get user details by username"""
    user = await user_collection.find_one({"username": username})
    if user:
        return {
            "id": str(user["_id"]),
            "username": user["username"],
            "email": user["email"]
        }
    return None

@router.post("/request")
async def create_share_request(request: ShareRequestModel):
    """Create a new share request using username"""
    try:
        # Check if target user exists by username
        target_user = await get_user_by_username(request.to_username)
        if not target_user:
            raise HTTPException(status_code=404, detail=f"User '{request.to_username}' not found")

        # Check if trying to share with yourself
        if request.from_user_id == target_user["id"]:
            raise HTTPException(status_code=400, detail="You cannot share your pantry with yourself")

        # Check if request already exists
        existing = await share_collection.find_one({
            "from_user_id": request.from_user_id,
            "to_username": request.to_username,
            "status": "pending"
        })
        
        if existing:
            raise HTTPException(status_code=400, detail=f"Share request already pending for {request.to_username}")

        # Create new share request
        share_data = {
            "from_user_id": request.from_user_id,
            "to_username": request.to_username,
            "to_email": target_user["email"],  # Store email for reference
            "status": "pending",
            "permission": request.permission,
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        result = await share_collection.insert_one(share_data)
        created = await share_collection.find_one({"_id": result.inserted_id})
        
        return share_helper(created)
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating share request: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/received/{user_id}")
async def get_received_requests(user_id: str):
    """Get all pending share requests received by a user (by username)"""
    try:
        # First get the user's details
        user = await get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Find all pending requests where to_username matches this user's username
        cursor = share_collection.find({
            "to_username": user["username"],
            "status": "pending"
        }).sort("created_at", -1)
        
        requests = []
        async for share in cursor:
            # Get sender details
            sender = await get_user_by_id(share["from_user_id"])
            if sender:
                # Calculate time ago
                time_diff = datetime.utcnow() - share["created_at"]
                if time_diff.days > 0:
                    time_ago = f"{time_diff.days} day{'s' if time_diff.days > 1 else ''} ago"
                elif time_diff.seconds // 3600 > 0:
                    hours = time_diff.seconds // 3600
                    time_ago = f"{hours} hour{'s' if hours > 1 else ''} ago"
                else:
                    minutes = time_diff.seconds // 60
                    time_ago = f"{minutes} minute{'s' if minutes > 1 else ''} ago"
                
                requests.append({
                    "id": str(share["_id"]),
                    "from_user_id": share["from_user_id"],
                    "from_username": sender["username"],
                    "from_email": sender["email"],
                    "to_username": share["to_username"],
                    "status": share["status"],
                    "permission": share.get("permission", "view"),
                    "time_ago": time_ago,
                    "created_at": share["created_at"].isoformat()
                })
        
        return requests
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting received requests: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sent/{user_id}")
async def get_sent_requests(user_id: str):
    """Get all share requests sent by a user"""
    try:
        cursor = share_collection.find({
            "from_user_id": user_id
        }).sort("created_at", -1)
        
        requests = []
        async for share in cursor:
            # Get target user details
            target = await get_user_by_username(share["to_username"])
            
            requests.append({
                "id": str(share["_id"]),
                "from_user_id": share["from_user_id"],
                "to_username": share["to_username"],
                "to_email": share.get("to_email"),
                "status": share["status"],
                "permission": share.get("permission", "view"),
                "created_at": share["created_at"].isoformat()
            })
        
        return requests
        
    except Exception as e:
        logger.error(f"Error getting sent requests: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/respond")
async def respond_to_request(action: ShareActionModel):
    """Accept or reject a share request"""
    try:
        # Find the request
        request = await share_collection.find_one({"_id": ObjectId(action.request_id)})
        if not request:
            raise HTTPException(status_code=404, detail="Share request not found")
        
        # Update status
        new_status = "accepted" if action.action == "accept" else "rejected"
        await share_collection.update_one(
            {"_id": ObjectId(action.request_id)},
            {
                "$set": {
                    "status": new_status,
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        return {"message": f"Request {action.action}ed successfully", "status": new_status}
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error responding to request: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/shared-with/{user_id}")
async def get_shared_with_users(user_id: str):
    """Get all users who have shared their pantry with this user"""
    try:
        user = await get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Find accepted shares where this user is the recipient (by username)
        cursor = share_collection.find({
            "to_username": user["username"],
            "status": "accepted"
        })
        
        shared_users = []
        async for share in cursor:
            sender = await get_user_by_id(share["from_user_id"])
            if sender:
                shared_users.append({
                    "user_id": sender["id"],
                    "username": sender["username"],
                    "email": sender["email"],
                    "permission": share.get("permission", "view"),
                    "shared_at": share["updated_at"].isoformat() if share.get("updated_at") else share["created_at"].isoformat()
                })
        
        return shared_users
        
    except Exception as e:
        logger.error(f"Error getting shared with users: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))