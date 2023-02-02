from __future__ import annotations

from dataclasses import dataclass

from data_service.model import ApiModel
from data_service.decorators import deserialize_body

@dataclass
class MyApiModel(ApiModel):
    odd: int

    @staticmethod
    def from_json(j) -> MyApiModel:
        return MyApiModel(odd=int(j["odd"]))

    def validate(self) -> None:
        if self.odd % 2 != 1:
            raise Exception("Odd must be odd")

def test_deserialize() -> None:

    @deserialize_body(MyApiModel)
    def my_handler(body: MyApiModel):
        assert isinstance(body, MyApiModel)
        return {}, 200

    r, status = my_handler(body={"odd": 1})
    assert status == 200

def test_deserialization_error() -> None:

    @deserialize_body(MyApiModel)
    def my_handler(body: MyApiModel):
        assert isinstance(body, MyApiModel)
        return {}, 200

    r, status = my_handler(body={"mumbo": "jumbo"})
    assert status == 400, "Parsing error should be indicated with a client error status code"

def test_validate() -> None:

    @deserialize_body(MyApiModel, validate=True)
    def my_handler(body: MyApiModel):
        assert isinstance(body, MyApiModel)
        return {}, 200

    r, status = my_handler(body={"odd": 1})
    assert status == 200, "Validation should succeed"

    r, status = my_handler(body={"odd": 2})
    assert status == 400, "Validation should fail with a client error status code"

    @deserialize_body(MyApiModel, validate=False)
    def my_unsafe_handler(body: MyApiModel):
        assert isinstance(body, MyApiModel)
        return {}, 200

    r, status = my_unsafe_handler(body={"odd": 2})
    assert status == 200, "Should succeed even though validation would fail"
