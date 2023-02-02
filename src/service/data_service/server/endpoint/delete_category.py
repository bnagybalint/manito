import datetime as dt

from manito.db import ConnectionManager
from manito.db.entities import Category
from data_service.model import (
    BasicErrorApiModel,
    ApiResponse,
)
from data_service.decorators import (
    jwt_authenticate,
    JWT,
    serialize_response,
)


@jwt_authenticate()
@serialize_response()
def delete_category(jwt: JWT, category_id: int) -> ApiResponse:
    with ConnectionManager().create_connection().create_session() as db:
        category = db.query(Category).get(category_id)

        if category is None:
            return BasicErrorApiModel(message=f"No category with ID {category_id}."), 404

        deleter_id = int(jwt["userId"])
        deleter = db.query(Category).get(deleter_id)

        category.deleted_at = dt.datetime.utcnow()
        category.deleter = deleter

        db.commit()

        return "", 204
