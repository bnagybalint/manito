from manito.db import ConnectionManager
from manito.db.entities import User
from data_service.decorators import (
    jwt_authenticate,
    JWT,
    serialize_response,
)
from data_service.model import (
    ApiResponse,
    UserApiModel,
)


@jwt_authenticate()
@serialize_response()
def get_users(jwt: JWT) -> ApiResponse:
    with ConnectionManager().create_connection().create_session() as db:
        users = db.query(User).all()

    return [UserApiModel.from_entity(u) for u in users], 200
