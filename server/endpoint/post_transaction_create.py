import datetime as dt

from db.connection import ConnectionManager
from db.entities import Transaction
from model.transaction import TransactionApiModel
from model.utils import deserialize_body, serialize_response
from model.api_response import ApiResponse


@deserialize_body(TransactionApiModel)
@serialize_response()
def post_transaction_create(body: TransactionApiModel) -> ApiResponse:
    with ConnectionManager().create_connection().create_session() as db:
        transaction = Transaction(
            notes=body.notes,
            amount=body.amount,
            time=body.time,
            created_at=dt.datetime.utcnow(),
            creator=None, # FIXME this should come from an authorization token
            deleted_at=None,
            deleter=None,
            src_wallet_id=body.src_wallet_id,
            dst_wallet_id=body.dst_wallet_id,
        )

        db.add(transaction)
        db.commit()

        return transaction.id, 200
