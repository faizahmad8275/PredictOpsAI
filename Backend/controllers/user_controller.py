from Backend.database.connection import db
from Backend.models.user import UserCreate, UserLogin
from Backend.utils.password import hash_password, verify_password
from Backend.utils.jwt import create_access_token


def create_user(user: UserCreate):
    users_collection = db["users"]

    print("SIGNUP EMAIL:", user.email)

    existing_user = users_collection.find_one(
        {"email": user.email}
    )

    print("EXISTING USER:", existing_user is not None)

    if existing_user:
        print("❌ EMAIL ALREADY EXISTS")
        return None

    new_user = {
        "name": user.name,
        "email": user.email,
        "password": hash_password(user.password)
    }

    result = users_collection.insert_one(new_user)

    print("✅ USER CREATED:", result.inserted_id)

    # Verify immediately
    saved_user = users_collection.find_one(
        {"email": user.email}
    )

    print("✅ USER IN DATABASE:", saved_user is not None)

    return {
        "id": str(result.inserted_id),
        "name": user.name,
        "email": user.email
    }


def login_user(user: UserLogin):
    users_collection = db["users"]

    print("LOGIN EMAIL:", user.email)

    existing_user = users_collection.find_one(
        {"email": user.email}
    )

    print("USER FOUND:", existing_user is not None)

    if not existing_user:
        print("❌ EMAIL NOT FOUND IN DATABASE")
        return None

    print("USER:", existing_user["email"])

    if not verify_password(
        user.password,
        existing_user["password"]
    ):
        print("❌ PASSWORD DOES NOT MATCH")
        return None

    print("✅ PASSWORD MATCHED")

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