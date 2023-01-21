from db.connection import ConnectionManager
from db.entities import User
from api_utils import serialize_response
from model import (
    ApiResponse,
    UserApiModel,
)


@serialize_response()
def get_users() -> ApiResponse:
    with ConnectionManager().create_connection().create_session() as db:
        users = db.query(User).all()

    return [UserApiModel.from_entity(u) for u in users], 200
