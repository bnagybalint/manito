import datetime as dt

from manito.db import ConnectionManager
from manito.db.entities import Category, User
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
def delete_category(category_id: int) -> ApiResponse:
    with ConnectionManager().create_connection().create_session() as db:
        category = db.query(Category).get(category_id)
        deleter = db.query(User).get(get_current_user_id())

        if category is None:
            return BasicErrorApiModel(message=f"No category with ID {category_id}."), 404

        category.deleted_at = dt.datetime.utcnow()
        category.deleter = deleter

        db.commit()

        return "", 204
