# from fastapi import FastAPI

# from routers.auth import router as auth_router
# from routers.predict import router as predict_router
# from routers.history import router as history_router

# app = FastAPI(title="Pneumonia Detection API")

# app.include_router(auth_router)
# app.include_router(predict_router)
# app.include_router(history_router)


# @app.get("/")
# def home():

#     return {"message": "API Running"}




from fastapi import FastAPI

from routers.auth import router as auth_router
from routers.predict import router as predict_router
from routers.history import router as history_router

from exception.custom_exception import (
    UserAlreadyExistsException,
    InvalidCredentialsException,
    InvalidImageException,
    ModelPredictionException,
    UserNotFoundException
)

from exception.exception_handlers import (
    user_exists_handler,
    invalid_credentials_handler,
    invalid_image_handler,
    prediction_handler,
    user_not_found_handler
)

app = FastAPI(title="Pneumonia Detection API")

app.include_router(auth_router)
app.include_router(predict_router)
app.include_router(history_router)

app.add_exception_handler(
    UserAlreadyExistsException,
    user_exists_handler
)

app.add_exception_handler(
    InvalidCredentialsException,
    invalid_credentials_handler
)

app.add_exception_handler(
    InvalidImageException,
    invalid_image_handler
)

app.add_exception_handler(
    ModelPredictionException,
    prediction_handler
)

app.add_exception_handler(
    UserNotFoundException,
    user_not_found_handler
)


@app.get("/")
def home():
    return {"message": "API Running"}

