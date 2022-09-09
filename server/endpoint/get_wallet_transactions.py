import datetime as dt
import sqlalchemy

from typing import List

from db.connection import ConnectionManager
from db.entities import Wallet, Transaction
from model.transaction import TransactionApiModel
from model.basic_error import BasicErrorApiModel

def get_wallet_transactions(
    wallet_id: int,
    from_date: dt.date = None,
    to_date: dt.date = None,
):
    with ConnectionManager().create_connection().create_session() as db:
        wallet: Wallet = db.query(Wallet).get(wallet_id)
        if wallet is None:
            return BasicErrorApiModel(message=f"No wallet with ID {wallet_id}.").to_json(), 404

        q = db.query(Transaction)
        q = q.filter(sqlalchemy.or_(Transaction.src_wallet_id == wallet_id, Transaction.dst_wallet_id == wallet_id))

        if from_date is not None:
            q = q.filter(sqlalchemy.sql.func.date(Transaction.time) >= from_date)
        if to_date is not None:
            q = q.filter(sqlalchemy.sql.func.date(Transaction.time) <= to_date)
            
        transactions: List[Transaction] = q.all()

    return [TransactionApiModel.from_entity(t).to_json() for t in transactions], 200
