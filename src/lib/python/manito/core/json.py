from __future__ import annotations
from typing import Any, Dict

from manito.core.undefined import UNDEFINED


def read_json(
    obj: Dict[str,Any],
    key: str,
    parser: callable = UNDEFINED,
    default: Any = UNDEFINED,
) -> Any:
    """Read data from JSON-like Python object conveniently and in a type safe manner.

    Parameters
    ----------
    obj : Dict[str,Any]
        Object to read from
    key : str
        Key/field to read
    parser : callable, optional
        Callable that is used to process the value at the field into the correct type. 
    default : Any, optional
        If provided, this value will be returned when referencing a missing field. If no default
        is given, referencing a missing field results in an exceptions

    Returns
    -------
    Any
        Field value, converted by the parser argument, or the default value.

    Raises
    ------
    TypeError
        If the type of the key is not valid.
    KeyError
        If the key was not found and no default was given.
    """
    if not isinstance(key, str):
        raise TypeError(f"Key must be a string (got '{type(key)}')")

    if key in obj:
        value = obj[key]
        if parser != UNDEFINED:
            value = parser(value)

    elif default is not UNDEFINED:
        value = default

    else:
        raise KeyError(key)


    return value
