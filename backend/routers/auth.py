from fastapi import APIRouter, HTTPException, Depends
from passlib.context import CryptContext
import jwt
import datetime

from schemas.user import UserCreate, UserLogin
from services.database_service import get_user_by_email, create_user

router = APIRouter(prefix="/auth", tags=["Auth"])
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "pneumovision_production_secret" # Use environment variable in real production

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm="HS256")

@router.post("/register")
def register(user: UserCreate):
    existing_user = get_user_by_email(user.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = pwd_context.hash(user.password)
    create_user(user.name, user.email, hashed_password)
    return {"message": "User registered successfully"}

@router.post("/login")
def login(user: UserLogin):
    db_user = get_user_by_email(user.email)
    if not db_user or not pwd_context.verify(user.password, db_user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    access_token = create_access_token(data={"sub": db_user["email"]})
    return {
        "access_token": access_token, 
        "token_type": "bearer",
        "user": {"name": db_user["name"], "email": db_user["email"]}
    }