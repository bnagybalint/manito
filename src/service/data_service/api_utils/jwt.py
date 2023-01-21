import os
import jwt
import flask

from typing import Any, Dict

from data_service.model import BasicErrorApiModel

JWT = Dict[str, Any]

def jwt_authenticate(param_name="jwt"):
    """Decorator to verify JWT authentication token.

    Parameters
    ----------
    param_name : str, optional
        The parsed and verified token will be passed to the decorated function in a keyword
        parameter with this name. If set to None, the token is not passed at all.
    """
    def inner(func):
        def decorated(*args, **kwargs) -> flask.Response:

            if "x-access-token" not in flask.request.headers:
                return flask.make_response(
                    BasicErrorApiModel(message="Authentication token missing from request").to_json(),
                    401,
                )
            
            jwt_token = flask.request.headers["x-access-token"]

            # TODO this should not come from env vars
            jwt_signing_key = os.environ["JWT_SIGNING_KEY"]

            try:
                jwt_data = jwt.decode(jwt_token, jwt_signing_key, algorithms=['HS256'])
            except:
                return flask.make_response(
                    BasicErrorApiModel(message="Authentication token invalid").to_json(),
                    401,
                )

            kwargs_copy = { **kwargs }

            if param_name is not None:
                kwargs_copy[param_name] = jwt_data

            ret = func(*args, **kwargs_copy)

            return ret

        return decorated

    return inner
