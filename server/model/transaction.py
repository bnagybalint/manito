from __future__ import annotations

import datetime as dt

from typing import Dict, Any
from dataclasses import dataclass

from model.api_model import ApiModel
from db.entities import Transaction

@dataclass
class TransactionApiModel(ApiModel):
    id: int
    description: str
    amount: float # TODO IMPORTANT will need to handle money with precise operations, e.g. using a fixed-point type
    time: dt.datetime
    created_at: dt.datetime
    deleted_at: dt.datetime
    src_wallet_id: int
    dst_wallet_id: int

    def to_json(self) -> Dict[str, Any]:
        d = {
            "id": self.id,
            "amount": float(self.amount),
            "time": self.time.isoformat(),
            "created_at": self.created_at,
        }

        if self.description is not None:
            d["description"] = self.description
        if self.deleted_at is not None:
            d["deleted_at"] = self.deleted_at.isoformat()
        if self.src_wallet_id is not None:
            d["src_wallet_id"] = self.src_wallet_id
        if self.dst_wallet_id is not None:
            d["dst_wallet_id"] = self.dst_wallet_id

        return d

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

