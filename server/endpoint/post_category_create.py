import datetime as dt

from db.connection import ConnectionManager
from db.entities import Category
from model.category import CategoryApiModel
from model.utils import deserialize_body, serialize_response
from model.api_response import ApiResponse


@deserialize_body(CategoryApiModel)
@serialize_response()
def post_category_create(body: CategoryApiModel) -> ApiResponse:
    with ConnectionManager().create_connection().create_session() as db:
        category = Category(
            name=body.name,
            owner_id=body.owner_id, # FIXME this should come from an authorization token
            created_at=dt.datetime.utcnow(),
            creator=None, # FIXME this should come from an authorization token
            deleted_at=None,
            deleter=None,
        )

        db.add(category)
        db.commit()

        return CategoryApiModel.from_entity(category), 200
