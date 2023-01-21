from pathlib import Path
from model import ApiResponse


def _read_version() -> str:
    with open(Path(__file__).parent.parent / "VERSION") as fp:
        return fp.read()

MANITO_SERVER_VERSION = _read_version()

def get_version() -> ApiResponse:
    return { "version": MANITO_SERVER_VERSION }, 200
