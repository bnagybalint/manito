import os
from pathlib import Path
from flask import Flask

from app.app import create_app

app = create_app(name=__name__)

app.run(port=5000)