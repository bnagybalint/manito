from __future__ import annotations

import datetime as dt

from typing import Dict, Any
from dataclasses import dataclass

from data_service.model.api_model import ApiModel
from manito.db.entities import User

@dataclass
class UserApiModel(ApiModel):
    id: int
    name: str
    created_at: dt.datetime
    deleted_at: dt.datetime

    def to_json(self) -> Dict[str, Any]:
        d = {
            "id": self.id,
            "name": self.name,
            "created_at": self.created_at.isoformat(),
        }

        if self.deleted_at is not None:
            d["deleted_at"] = self.deleted_at.isoformat()

        return d

    @staticmethod
    def from_entity(user: User) -> UserApiModel:
        m = UserApiModel(
            id=user.id,
            name=user.name,
            created_at=user.created_at,
            deleted_at=user.deleted_at,
        )
        return m

