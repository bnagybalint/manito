from __future__ import annotations

from typing import Dict, Any
from dataclasses import dataclass

from data_service.model.api_model import ApiModel
from manito.core import ValidationError
from manito.core import read_json

@dataclass
class LoginRequestParamsApiModel(ApiModel):
    username: str
    password: str

    @staticmethod
    def from_json(j: Dict[str, Any]) -> LoginRequestParamsApiModel:
        m = LoginRequestParamsApiModel(
            username=read_json(j, "username", parser=str),
            password=read_json(j, "password", parser=str),
        )
        return m

    def to_json(self) -> Dict[str, Any]:
        raise NotImplementedError()

    def validate(self) -> None:
        if self.username is None or self.username == "":
            raise ValidationError("Username must not be empty")
        if self.password is None or self.password == "":
            raise ValidationError("Password must not be empty")
