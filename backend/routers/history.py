from fastapi import APIRouter, HTTPException
from services.database_service import get_user_history

router = APIRouter(prefix="/api", tags=["History"])

@router.get("/history/{user_email}")
def get_history(user_email: str):
    try:
        history_records = get_user_history(user_email)
        return history_records
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))