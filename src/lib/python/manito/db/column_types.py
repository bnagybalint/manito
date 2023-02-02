from typing import Any
from sqlalchemy import TypeDecorator
from sqlalchemy.types import String

from manito.core import Color, ColorFormat


class ColorColumn(TypeDecorator):
    impl = String

    # cache_ok = True

    def __init__(self, format: ColorFormat = ColorFormat.HEX) -> None:
        self.format = format

    def process_bind_param(self, value: Color, dialect: Any):
        return value.to_string(style=self.format)

    def process_result_value(self, value: str, dialect: Any):
        return Color.parse(value, style=self.format)
