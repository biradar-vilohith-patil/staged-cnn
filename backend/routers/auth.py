from fastapi import APIRouter, HTTPException
from passlib.context import CryptContext
from schemas.user import RegisterRequest, LoginRequest
from services.database_service import get_user_by_email, create_user

router = APIRouter(prefix="/auth", tags=["Auth"])

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


@router.post("/register")
def register(user: RegisterRequest):
    if user.password != user.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    existing_user = get_user_by_email(user.email)
    if existing_user:
        raise HTTPException(status_code=409, detail="User already exists")

    user_data = {
        "name": user.name,
        "age": user.age,
        "gender": user.gender,
        "email": user.email,
        "phone": getattr(user,"phone",None),
        "password_hash": pwd_context.hash(user.password),
    }

    created_user = create_user(user_data)
    return {"message": "User registered successfully", "user": created_user}


@router.post("/login")
def login(user: LoginRequest):
    db_user = get_user_by_email(user.email)
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not pwd_context.verify(user.password, db_user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "message": "Login successful",
        "user_id": db_user["user_id"],
        "name": db_user["name"],
        "email": db_user["email"],
    }