import os
from uuid import uuid4
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from services.model_service import predict_xray
from services.database_service import create_scan

router = APIRouter(prefix="/predict", tags=["Prediction"])

UPLOAD_DIR = "uploads/xrays"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/")
async def predict(
    user_id: str = Form(...),
    file: UploadFile = File(...)
):
    file_ext = file.filename.split(".")[-1].lower()
    if file_ext not in ["png", "jpg", "jpeg"]:
        raise HTTPException(status_code=400, detail="Only PNG, JPG, JPEG allowed")

    filename = f"{uuid4()}.{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, filename)

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    prediction, confidence = predict_xray(file_path)

    scan_data = {
        "user_id": user_id,
        "image_url": file_path,
        "prediction": prediction,
        "confidence": confidence,
    }

    saved_scan = create_scan(scan_data)

    return {
        "message": "Prediction completed",
        "prediction": prediction,
        "confidence": confidence,
        "scan": saved_scan,
    }