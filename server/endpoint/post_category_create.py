import datetime as dt

from core import ColorFormat
from db.connection import ConnectionManager
from db.entities import (
    Category,
    Icon,
)
from api_utils import deserialize_body, serialize_response
from model.category import CategoryApiModel
from model.api_response import ApiResponse
from model.basic_error import BasicErrorApiModel


@deserialize_body(CategoryApiModel)
@serialize_response()
def post_category_create(body: CategoryApiModel) -> ApiResponse:
    with ConnectionManager().create_connection().create_session() as db:
        icon = db.query(Icon).get(body.icon_id)

        if icon is None:
            return BasicErrorApiModel(message=f"No icon with ID {body.icon_id}."), 400

        category = Category(
            name=body.name,
            owner_id=body.owner_id, # FIXME this should come from an authorization token
            icon_id=body.icon_id,
            icon_color=body.icon_color.to_string(ColorFormat.HEX),
            created_at=dt.datetime.utcnow(),
            creator=None, # FIXME this should come from an authorization token
            deleted_at=None,
            deleter=None,
        )

        db.add(category)
        db.commit()

        return CategoryApiModel.from_entity(category), 200
