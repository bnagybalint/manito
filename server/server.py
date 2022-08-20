import os
from pathlib import Path
from flask import Flask

app = Flask(__name__, static_folder='app', static_url_path="/app")

def read_version() -> str:
    with open(Path(__file__).parent / "VERSION") as fp:
        return fp.read()

MANITO_SERVER_VERSION = read_version()

@app.route("/api/version")
def get_version():
    return { "version": MANITO_SERVER_VERSION }

@app.route('/app')
def spa():
    return app.send_static_file("public/index.html")