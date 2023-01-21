from __future__ import annotations

from typing import Any, Dict
from dataclasses import dataclass

from data_service.model import ApiModel
from data_service.api_utils import serialize_response

@dataclass
class MyApiModel(ApiModel):
    odd: int

    def to_json(self) -> Dict[str, Any]:
        return {"odd": int(self.odd)}

def test_model_serialize() -> None:

    @serialize_response()
    def my_handler():
        return MyApiModel(odd=231), 200

    r, status = my_handler()
    assert status == 200
    assert isinstance(r, dict)
    assert r["odd"] == 231

def test_serialization_error() -> None:

    @serialize_response()
    def my_handler():
        return MyApiModel(odd="this_is_a_string"), 200

    _, status = my_handler()
    assert status == 500, "Serialization error should be indicated with a server error status code"

def test_model_list_serialize() -> None:

    @serialize_response()
    def my_handler():
        return [MyApiModel(odd=x) for x in range(231, 236, 2)], 200

    r, status = my_handler()
    assert status == 200
    assert isinstance(r, list)
    for x in r:
        assert isinstance(x, dict)
        assert x["odd"] % 2 == 1
