import os
from pathlib import Path
from flask import Flask

app = Flask(__name__)

def read_version() -> str:
    with open(Path(__file__).parent / "VERSION") as fp:
        return fp.read()

MANITO_SERVER_VERSION = read_version()

@app.route("/version")
def get_version():
    return { "version": MANITO_SERVER_VERSION }