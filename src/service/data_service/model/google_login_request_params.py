from __future__ import annotations

from typing import Dict, Any
from dataclasses import dataclass

from data_service.model.api_model import ApiModel
from manito.core import ValidationError
from manito.core import read_json

@dataclass
class GoogleLoginRequestParamsApiModel(ApiModel):
    jwt: str

    @staticmethod
    def from_json(j: Dict[str, Any]) -> GoogleLoginRequestParamsApiModel:
        m = GoogleLoginRequestParamsApiModel(
            jwt=read_json(j, "jwt", parser=str),
        )
        return m

    def to_json(self) -> Dict[str, Any]:
        raise NotImplementedError()

    def validate(self) -> None:
        if self.jwt is None or self.jwt == "":
            raise ValidationError("JWT must not be empty")
