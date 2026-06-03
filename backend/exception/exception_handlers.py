from fastapi import Request
from fastapi.responses import JSONResponse

from exceptions.custom_exceptions import (
    UserAlreadyExistsException,
    InvalidCredentialsException,
    InvalidImageException,
    ModelPredictionException,
    UserNotFoundException,
    DatabaseException
)


async def user_exists_handler(
        request: Request,
        exc: UserAlreadyExistsException):

    return JSONResponse(
        status_code=400,
        content={
            "success": False,
            "message": f"User with email {exc.email} already exists"
        }
    )


async def invalid_credentials_handler(
        request: Request,
        exc: InvalidCredentialsException):

    return JSONResponse(
        status_code=401,
        content={
            "success": False,
            "message": "Invalid email or password"
        }
    )


async def invalid_image_handler(
        request: Request,
        exc: InvalidImageException):

    return JSONResponse(
        status_code=400,
        content={
            "success": False,
            "message": "Invalid X-Ray image uploaded"
        }
    )


async def prediction_handler(
        request: Request,
        exc: ModelPredictionException):

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": "Prediction failed"
        }
    )


async def user_not_found_handler(
        request: Request,
        exc: UserNotFoundException):

    return JSONResponse(
        status_code=404,
        content={
            "success": False,
            "message": f"User {exc.user_id} not found"
        }
    )


async def database_handler(
        request: Request,
        exc: DatabaseException):

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "message": exc.message
        }
    )