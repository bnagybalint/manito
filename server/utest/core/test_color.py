import pytest

from dataclasses import dataclass
from typing import List

from core import Color, ColorFormat


@dataclass
class ColorTestSpec:
    color: Color
    str_hex: str
    str_html: str

TEST_COLOR_SPECS: List[ColorTestSpec] = [
    ColorTestSpec(color=Color(0,0,0), str_hex="000000", str_html="#000000"),
    ColorTestSpec(color=Color(255,0,0), str_hex="ff0000", str_html="#ff0000"),
    ColorTestSpec(color=Color(0,255,0), str_hex="00ff00", str_html="#00ff00"),
    ColorTestSpec(color=Color(0,0,255), str_hex="0000ff", str_html="#0000ff"),
    ColorTestSpec(color=Color(255,255,255), str_hex="ffffff", str_html="#ffffff"),
    ColorTestSpec(color=Color(1,2,3), str_hex="010203", str_html="#010203"),
    ColorTestSpec(color=Color(50,100,200), str_hex="3264c8", str_html="#3264c8"),
]

@pytest.mark.parametrize("params", TEST_COLOR_SPECS)
def test_to_string_hex(params: ColorTestSpec) -> None:
    assert params.color.to_string(style=ColorFormat.HEX) == params.str_hex

@pytest.mark.parametrize("params", TEST_COLOR_SPECS)
def test_to_string_html(params: ColorTestSpec) -> None:
    assert params.color.to_string(style=ColorFormat.HTML) == params.str_html

def test_to_string_should_raise_on_invalid() -> None:
    with pytest.raises(Exception):
        Color(256,0,0).to_string()
    with pytest.raises(Exception):
        Color(0,256,0).to_string()
    with pytest.raises(Exception):
        Color(0,0,256).to_string()

    with pytest.raises(Exception):
        Color(-1,0,0).to_string()
    with pytest.raises(Exception):
        Color(0,-1,0).to_string()
    with pytest.raises(Exception):
        Color(0,0,-1).to_string()

@pytest.mark.parametrize("params", TEST_COLOR_SPECS)
def test_parse_from_hex_string(params: ColorTestSpec) -> None:
    assert Color.parse(params.str_hex, style=ColorFormat.HEX) == params.color

@pytest.mark.parametrize("params", TEST_COLOR_SPECS)
def test_parse_from_html_string(params: ColorTestSpec) -> None:
    assert Color.parse(params.str_html, style=ColorFormat.HTML) == params.color

def test_parse_is_case_insensitive() -> None:
    assert Color.parse("abcdef", style=ColorFormat.HEX) == Color(171,205,239)
    assert Color.parse("ABCDEF", style=ColorFormat.HEX) == Color(171,205,239)
    assert Color.parse("aBcdEF", style=ColorFormat.HEX) == Color(171,205,239)

    assert Color.parse("#abcdef", style=ColorFormat.HTML) == Color(171,205,239)
    assert Color.parse("#ABCDEF", style=ColorFormat.HTML) == Color(171,205,239)
    assert Color.parse("#aBcdEF", style=ColorFormat.HTML) == Color(171,205,239)

def test_parse_should_raise_on_malformed() -> None:
    with pytest.raises(Exception):
        Color.parse("012345", style=ColorFormat.HTML)
    with pytest.raises(Exception):
        Color.parse("#012345", style=ColorFormat.HEX)

    with pytest.raises(Exception):
        Color.parse("123", style=ColorFormat.HEX)
    with pytest.raises(Exception):
        Color.parse("#123", style=ColorFormat.HTML)