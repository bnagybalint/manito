from __future__ import annotations

import datetime as dt

from typing import Dict, Any
from dataclasses import dataclass

from model.api_model import ApiModel
from db.entities import Wallet

@dataclass
class WalletApiModel(ApiModel):
    id: int
    name: str
    owner_id: int
    created_at: dt.datetime
    deleted_at: dt.datetime

    def to_json(self) -> Dict[str, Any]:
        d = {
            "id": self.id,
            "name": self.name,
            "owner_id": self.owner_id,
            "created_at": self.created_at.isoformat(),
        }

        if self.deleted_at is not None:
            d["deleted_at"]: self.deleted_at.isoformat()

        return d

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

