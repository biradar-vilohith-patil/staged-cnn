from pydantic import BaseModel
from typing import Optional

class PredictionCreate(BaseModel):
    user_id: str
    image_url: str
    prediction: str
    confidence: float


class PredictionResponse(BaseModel):
    prediction: str
    confidence: float
    image_url: Optional[str] = None