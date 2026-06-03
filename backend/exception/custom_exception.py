class UserAlreadyExistsException(Exception):

    def __init__(self, email: str):
        self.email = email


class InvalidCredentialsException(Exception):

    def __init__(self):
        pass


class InvalidImageException(Exception):

    def __init__(self):
        pass


class ModelPredictionException(Exception):

    def __init__(self):
        pass


class UserNotFoundException(Exception):

    def __init__(self, user_id: int):
        self.user_id = user_id


class DatabaseException(Exception):

    def __init__(self, message: str):
        self.message = message

