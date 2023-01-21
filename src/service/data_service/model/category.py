from __future__ import annotations

import datetime as dt
import dateutil.parser

from typing import Dict, Any
from dataclasses import dataclass

from manito.core import Color, ColorFormat, read_json, ValidationError
from data_service.model.api_model import ApiModel
from manito.db.entities import Category

@dataclass
class CategoryApiModel(ApiModel):
    name: str
    icon_id: str
    icon_color: Color
    owner_id: int
    id: int = None
    created_at: dt.datetime = None
    deleted_at: dt.datetime = None

    def to_json(self) -> Dict[str, Any]:
        d = {
            "name": self.name,
            "iconId": self.icon_id,
            "iconColor": self.icon_color.to_string(style=ColorFormat.HTML),
            "ownerId": self.owner_id,
        }

        if self.id is not None:
            d["id"] = self.id
        if self.created_at is not None:
            d["createdAt"] = self.created_at.isoformat()
        if self.deleted_at is not None:
            d["deletedAt"] = self.deleted_at.isoformat()

        return d

    @staticmethod
    def from_json(j: Dict[str, Any]) -> CategoryApiModel:
        m = CategoryApiModel(
            id=read_json(j, "id", parser=int, default=None),
            name=read_json(j, "name", parser=str),
            owner_id=read_json(j, "ownerId", parser=int),
            icon_id=read_json(j, "iconId", parser=int),
            icon_color=read_json(j, "iconColor", parser=lambda x: Color.parse(x, ColorFormat.HTML)),
            created_at=read_json(j, "createdAt", parser=dateutil.parser.isoparse, default=None),
            deleted_at=read_json(j, "deletedAt", parser=dateutil.parser.isoparse, default=None),
        )
        return m


    @staticmethod
    def from_entity(category: Category) -> CategoryApiModel:
        m = CategoryApiModel(
            id=category.id,
            name=category.name,
            owner_id=category.owner_id,
            icon_id=category.icon_id,
            icon_color=Color.parse(category.icon_color, style=ColorFormat.HEX),
            created_at=category.created_at,
            deleted_at=category.deleted_at,
        )
        return m

    def validate(self) -> None:
        if self.name is None or self.name == "":
            raise ValidationError(error="Name cannot be empty")
        if self.owner_id is None:
            raise ValidationError(error="Owner cannot be empty")
        if self.icon_id is None:
            raise ValidationError(error="Icon cannot be empty")
        if self.icon_color is None:
            raise ValidationError(error="Icon color cannot be empty")
