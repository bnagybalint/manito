from __future__ import annotations

from typing import Dict, Any
from dataclasses import dataclass

from data_service.model.api_model import ApiModel

@dataclass
class LoginResponseApiModel(ApiModel):
    jwt: str

    def to_json(self) -> Dict[str, Any]:
        return {
            "jwt": self.jwt
        }
