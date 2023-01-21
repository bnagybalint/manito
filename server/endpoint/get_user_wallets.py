import sqlalchemy

from db.connection import ConnectionManager
from db.entities import User
from api_utils import serialize_response
from model import (
    ApiResponse,
    BasicErrorApiModel,
    WalletApiModel,
)


@serialize_response()
def get_user_wallets(user_id: int) -> ApiResponse:
    with ConnectionManager().create_connection().create_session() as db:
        q = db.query(User)
        q = q.filter(User.id == user_id)
        q = q.options(sqlalchemy.orm.joinedload(User.wallets))
        user = q.one_or_none()

    if user is None:
        return BasicErrorApiModel(message=f"No user with ID {user_id}."), 404

    return [WalletApiModel.from_entity(w) for w in user.wallets], 200
