from __future__ import annotations
from typing import Any, List, Dict, Union
from manito.api_tools.api_model import ApiModel

DataLike = Union[ApiModel, List[ApiModel]]

class ResponseAtom:
    pass

class StatusCode(ResponseAtom):
    def __init__(self, code: int):
        self.code = code

class Body(ResponseAtom):
    def __init__(self, data: DataLike):
        self.data = data

class ContentType(ResponseAtom):
    def __init__(self, content_type: str):
        self.content_type = content_type

    @staticmethod
    def JSON() -> ContentType:
        return ContentType("application/json")
    @staticmethod
    def YAML() -> ContentType:
        return ContentType("application/x-yaml")

class Cookie(ResponseAtom):
    def __init__(self, name: str, value: str, http_only: bool = False):
        self.name = name
        self.value = value
        self.http_only = http_only

class Header(ResponseAtom):
    def __init__(self, name: str, value: str):
        self.name = name
        self.value = value

class Response:
    def __init__(self, *args: ResponseAtom):
        self.atoms = args
                 
    @classmethod
    def Ok(cls, data: DataLike) -> Response:
        return cls(Body(data), StatusCode(200))
    
    @classmethod
    def Error(cls, status: int, error: DataLike) -> Response:
        return cls(Body(error), StatusCode(status))

    @classmethod
    def ClientError(cls, error: DataLike) -> Response:
        return cls(Body(error), StatusCode(400))
    @classmethod
    def Unauthorized(cls, error: DataLike) -> Response:
        return cls(Body(error), StatusCode(401))
    @classmethod
    def Forbidden(cls, error: DataLike) -> Response:
        return cls(Body(error), StatusCode(403))
    @classmethod
    def NotFound(cls, error: DataLike) -> Response:
        return cls(Body(error), StatusCode(404))

    @classmethod
    def ServerError(cls, error: DataLike) -> Response:
        return cls(Body(error), StatusCode(500))
    