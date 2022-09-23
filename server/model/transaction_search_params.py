from __future__ import annotations

import datetime as dt
import dateutil.parser

from typing import Dict, Any
from dataclasses import dataclass

from model.api_model import ApiModel
from core import ValidationError
from core import read_json

def date_parser(x: str) -> dt.date:
    return dateutil.parser.isoparse(x).date()

@dataclass
class TransactionSearchParamsApiModel(ApiModel):
    max_amount: float = None
    min_amount: float = None
    end_date: dt.date = None
    start_date: dt.date = None
    wallet_id: int = None

    @staticmethod
    def from_json(j: Dict[str, Any]) -> TransactionSearchParamsApiModel:
        m = TransactionSearchParamsApiModel(
            min_amount=read_json(j, "minAmount", parser=float, default=None),
            max_amount=read_json(j, "maxAmount", parser=float, default=None),
            start_date=read_json(j, "startDate", parser=date_parser, default=None),
            end_date=read_json(j, "endDate", parser=date_parser, default=None),
            wallet_id=read_json(j, "walletId", parser=int, default=None),
        )
        return m

    def to_json(self) -> Dict[str, Any]:
        j = {}
        if self.min_amount is not None:
            j["minAmount"] = float(self.min_amount)
        if self.max_amount is not None:
            j["maxAmount"] = float(self.max_amount)
        if self.start_date is not None:
            j["startDate"] = self.start_date.isoformat()
        if self.end_date is not None:
            j["endDate"] = self.end_date.isoformat()
        if self.wallet_id is not None:
            j["walletId"] = int(self.wallet_id)
        return j

    def validate(self) -> None:
        if self.min_amount is not None and self.min_amount < 0:
            raise ValidationError(error="Minimum amount must be non-negative")
        if self.max_amount is not None and self.max_amount < 0:
            raise ValidationError(error="Maximum amount must be non-negative")
        if self.min_amount is not None and self.max_amount is not None and self.min_amount > self.max_amount:
            raise ValidationError(error=f"Minimum amount cannot be higher than the maximum")

        if self.start_date is not None and self.end_date is not None and self.start_date > self.end_date:
            raise ValidationError(error=f"Start date cannot be later than the end date")
