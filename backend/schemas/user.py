from pydantic import BaseModel

class RegisterRequest(BaseModel):
    name:str
    email:str
    password:str
    confirm_password:str
    age:int
    gender:str
    phone:str|None=None

class LoginRequest(BaseModel):
    email:str
    password:str
