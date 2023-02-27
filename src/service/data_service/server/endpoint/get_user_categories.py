import sqlalchemy

from manito.db import ConnectionManager
from manito.db.entities import User
from data_service.decorators import (
    jwt_authenticate,
    serialize_response,
)
from data_service.model import (
    ApiResponse,
    BasicErrorApiModel,
    CategoryApiModel,
)


@jwt_authenticate()
@serialize_response()
def get_user_categories(user_id: int) -> ApiResponse:
    with ConnectionManager().create_connection().create_session() as db:
        q = db.query(User)
        q = q.filter(User.id == user_id)
        q = q.options(sqlalchemy.orm.joinedload(User.categories))
        user = q.one_or_none()

    if user is None:
        return BasicErrorApiModel(message=f"No user with ID {user_id}."), 404

    return [CategoryApiModel.from_entity(c) for c in user.categories if c.deleted_at is None], 200
