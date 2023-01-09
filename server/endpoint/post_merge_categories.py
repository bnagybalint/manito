import datetime as dt
import sqlalchemy
import flask

from typing import List

from db.connection import ConnectionManager
from db.entities import Transaction
from api_utils import deserialize_body, serialize_response
from model import (
    ApiResponse,
    TransactionApiModel,
    TransactionSearchParamsApiModel,
)


# @deserialize_body(TransactionSearchParamsApiModel)
# @serialize_response()
def post_merge_categories(body) -> ApiResponse:
    pass