from __future__ import annotations

import datetime as dt
import dateutil.parser

from typing import Dict, Any
from dataclasses import dataclass

from manito.core import Color, ColorFormat, read_json, ValidationError
from data_service.model.api_model import ApiModel
from manito.db.entities import Icon

@dataclass
class IconApiModel(ApiModel):
    id: int
    name: str
    image_url: str
    created_at: dt.datetime = None
    deleted_at: dt.datetime = None

    def to_json(self) -> Dict[str, Any]:
        d = {
            "id": self.id,
            "name": self.name,
            "imageUrl": self.image_url,
            "createdAt": self.created_at.isoformat()
        }

        if self.deleted_at is not None:
            d["deletedAt"] = self.deleted_at.isoformat()

        return d

    @staticmethod
    def from_json(j: Dict[str, Any]) -> IconApiModel:
        raise NotImplementedError()


    @staticmethod
    def from_entity(icon: Icon) -> IconApiModel:
        m = IconApiModel(
            id=icon.id,
            name=icon.name,
            image_url=icon.image_url,
            created_at=icon.created_at,
            deleted_at=icon.deleted_at,
        )
        return m

    def validate(self) -> None:
        if self.name is None or self.name == "":
            raise ValidationError(error="Name cannot be empty")
        if self.image_url is None or self.image_url == "":
            raise ValidationError(error="Image URL cannot be empty")
