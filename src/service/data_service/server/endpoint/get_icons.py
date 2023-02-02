from manito.db import ConnectionManager
from manito.db.entities import Icon
from data_service.decorators import (
    jwt_authenticate,
    JWT,
    serialize_response,
)
from data_service.model import (
    ApiResponse,
    IconApiModel,
)


@jwt_authenticate()
@serialize_response()
def get_icons(jwt: JWT) -> ApiResponse:
    with ConnectionManager().create_connection().create_session() as db:
        icons = db.query(Icon).filter(Icon.deleted_at == None).all()

    return [IconApiModel.from_entity(u) for u in icons], 200
