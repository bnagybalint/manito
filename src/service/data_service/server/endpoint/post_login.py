import os
import jwt
import datetime as dt

from manito.db import ConnectionManager
from manito.db.entities import User
from data_service.api_utils import deserialize_body, serialize_response
from manito.security import (
    verify_password,
    PasswordToken,
)
from data_service.model import (
    ApiResponse,
    BasicErrorApiModel,
    LoginRequestParamsApiModel,
    LoginResponseApiModel,
)

def handle_auth_error():
    # TODO log auth error
    return BasicErrorApiModel(message=f"Authentication failed"), 400

@deserialize_body(LoginRequestParamsApiModel)
@serialize_response()
def post_login(body: LoginRequestParamsApiModel) -> ApiResponse:
    with ConnectionManager().create_connection().create_session() as db:
        user: User = db.query(User).filter(User.email == body.username).one_or_none()

        if user is None:
            return handle_auth_error()

        pw_token = PasswordToken.from_string(user.password_hash)
        
        if not verify_password(body.password, pw_token.salt, pw_token.hash):
            return handle_auth_error()

        # TODO these should not come from env vars
        jwt_signing_key = os.environ["JWT_SIGNING_KEY"]
        jwt_expiry_minutes = int(os.environ["JWT_EXPIRY_MINUTES"])

        token = jwt.encode(
            payload={
                "userId": user.id,
                "exp": dt.datetime.utcnow() + dt.timedelta(minutes=jwt_expiry_minutes)
            },
            key=jwt_signing_key,
            algorithm="HS256",
        )

        data = LoginResponseApiModel(jwt=token)
        
        return data, 200
