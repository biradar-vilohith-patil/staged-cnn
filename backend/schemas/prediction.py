from pydantic import BaseModel
from datetime import datetime

class PredictionResponse(BaseModel):
    prediction: str
    confidence: float
    explanation: str

class HistoryItem(BaseModel):
    id: int
    created_at: datetime
    prediction: str
    confidence: float
    file_name: str