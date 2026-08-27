from fastapi import APIRouter, HTTPException, Depends

from Backend.models.user import UserCreate, UserLogin
from Backend.controllers.user_controller import create_user, login_user
from Backend.utils.auth import get_current_user


router = APIRouter(prefix="/users", tags=["Users"])


@router.post("/")
def create_new_user(user: UserCreate):
    result = create_user(user)

    if result is None:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    return {
        "message": "User created successfully",
        "user": result
    }


@router.post("/login")
def login_existing_user(user: UserLogin):
    result = login_user(user)

    if result is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    return {
        "message": "Login successful",
        "access_token": result["access_token"],
        "token_type": result["token_type"],
        "user": result["user"]
    }


@router.get("/me")
def get_me(current_user: dict = Depends(get_current_user)):
    return {
        "message": "Current user",
        "user": {
            "id": str(current_user["_id"]),
            "name": current_user["name"],
            "email": current_user["email"]
        }
    }