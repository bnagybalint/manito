import os
import datetime as dt
import flask

from google.oauth2 import id_token
from google.auth.exceptions import GoogleAuthError
from google.auth.transport import requests
from flask_jwt_extended import (
    create_access_token,
    set_access_cookies,
)

from manito.db import ConnectionManager
from manito.db.entities import User
from data_service.decorators import (
    deserialize_body,
)
from data_service.model import (
    ApiResponse,
    BasicErrorApiModel,
    GoogleLoginRequestParamsApiModel,
    LoginResponseApiModel,
    UserApiModel,
)

def handle_auth_error(reason: str):
    # TODO log auth error, include client IP, etc.
    return BasicErrorApiModel(message=f"Authentication failed"), 400

@deserialize_body(GoogleLoginRequestParamsApiModel)
def post_login_google(body: GoogleLoginRequestParamsApiModel) -> ApiResponse:

    try:
        google_client_id = str(os.environ["MANITO_GOOGLE_CLIENT_ID"])
        user_token = id_token.verify_oauth2_token(body.jwt, requests.Request(), google_client_id)

        user_email = user_token["email"]
    except GoogleAuthError:
        return handle_auth_error("Google auth failed")
    except Exception as e:
        return handle_auth_error("Invalid ID token received")

    with ConnectionManager().create_connection().create_session() as db:
        user: User = db.query(User).filter(User.email == user_email).one_or_none()

        if user is None:
            return handle_auth_error("Unregistered user tried to log in")

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
