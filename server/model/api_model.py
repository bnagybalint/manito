from __future__ import annotations

from typing import Dict, Any

class ApiModel:
    @classmethod
    def from_json(cls, x: Dict[str, Any]) -> ApiModel:
        raise NotImplementedError()

    def to_json(self) -> Dict[str, Any]:
        raise NotImplementedError()
