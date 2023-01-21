import os
import jwt
import datetime as dt

from db.connection import ConnectionManager
from db.entities import User
from api_utils import deserialize_body, serialize_response
from security import (
    verify_password,
    PasswordToken,
)
from model import (
    ApiResponse,
    BasicErrorApiModel,
)

# @deserialize_body(SignUpRequestParamsApiModel)
@serialize_response()
def post_signup(body: any) -> ApiResponse:
    return 200