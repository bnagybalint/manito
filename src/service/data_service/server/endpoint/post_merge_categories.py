import datetime as dt
import sqlalchemy
import flask

from typing import List

from manito.db import ConnectionManager
from manito.db.entities import Transaction
from data_service.api_utils import deserialize_body, serialize_response
from data_service.model import (
    ApiResponse,
    TransactionApiModel,
    TransactionSearchParamsApiModel,
)


# @deserialize_body(TransactionSearchParamsApiModel)
# @serialize_response()
def post_merge_categories(body) -> ApiResponse:
    pass