import logging
import os
import pytest
import sqlalchemy
import sqlalchemy.orm

from flask import Flask
from flask.testing import FlaskClient, FlaskCliRunner

from app.app import create_app
from db.connection import ConnectionManager, ConnectionParams, Connection

App = Flask
AppClient = FlaskClient
AppCliRunner = FlaskCliRunner

@pytest.fixture(scope="session")
def app() -> App:
    app = create_app(name="unit test")
    app.config.update({
        "TESTING": True,
    })

    yield app

@pytest.fixture(scope="session")
def app_client(app: App) -> AppClient:
    return app.test_client()

@pytest.fixture(scope="session")
def app_cli_runner(app: App) -> AppCliRunner:
    return app.test_cli_runner()

@pytest.fixture(scope="session")
def db_connection_params() -> ConnectionParams:
    try:
        db_host = os.environ["DB_HOST"]
        db_port = int(os.environ["DB_PORT"])
        db_database_name = os.environ["DB_DATABASE_NAME"]
        db_username = os.environ["DB_USERNAME"]
        db_password = os.environ["DB_PASSWORD"]
    except KeyError as e:
        raise RuntimeError(f"Required env var missing: {e}")
    except Exception as e:
        raise RuntimeError(f"Error when loading DB params from env vars: {e}")

    return ConnectionParams(
        database_name=db_database_name,
        host=db_host,
        port=db_port,
        username=db_username,
        password=db_password,
    )

@pytest.fixture(scope="session")
def db_connection_manager(db_connection_params: ConnectionParams) -> ConnectionManager:
    connection_manager = ConnectionManager()
    connection_manager.init(connection_params=db_connection_params)
    return connection_manager

@pytest.fixture(scope="function")
def db_connection(db_connection_manager: ConnectionManager) -> Connection:
    return db_connection_manager.create_connection()

@pytest.fixture(scope="function")
def ensure_db_empty(db_connection: Connection) -> None:
    with db_connection.create_session() as session:
        sql = sqlalchemy.text('''
            BEGIN;
            TRUNCATE TABLE "user" CASCADE;
            TRUNCATE TABLE "wallet" CASCADE;
            COMMIT;
        ''')

        session.execute(sql)

    yield
