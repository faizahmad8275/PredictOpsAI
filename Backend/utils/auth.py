from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from utils.jwt import verify_access_token
from database.connection import db
from bson import ObjectId

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    token = credentials.credentials

    payload = verify_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )

    user_id = payload.get("sub")

    try:
        user = db["users"].find_one({
            "_id": ObjectId(user_id)
        })
    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid user ID"
        )

    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user