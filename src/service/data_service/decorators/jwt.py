import os
import jwt
import flask

from typing import Any, Dict
from flask_jwt_extended import jwt_required, get_jwt_identity

from data_service.model import BasicErrorApiModel


JWT = Dict[str, Any]

def verify_token(jwt_token: str) -> JWT:
    # TODO this should not come from env vars
    jwt_signing_key = os.environ["MANITO_JWT_SIGNING_KEY"]
    return jwt.decode(jwt_token, jwt_signing_key, algorithms=['HS256'])

jwt_authenticate = jwt_required

get_current_user_id = get_jwt_identity
