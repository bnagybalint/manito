from db.connection import ConnectionManager
from db.entities import User
from model.user import UserApiModel

def get_users():
    with ConnectionManager().create_connection().create_session() as db:
        users = db.query(User).all()

    return [UserApiModel.from_entity(u).to_json() for u in users], 200
