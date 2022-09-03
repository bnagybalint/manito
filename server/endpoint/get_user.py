from db.connection import ConnectionManager
from db.entities import User
from model.user import UserApiModel
from model.basic_error import BasicErrorApiModel

def get_user(user_id: int):
    with ConnectionManager().create_connection().create_session() as db:
        user = db.query(User).get(user_id)

    if user is None:
        return BasicErrorApiModel(message=f"No user with ID {user_id}.").to_json(), 404

    return UserApiModel.from_entity(user).to_json(), 200
