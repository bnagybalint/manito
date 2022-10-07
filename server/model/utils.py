import flask

from typing import Any, List, Type, Union

from model.api_model import ApiModel
from model.basic_error import BasicErrorApiModel


def deserialize_body(model_type: Type[ApiModel], validate: bool = True):
    """Decorator that converts the request handler's "body" argument (received from Flask/Connexion)
    into an ApiModel object.

    The decorator will:
    - deserialize the ApiModel from the received body argument, using the `from_json()` method
    - validate the model object using `validate()`, if the `validate` argument is true

    Usage:
    ```Python
        @deserialize_body(MyApiModel, validate=False)
        def my_request_handler(body: MyApiModel):
            ...
    ```
    
    Parameters
    ----------
    model_type : Type[ApiModel]
        Class with ApiModel-compatible interface.
    validate : bool, optional
        If true, the resulting API model object is validated with its `validate()` method before
        passing it on.
    """
    def inner(func):
        def wrapper(*args, **kwargs) -> flask.Response:

            kwargs_copy = { **kwargs }

            if "body" in kwargs_copy:
                body_raw = kwargs["body"]

                try:
                    model_object = model_type.from_json(body_raw)
                except Exception as e:
                    error = BasicErrorApiModel(message=f"Failed to parse request body: {e}")
                    # serialize by hand to ensure proper serializaton with any decorator ordering
                    return error.to_json(), 400

                kwargs_copy["body"] = model_object

                if validate:
                    try:
                        model_object.validate()
                    except Exception as e:
                        error = BasicErrorApiModel(message=f"Invalid request: {e}")
                        # serialize by hand to ensure proper serializaton with any decorator ordering
                        return error.to_json(), 400

            ret = func(*args, **kwargs_copy)

            return ret

        return wrapper

    return inner

def serialize_response():
    """Decorator that converts the response data from API models into serialized JSON data.

    Usage:
    ```Python
        @serialize_response()
        def my_request_handler():
            ...
            return [ApiModel.from_entity(x) for x in items], 200
    ```
    """
    def inner(func):
        def wrapper(*args, **kwargs) -> flask.Response:
            ret = func(*args, **kwargs)

            if isinstance(ret, tuple) and len(ret) == 2:
                # TODO response must be a data+status pair for now
                data = ret[0]

                try:
                    data_json = jsonify_response(data)
                except Exception as e:
                    error = BasicErrorApiModel(message=f"Failed to serialize response: {e}")
                    return error.to_json(), 500

                return (data_json,) + ret[1:]
            
            raise NotImplementedError()

        return wrapper

    return inner

ValidData = Union[
    int, # mainly for IDs
    ApiModel,
]

def jsonify_response(data: Union[ValidData, List[ValidData]]) -> Any:
    if isinstance(data, int):
        return data
    if isinstance(data, ApiModel):
        return data.to_json()
    if isinstance(data, list):
        return [jsonify_response(d) for d in data]
    raise TypeError(f"Unable to jsonify unknown type: {type(data)}")