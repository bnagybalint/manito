from manito.db import ConnectionManager
from manito.db.entities import Icon
from data_service.api_utils import serialize_response
from data_service.model import (
    ApiResponse,
    IconApiModel,
)


@serialize_response()
def get_icons() -> ApiResponse:
    with ConnectionManager().create_connection().create_session() as db:
        icons = db.query(Icon).filter(Icon.deleted_at == None).all()

    return [IconApiModel.from_entity(u) for u in icons], 200
