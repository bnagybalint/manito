from __future__ import annotations

from typing import Dict, Any

class ApiModel:
    @classmethod
    def from_json(cls, x: Dict[str, Any]) -> ApiModel:
        """Deserializes an API model object from a Python object (direct result of `json.load()`)

        Parameters
        ----------
        x : Dict[str, Any]
            Serialized JSON object data, pre-loaded into a Python object

        Returns
        -------
        ApiModel
            The resulting API model object.
        """
        raise NotImplementedError()

    def to_json(self) -> Dict[str, Any]:
        """Serializes the API model into a Python object (that can be forwarded to `json.dump()`)

        Returns
        -------
        Dict[str, Any]
            The serialized data as a Python object.
        """
        raise NotImplementedError()

    def validate(self) -> None:
        """Validates the API model object.

        This method is intended to be used for checking invariants and contraints of the model object,
        but not type checking. Type checking should be implemented in the `from_json()` method.

        If this method is not reimplemented in the derived class, there will be no validation performed
        and objects will allways be considered valid.

        Validation error should be reported with an appropriate exception type.
        """
        pass