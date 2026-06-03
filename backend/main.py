from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

# We will import the routers in the next step
# from routers import auth, predict, history

app = FastAPI(
    title="PneumoVision API", 
    description="Backend for CNN-based Pneumonia Detection",
    version="1.0"
)

# Crucial for React frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict this to your Vercel URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.include_router(auth.router)
# app.include_router(predict.router)
# app.include_router(history.router)

@app.get("/")
def health_check():
    return {"status": "PneumoVision Backend is active"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)