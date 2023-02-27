import datetime as dt

from manito.db import ConnectionManager
from manito.db.entities import Transaction, User
from data_service.decorators import (
    jwt_authenticate,
    get_current_user_id,
    serialize_response,
)
from data_service.model import (
    ApiResponse,
    BasicErrorApiModel,
)


@jwt_authenticate()
@serialize_response()
def delete_transaction(transaction_id: int) -> ApiResponse:
    with ConnectionManager().create_connection().create_session() as db:
        transaction = db.query(Transaction).get(transaction_id)
        deleter = db.query(User).get(get_current_user_id())

        if transaction is None:
            return BasicErrorApiModel(message=f"No transaction with ID {transaction_id}."), 404

        transaction.deleted_at = dt.datetime.utcnow()
        transaction.deleter = deleter

        db.commit()

        return "", 204
