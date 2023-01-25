from __future__ import annotations

from typing import Dict, Any
from dataclasses import dataclass

from data_service.model.api_model import ApiModel


@dataclass
class BasicErrorApiModel(ApiModel):
    message: str

    def to_json(self) -> Dict[str, Any]:
        d = {
            "message": self.message,
        }

        return d
