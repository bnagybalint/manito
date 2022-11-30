from __future__ import annotations

import datetime as dt
import dateutil.parser

from typing import Dict, Any
from dataclasses import dataclass

from core import read_json, ValidationError
from model.api_model import ApiModel
from db.entities import Category

@dataclass
class CategoryApiModel(ApiModel):
    name: str
    owner_id: int
    id: int = None
    created_at: dt.datetime = None
    deleted_at: dt.datetime = None

    def to_json(self) -> Dict[str, Any]:
        d = {
            "name": self.name,
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
            created_at=category.created_at,
            deleted_at=category.deleted_at,
        )
        return m

    def validate(self) -> None:
        if self.name is None or self.name == "":
            raise ValidationError(error="Name cannot be empty")
        if self.owner_id is None:
            raise ValidationError(error="Owner cannot be empty")
