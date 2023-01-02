import datetime as dt
import sqlalchemy
import flask

from typing import List

from db.connection import ConnectionManager
from db.entities import Transaction
from model.transaction import TransactionApiModel
from model.transaction_search_params import TransactionSearchParamsApiModel
from model.utils import deserialize_body, serialize_response
from model.api_response import ApiResponse


# @deserialize_body(TransactionSearchParamsApiModel)
# @serialize_response()
def post_merge_categories(body) -> ApiResponse:
    pass