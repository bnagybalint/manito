from db.connection import ConnectionManager
from db.entities import Transaction
from api_utils import serialize_response
from model import (
    ApiResponse,
    BasicErrorApiModel,
    TransactionApiModel,
)


@serialize_response()
def get_transaction(transaction_id: int) -> ApiResponse:
    with ConnectionManager().create_connection().create_session() as db:
        transaction: Transaction = db.query(Transaction).get(transaction_id)

    if transaction is None or transaction.deleted_at is not None:
        return BasicErrorApiModel(message=f"No transaction with ID {transaction_id}."), 404

    return TransactionApiModel.from_entity(transaction), 200