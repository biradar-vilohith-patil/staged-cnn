from fastapi import APIRouter
from services.database_service import get_scans_by_user_id

router = APIRouter(prefix="/history", tags=["History"])


@router.get("/{user_id}")
def history(user_id: str):
    scans = get_scans_by_user_id(user_id)
    return {"user_id": user_id, "history": scans}