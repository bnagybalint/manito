import datetime as dt

from db.connection import ConnectionManager
from db.entities import Category, Transaction, Wallet
from model.transaction import TransactionApiModel
from api_utils import deserialize_body, serialize_response
from model.api_response import ApiResponse
from model.basic_error import BasicErrorApiModel


@deserialize_body(TransactionApiModel)
@serialize_response()
def update_transaction(transaction_id: int, body: TransactionApiModel) -> ApiResponse:
    with ConnectionManager().create_connection().create_session() as db:
        if body.id is not None and transaction_id != body.id:
            return BasicErrorApiModel(message=f"ID in body ({body.id}) and in path ({transaction_id}) does not match."), 400

        transaction: Transaction = db.query(Transaction).get(body.id)
        if transaction is None:
            return BasicErrorApiModel(message=f"No transaction with ID {body.category_id}."), 404

        src_wallet = db.query(Wallet).get(body.src_wallet_id) if body.src_wallet_id is not None else None
        if body.src_wallet_id is not None and src_wallet is None:
            return BasicErrorApiModel(message=f"No wallet with ID {body.src_wallet_id}."), 400

        dst_wallet = db.query(Wallet).get(body.dst_wallet_id) if body.dst_wallet_id is not None else None
        if body.dst_wallet_id is not None and dst_wallet is None:
            return BasicErrorApiModel(message=f"No wallet with ID {body.dst_wallet_id}."), 400

        category = db.query(Category).get(body.category_id) if body.category_id is not None else None
        if category is None:
            return BasicErrorApiModel(message=f"No category with ID {body.category_id}."), 400

        transaction.amount = body.amount
        transaction.notes = body.notes
        transaction.time = body.time
        transaction.category = category
        transaction.src_wallet = src_wallet
        transaction.dst_wallet = dst_wallet

        db.add(transaction)
        db.commit()

        return TransactionApiModel.from_entity(transaction), 200
