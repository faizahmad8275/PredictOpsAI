from database.connection import db
from models.user import UserCreate, UserLogin
from utils.password import hash_password, verify_password
from utils.jwt import create_access_token


def create_user(user: UserCreate):
    users_collection = db["users"]

    existing_user = users_collection.find_one(
        {"email": user.email}
    )

    if existing_user:
        return None

    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hash_password(user.password)
    }

    result = users_collection.insert_one(new_user)

    return {
        "id": str(result.inserted_id),
        "name": user.name,
        "email": user.email
    }


def login_user(user: UserLogin):
    users_collection = db["users"]

    existing_user = users_collection.find_one(
        {"email": user.email}
    )

    if not existing_user:
        return None

    if not verify_password(
        user.password,
        existing_user["password"]
    ):
        return None

    access_token = create_access_token(
        {
            "sub": str(existing_user["_id"]),
            "email": existing_user["email"]
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": str(existing_user["_id"]),
            "name": existing_user["name"],
            "email": existing_user["email"]
        }
    }