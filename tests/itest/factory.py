import os
import datetime as dt
import jwt

from collections import namedtuple

from manito.db import Connection
from manito.db.entities import User
from manito.security import (
    generate_password_salt,
    generate_salted_password_hash,
    PasswordToken,
)


UserData = namedtuple("UserData", "id jwt")

class DummyFactory:
    def __init__(self, db_connection: Connection) -> None:
        self.db_connection = db_connection

    def createUser(self, name: str = "dummy", password: str = "dummy", **kwargs) -> UserData:
        with self.db_connection.create_session() as db:
            salt = generate_password_salt()
            hash = generate_salted_password_hash(password, salt)
            pw_token = PasswordToken(hash=hash, salt=salt)

            user = User(
                name=name,
                password_hash=pw_token.to_string(),
                email=f"dummy@dummy.com",
                created_at=dt.datetime.utcnow(),
                **kwargs,
            )

            db.add(user)
            db.commit()
            user_id = user.id

        jwt_signing_key = os.environ["JWT_SIGNING_KEY"]
        jwt_token = jwt.encode(
            payload={
                "userId": user_id,
                "exp": dt.datetime.utcnow() + dt.timedelta(minutes=24*60)
            },
            key=jwt_signing_key,
            algorithm="HS256",
        )

        return UserData(user_id, jwt_token)
        