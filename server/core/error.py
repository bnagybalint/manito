from dataclasses import dataclass

@dataclass
class ValidationError(Exception):
    error: str = None
    source: str = None

    def __str__(self) -> str:
        res = f"{self.error}"
        if self.source is not None:
            res += f" (source: {self.source})"
        return res