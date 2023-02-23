import datetime as dt

from manito.db import ConnectionManager
from manito.db.entities import Wallet, User
from data_service.model import (
    BasicErrorApiModel,
    ApiResponse,
)
from data_service.decorators import (
    jwt_authenticate,
    get_current_user_id,
    serialize_response,
)


@jwt_authenticate()
@serialize_response()
def delete_wallet(wallet_id: int) -> ApiResponse:
    with ConnectionManager().create_connection().create_session() as db:
        wallet = db.query(Wallet).get(wallet_id)
        deleter = db.query(User).get(get_current_user_id())

        if wallet is None:
            return BasicErrorApiModel(message=f"No wallet with ID {wallet_id}."), 404

        wallet.deleted_at = dt.datetime.utcnow()
        wallet.deleter = deleter

        db.commit()

        return "", 204
