from __future__ import annotations

import datetime as dt
import dateutil.parser

from typing import Dict, Any
from dataclasses import dataclass

from data_service.model.api_model import ApiModel
from manito.db.entities import Wallet
from manito.core import (
    read_json,
    ValidationError,
)

@dataclass
class WalletApiModel(ApiModel):
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
    def from_json(j: Dict[str, Any]) -> WalletApiModel:
        m = WalletApiModel(
            id=read_json(j, "id", parser=int, default=None),
            name=read_json(j, "name", parser=str),
            owner_id=read_json(j, "ownerId", parser=int),
            created_at=read_json(j, "createdAt", parser=dateutil.parser.isoparse, default=None),
            deleted_at=read_json(j, "deletedAt", parser=dateutil.parser.isoparse, default=None),
        )
        return m

    @staticmethod
    def from_entity(wallet: Wallet) -> WalletApiModel:
        m = WalletApiModel(
            id=wallet.id,
            name=wallet.name,
            owner_id=wallet.owner_id,
            created_at=wallet.created_at,
            deleted_at=wallet.deleted_at,
        )
        return m

    def validate(self) -> None:
        if self.name is None or self.name == "":
            raise ValidationError(error="Name cannot be empty")
        if self.owner_id is None:
            raise ValidationError(error="Owner cannot be empty")

