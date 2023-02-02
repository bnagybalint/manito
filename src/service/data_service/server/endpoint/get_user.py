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
    UserApiModel,
)


@jwt_authenticate()
@serialize_response()
def get_user(jwt: JWT, user_id: int) -> ApiResponse:
    with ConnectionManager().create_connection().create_session() as db:
        user = db.query(User).get(user_id)

    if user is None:
        return BasicErrorApiModel(message=f"No user with ID {user_id}."), 404

    return UserApiModel.from_entity(user), 200
