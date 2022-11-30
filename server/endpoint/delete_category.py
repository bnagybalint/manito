import datetime as dt

from db.connection import ConnectionManager
from db.entities import Category
from model.basic_error import BasicErrorApiModel
from model.utils import serialize_response
from model.api_response import ApiResponse


@serialize_response()
def delete_category(category_id: int) -> ApiResponse:
    with ConnectionManager().create_connection().create_session() as db:
        category = db.query(Category).get(category_id)

        if category is None:
            return BasicErrorApiModel(message=f"No category with ID {category_id}."), 404

        category.deleted_at = dt.datetime.utcnow(),
        category.deleter_id = None, # FIXME this should come from an authorization token

        db.commit()

        return "", 204
