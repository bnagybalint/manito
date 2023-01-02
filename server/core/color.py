from __future__ import annotations

import re

from typing import Dict
from dataclasses import dataclass
from enum import Enum, auto


class ColorFormat(Enum):
    HTML = auto() # '#RRGGBB'
    HEX = auto() # 'RRGGBB'

PARSE_PATTERNS: Dict[ColorFormat, str] = {
    ColorFormat.HEX: r"([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})",
    ColorFormat.HTML: r"#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})",
}

@dataclass
class Color:
    r: int
    g: int
    b: int

    def __repr__(self) -> str:
        return f"Color({self.r}, {self.b}, {self.b})"

    def to_string(self, style: ColorFormat = ColorFormat.HTML) -> str:
        if self.r < 0 or self.g < 0 or self.b < 0 or self.r > 255 or self.g > 255 or self.b > 255:
            raise ValueError(f"Color values must be between 0 and 255")
        return self._to_string_unchecked(style=style)

    def _to_string_unchecked(self, style: ColorFormat) -> str:
        if style == ColorFormat.HEX:
            return f"{self.r:02x}{self.g:02x}{self.b:02x}"
        if style == ColorFormat.HTML:
            str_hex = self._to_string_unchecked(style=ColorFormat.HEX)
            return f"#{str_hex}"

    @staticmethod
    def parse(s: str, style: ColorFormat = ColorFormat.HTML) -> Color:
        pattern = PARSE_PATTERNS[style]
        r = re.match(pattern, s.lower())
        if not r:
            raise ValueError(f"Malformed color string: {s}")
        
        return Color(
            r=int(r.group(1), base=16),
            g=int(r.group(2), base=16),
            b=int(r.group(3), base=16),
        )
