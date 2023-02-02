import sqlalchemy

from manito.db import ConnectionManager
from manito.db.entities import User
from data_service.decorators import (
    jwt_authenticate,
    JWT,
    serialize_response,
)
from data_service.model import (
    ApiResponse,
    BasicErrorApiModel,
    WalletApiModel,
)


@jwt_authenticate()
@serialize_response()
def get_user_wallets(jwt: JWT, user_id: int) -> ApiResponse:
    with ConnectionManager().create_connection().create_session() as db:
        q = db.query(User)
        q = q.filter(User.id == user_id)
        q = q.options(sqlalchemy.orm.joinedload(User.wallets))
        user = q.one_or_none()

    if user is None:
        return BasicErrorApiModel(message=f"No user with ID {user_id}."), 404

    return [WalletApiModel.from_entity(w) for w in user.wallets], 200
