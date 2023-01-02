from core import Color, ColorFormat
from db.connection import ConnectionManager
from db.entities import Category, Icon
from model.category import CategoryApiModel
from model.utils import deserialize_body, serialize_response
from model.api_response import ApiResponse
from model.basic_error import BasicErrorApiModel


@deserialize_body(CategoryApiModel)
@serialize_response()
def update_category(category_id: int, body: CategoryApiModel) -> ApiResponse:
    with ConnectionManager().create_connection().create_session() as db:
        if body.id is not None and category_id != body.id:
            return BasicErrorApiModel(message=f"ID in body ({body.id}) and in path ({category_id}) does not match."), 400

        category: Category = db.query(Category).get(body.id)
        if category is None:
            return BasicErrorApiModel(message=f"No category with ID {body.category_id}."), 404

        icon: Icon = db.query(Icon).get(body.icon_id)
        if icon is None:
            return BasicErrorApiModel(message=f"No icon with ID {body.icon_id}."), 404

        category.name = body.name
        category.owner_id = body.owner_id # FIXME this should come from an authorization token
        category.icon = icon
        category.icon_color = body.icon_color.to_string(ColorFormat.HEX)

        db.add(category)
        db.commit()

        return CategoryApiModel.from_entity(category), 200
