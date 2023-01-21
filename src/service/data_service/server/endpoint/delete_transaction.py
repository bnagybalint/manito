import datetime as dt

from manito.db import ConnectionManager
from manito.db.entities import Transaction
from data_service.api_utils import serialize_response
from data_service.model import (
    ApiResponse,
    BasicErrorApiModel,
)


@serialize_response()
def delete_transaction(transaction_id: int) -> ApiResponse:
    with ConnectionManager().create_connection().create_session() as db:
        transaction = db.query(Transaction).get(transaction_id)

        if transaction is None:
            return BasicErrorApiModel(message=f"No transaction with ID {transaction_id}."), 404

        transaction.deleted_at = dt.datetime.utcnow(),
        transaction.deleter_id = None, # FIXME this should come from an authorization token

        db.commit()

        return "", 204