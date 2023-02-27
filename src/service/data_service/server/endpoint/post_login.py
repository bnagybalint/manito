import os
import datetime as dt
import flask

from flask_jwt_extended import (
    create_access_token,
    set_access_cookies,
)

from manito.db import ConnectionManager
from manito.db.entities import User
from data_service.decorators import (
    deserialize_body,
    serialize_response,
)
from manito.security import (
    verify_password,
    PasswordToken,
)
from data_service.model import (
    ApiResponse,
    BasicErrorApiModel,
    LoginRequestParamsApiModel,
    LoginResponseApiModel,
    UserApiModel,
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

        access_token_expiry_minutes = int(os.environ["MANITO_JWT_EXPIRY_MINUTES"])
        access_token = create_access_token(
            identity=user.id,
            expires_delta=dt.timedelta(minutes=access_token_expiry_minutes),
        )

        resp = flask.jsonify(
            LoginResponseApiModel(
                user=UserApiModel.from_entity(user),
                jwt="", # reserved for refresh token, maybe
            ).to_json()
        )
        set_access_cookies(resp, access_token)

        return resp
