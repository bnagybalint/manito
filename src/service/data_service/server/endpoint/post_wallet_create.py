import datetime as dt

from manito.db import ConnectionManager
from manito.db.entities import User, Wallet
from data_service.model.wallet import WalletApiModel
from data_service.decorators import (
    jwt_authenticate,
    get_current_user_id,
    deserialize_body,
    serialize_response,
)
from data_service.model.api_response import ApiResponse
from data_service.model.basic_error import BasicErrorApiModel


@jwt_authenticate()
@deserialize_body(WalletApiModel)
@serialize_response()
def post_wallet_create(body: WalletApiModel) -> ApiResponse:
    with ConnectionManager().create_connection().create_session() as db:
        owner = db.query(User).get(body.owner_id)
        user = db.query(User).get(get_current_user_id())

        if owner is None or owner.deleted_at is not None:
            return BasicErrorApiModel(message=f"No user with ID {body.owner_id}."), 404

        wallet = Wallet(
            name=body.name,
            owner=owner,
            created_at=dt.datetime.utcnow(),
            creator=user,
            deleted_at=None,
            deleter=None,
        )

        db.add(wallet)
        db.commit()

        return WalletApiModel.from_entity(wallet), 200
