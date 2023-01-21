import flask

from typing import Any, Dict, List, Tuple, Union

JsonCompatible = Union[int, float, bool, str, List[Any], Dict[str, Any]]

ApiResponse = Union[
    # jsonified naked response + automatic 200 OK status
    JsonCompatible,
    # jsonified response + status
    Tuple[JsonCompatible, int],
    # jsonified response + headers + status
    Tuple[JsonCompatible, Dict[str, str], int],
    # raw Flask response
    flask.Response,
]