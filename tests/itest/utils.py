import os
import sqlalchemy

from flask import Flask
from flask.testing import FlaskClient, FlaskCliRunner

from manito.core import memoize
from manito.db import Connection, ConnectionManager, ConnectionParams
from data_service.server.app.app import create_app


App = Flask
AppClient = FlaskClient
AppCliRunner = FlaskCliRunner

@memoize
def create_app_instance() -> App:
    app = create_app(name="unit test")
    app.config.update({
        "TESTING": True,
    })

    return app

@memoize
def create_app_client() -> AppClient:
    return create_app_instance().test_client()

def create_auto_auth_client(app_client: AppClient, jwt: str) -> AppClient:
    class Wrapper(AppClient):
        def __init__(self, app_client: AppClient, jwt: str) -> None:
            self.app_client = app_client
            self.jwt = jwt
            self.extra_headers = {
                # "x-access-token": jwt,
                # "Authorization": f"Bearer {jwt}"
                "Authorization": f"Bearer {jwt}",
            }

        def _augment_kwargs(self, **kwargs):
            kwc = {**kwargs}
            kwc["headers"] = { **kwc.get("headers", {}), **self.extra_headers }
            return kwc

        def get(self, *args, **kwargs):
            return self.app_client.get(*args, **self._augment_kwargs(**kwargs))
        def delete(self, *args, **kwargs):
            return self.app_client.delete(*args, **self._augment_kwargs(**kwargs))
        def post(self, *args, **kwargs):
            return self.app_client.post(*args, **self._augment_kwargs(**kwargs))
        def patch(self, *args, **kwargs):
            return self.app_client.patch(*args, **self._augment_kwargs(**kwargs))

    return Wrapper(app_client, jwt)


@memoize
def _db_connection_params() -> ConnectionParams:
    try:
        db_host = os.environ["MANITO_DB_HOST"]
        db_port = int(os.environ["MANITO_DB_PORT"])
        db_database_name = os.environ["MANITO_DB_DATABASE_NAME"]
        db_username = os.environ["MANITO_DB_USERNAME"]
        db_password = os.environ["MANITO_DB_PASSWORD"]
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

def create_db_connection_manager() -> ConnectionManager:
    connection_manager = ConnectionManager()
    connection_manager.init(connection_params=_db_connection_params())
    return connection_manager

def create_db_connection() -> Connection:
    return create_db_connection_manager().create_connection()

def purge_database(db_connection: Connection) -> None:
    """Clears all data from the database, preserving the schema.

    Parameters
    ----------
    db_connection : Connection
        Database connection to use
    """
    with db_connection.create_session() as session:
        sql = sqlalchemy.text('''
            BEGIN;
            TRUNCATE TABLE "user" CASCADE;
            TRUNCATE TABLE "wallet" CASCADE;
            COMMIT;
        ''')

        session.execute(sql)