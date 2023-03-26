import datetime as dt

from manito.db import ConnectionManager
from manito.db.entities import Category, Transaction, User, Wallet
from data_service.decorators import (
    jwt_authenticate,
    get_current_user_id,
    deserialize_body,
    serialize_response,
)
from data_service.model import (
    ApiResponse,
    BasicErrorApiModel,
    TransactionApiModel,
)


@jwt_authenticate()
@deserialize_body(TransactionApiModel)
@serialize_response()
def post_transaction_create(body: TransactionApiModel) -> ApiResponse:
    with ConnectionManager().create_connection().create_session() as db:
        user = db.query(User).get(get_current_user_id())

        src_wallet = db.query(Wallet).get(body.src_wallet_id) if body.src_wallet_id is not None else None
        if body.src_wallet_id is not None and src_wallet is None:
            return BasicErrorApiModel(message=f"No wallet with ID {body.src_wallet_id}."), 400

        dst_wallet = db.query(Wallet).get(body.dst_wallet_id) if body.dst_wallet_id is not None else None
        if body.dst_wallet_id is not None and dst_wallet is None:
            return BasicErrorApiModel(message=f"No wallet with ID {body.dst_wallet_id}."), 400

        category = db.query(Category).get(body.category_id)
        if category is None:
            return BasicErrorApiModel(message=f"No category with ID {body.category_id}."), 400

        transaction = Transaction(
            notes=body.notes,
            amount=body.amount,
            time=body.time,
            category=category,
            created_at=dt.datetime.utcnow(),
            creator=user,
            deleted_at=None,
            deleter=None,
            src_wallet=src_wallet,
            dst_wallet=dst_wallet,
        )

        db.add(transaction)
        db.commit()

        return TransactionApiModel.from_entity(transaction), 200
