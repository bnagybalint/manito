from __future__ import annotations

import datetime as dt
import dateutil.parser

from typing import Dict, Any
from dataclasses import dataclass

from core import ValidationError
from core import read_json
from model.api_model import ApiModel
from db.entities import Transaction


@dataclass
class TransactionApiModel(ApiModel):
    amount: float # TODO IMPORTANT will need to handle money with precise operations, e.g. using a fixed-point type
    time: dt.datetime
    id: int = None
    description: str = None
    created_at: dt.datetime = None
    deleted_at: dt.datetime = None
    src_wallet_id: int = None
    dst_wallet_id: int = None

    def to_json(self) -> Dict[str, Any]:
        d = {
            "amount": float(self.amount),
            "time": self.time.isoformat(),
        }

        if self.created_at is not None:
            d["createdAt"] = self.created_at.isoformat() # can be None in requests
        if self.id is not None:
            d["id"] = self.id # can be None in requests
        if self.description is not None:
            d["description"] = self.description
        if self.deleted_at is not None:
            d["deletedAt"] = self.deleted_at.isoformat()
        if self.src_wallet_id is not None:
            d["sourceWalletId"] = self.src_wallet_id
        if self.dst_wallet_id is not None:
            d["destinationWalletId"] = self.dst_wallet_id

        return d

    @staticmethod
    def from_json(j: Dict[str, Any]) -> TransactionApiModel:
        m = TransactionApiModel(
            id=read_json(j, "id", parser=int, default=None),
            amount=read_json(j, "amount", parser=float),
            time=read_json(j, "time", parser=dateutil.parser.isoparse),
            description=read_json(j, "description", parser=str, default=None),
            src_wallet_id=read_json(j, "sourceWalletId", parser=int, default=None),
            dst_wallet_id=read_json(j, "destinationWalletId", parser=int, default=None),
            created_at=read_json(j, "createdAt", parser=dateutil.parser.isoparse, default=None),
            deleted_at=read_json(j, "deletedAt", parser=dateutil.parser.isoparse, default=None),
        )
        return m

    @staticmethod
    def from_entity(transaction: Transaction) -> TransactionApiModel:
        m = TransactionApiModel(
            id=transaction.id,
            description=transaction.description,
            amount=transaction.amount,
            time=transaction.time,
            created_at=transaction.created_at,
            deleted_at=transaction.deleted_at,
            src_wallet_id=transaction.src_wallet_id,
            dst_wallet_id=transaction.dst_wallet_id,
        )
        return m

    def validate(self) -> None:
        if self.src_wallet_id is None and self.dst_wallet_id is None:
            raise ValidationError(error="Either source or destination wallet must be defined")
        if self.amount < 0:
            raise ValidationError(error="Amount must be non-negative")
