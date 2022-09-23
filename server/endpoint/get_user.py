from db.connection import ConnectionManager
from db.entities import User
from model.user import UserApiModel
from model.basic_error import BasicErrorApiModel
from model.utils import serialize_response
from model.api_response import ApiResponse


@serialize_response()
def get_user(user_id: int) -> ApiResponse:
    with ConnectionManager().create_connection().create_session() as db:
        user = db.query(User).get(user_id)

    if user is None:
        return BasicErrorApiModel(message=f"No user with ID {user_id}."), 404

    return UserApiModel.from_entity(user), 200
