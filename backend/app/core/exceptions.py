from dataclasses import dataclass
from typing import Any


class AppError(Exception):
    def __init__(self, message: str, status_code: int = 500, details: Any = None):
        self.message = message
        self.status_code = status_code
        self.details = details
        super().__init__(message)


class NotFoundError(AppError):
    def __init__(self, resource: str, resource_id: str):
        super().__init__(
            message=f"{resource} with id '{resource_id}' not found",
            status_code=404,
        )


class ValidationError(AppError):
    def __init__(self, message: str, details: Any = None):
        super().__init__(message=message, status_code=400, details=details)


class DatabaseError(AppError):
    def __init__(self, message: str = "Database operation failed"):
        super().__init__(message=message, status_code=500)