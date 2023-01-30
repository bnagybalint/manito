from __future__ import annotations

from typing import Dict, Any
from dataclasses import dataclass

from data_service.model.api_model import ApiModel
from data_service.model.user import UserApiModel

@dataclass
class LoginResponseApiModel(ApiModel):
    jwt: str
    user: UserApiModel

    def to_json(self) -> Dict[str, Any]:
        return {
            "jwt": self.jwt,
            "user": self.user.to_json(),
        }