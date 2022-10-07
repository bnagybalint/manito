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
    notes: str = None
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
        if self.notes is not None:
            d["notes"] = self.notes
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
            notes=read_json(j, "notes", parser=str, default=None),
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
            notes=transaction.notes,
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

        if self.src_wallet_id == self.dst_wallet_id:
            raise ValidationError(error="Source and destination wallets cannot be the same")

        if self.amount < 0:
            raise ValidationError(error="Amount must be non-negative")
