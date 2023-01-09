from db.connection import ConnectionManager
from db.entities import Icon
from model.icon import IconApiModel
from api_utils import serialize_response
from model.api_response import ApiResponse


@serialize_response()
def get_icons() -> ApiResponse:
    with ConnectionManager().create_connection().create_session() as db:
        icons = db.query(Icon).filter(Icon.deleted_at == None).all()

    return [IconApiModel.from_entity(u) for u in icons], 200
