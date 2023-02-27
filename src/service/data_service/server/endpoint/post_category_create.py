import datetime as dt

from manito.core import ColorFormat
from manito.db import ConnectionManager
from manito.db.entities import (
    Category,
    Icon,
    User,
)
from data_service.decorators import (
    jwt_authenticate,
    get_current_user_id,
    deserialize_body,
    serialize_response,
)
from data_service.model import (
    ApiResponse,
    BasicErrorApiModel,
    CategoryApiModel,
)


@jwt_authenticate()
@deserialize_body(CategoryApiModel)
@serialize_response()
def post_category_create(body: CategoryApiModel) -> ApiResponse:
    with ConnectionManager().create_connection().create_session() as db:
        icon = db.query(Icon).get(body.icon_id)
        user = db.query(User).get(get_current_user_id())

        if icon is None:
            return BasicErrorApiModel(message=f"No icon with ID {body.icon_id}."), 400

        category = Category(
            name=body.name,
            owner_id=body.owner_id,
            icon_id=body.icon_id,
            icon_color=body.icon_color.to_string(ColorFormat.HEX),
            created_at=dt.datetime.utcnow(),
            creator=user,
            deleted_at=None,
            deleter=None,
        )

        db.add(category)
        db.commit()

        return CategoryApiModel.from_entity(category), 200
