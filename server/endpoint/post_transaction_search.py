import datetime as dt
import sqlalchemy
import flask

from typing import List

from db.connection import ConnectionManager
from db.entities import Transaction
from model.transaction import TransactionApiModel
from model.transaction_search_params import TransactionSearchParamsApiModel
from model.utils import deserialize_body, serialize_response
from model.api_response import ApiResponse


@deserialize_body(TransactionSearchParamsApiModel)
@serialize_response()
def post_transaction_search(body: TransactionSearchParamsApiModel) -> ApiResponse:
    with ConnectionManager().create_connection().create_session() as db:
        q = db.query(Transaction)

        if body.wallet_id is not None:
            q = q.filter(sqlalchemy.or_(
                Transaction.src_wallet_id == body.wallet_id,
                Transaction.dst_wallet_id == body.wallet_id
            ))

        if body.min_amount is not None:
            q = q.filter(Transaction.amount >= body.min_amount)
        if body.max_amount is not None:
            q = q.filter(Transaction.amount <= body.max_amount)

        if body.search_string is not None and body.search_string != "":
            q = q.filter(Transaction.notes.ilike(f"%{body.search_string}%"))

        if body.start_date is not None:
            q = q.filter(sqlalchemy.sql.func.date(Transaction.time) >= dt.datetime.combine(body.start_date, dt.time()))
        if body.end_date is not None:
            q = q.filter(sqlalchemy.sql.func.date(Transaction.time) <= dt.datetime.combine(body.end_date, dt.time()))

        transactions: List[Transaction] = q.all()

    return [TransactionApiModel.from_entity(t) for t in transactions], 200
