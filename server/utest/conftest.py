import pytest

from flask import Flask
from flask.testing import FlaskClient, FlaskCliRunner

from app.app import create_app

App = Flask
AppClient = FlaskClient
AppCliRunner = FlaskCliRunner

@pytest.fixture(scope="session")
def app() -> App:
    app = create_app("unit test")
    app.app.config.update({
        "TESTING": True,
    })

    yield app

@pytest.fixture(scope="session")
def app_client(app: App) -> AppClient:
    return app.app.test_client()

@pytest.fixture()
def app_cli_runner(app: App) -> AppCliRunner:
    return app.app.test_cli_runner()