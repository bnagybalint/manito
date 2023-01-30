import os
import jwt
import datetime as dt

from google.oauth2 import id_token
from google.auth.exceptions import GoogleAuthError
from google.auth.transport import requests

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
    GoogleLoginRequestParamsApiModel,
    LoginResponseApiModel,
    UserApiModel,
)

def handle_auth_error(reason: str):
    # TODO log auth error, include client IP, etc.
    return BasicErrorApiModel(message=f"Authentication failed"), 400

@deserialize_body(GoogleLoginRequestParamsApiModel)
@serialize_response()
def post_login_google(body: GoogleLoginRequestParamsApiModel) -> ApiResponse:

    try:
        google_client_id = str(os.environ["GOOGLE_CLIENT_ID"])
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

        data = LoginResponseApiModel(
            user=UserApiModel.from_entity(user),
            jwt=token,
        )
        
        return data, 200
