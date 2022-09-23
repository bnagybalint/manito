import pytest
import datetime as dt

from typing import Any

from core.json import read_json


def test_access() -> None:
    assert read_json({"a": 42}, "a") == 42
    assert read_json({"a": 3.14}, "a") == 3.14
    assert read_json({"a": [2, 3]}, "a") == [2, 3]
    assert read_json({"a": {"b": "c"}}, "a") == {"b": "c"}
    assert read_json({"a": "schwifty"}, "a") == "schwifty"
    assert read_json({"a": "schwifty", "b": "meeseeks"}, "b") == "meeseeks"

    with pytest.raises(KeyError):
        read_json({}, "a"), "Missing keys should be reported"
    with pytest.raises(KeyError):
        read_json({"a": 42}, "b"), "Missing keys should be reported"

    with pytest.raises(TypeError):
        read_json({"a": 42}, 0), "Key must by a string"

def test_type_parsing() -> None:
    assert read_json({"a": 42}, "a", parser=int) == 42
    assert isinstance(read_json({"a": 42}, "a", parser=int), int)

    assert read_json({"a": 42}, "a", parser=str) == "42", "Should accept any callable as 'parser'"
    assert read_json({"a": "42"}, "a", parser=int) == 42, "Should accept any callable as 'parser'"
    assert read_json({"a": "2022-09-01"}, "a", parser=dt.date.fromisoformat) == dt.date(2022,9,1), "Should accept any callable as 'parser'"

    def fails(x: Any) -> None:
        raise ValueError()
    with pytest.raises(ValueError):
        read_json({"a": 42}, "a", parser=fails), "Errors raised during parsing should be propagated up"

def test_default() -> None:
    assert read_json({"a": 1}, "a", default=666) == 1
    assert read_json({"a": 1}, "b", default=666) == 666, "Should return the default value for missing fields"

    with pytest.raises(KeyError):
        read_json({"a": 1}, "b"), "Missing fields without a default should report an error"

def test_default_with_parser() -> None:
    assert isinstance(read_json({"a": 1}, "b", default="543", parser=int), str), "Using default bypasses parser"
    assert read_json({"a": 1}, "b", default="543", parser=int) == "543", "Using default bypasses parser"

