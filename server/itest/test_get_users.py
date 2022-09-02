import datetime as dt

from db.entities import User
from db.connection import Connection
from itest.fixtures import db_connection, ensure_db_empty, app_client, AppClient

def test_empty_db(
    app_client: AppClient,
    ensure_db_empty,
) -> None:
    r = app_client.get("/users")
    assert r.status_code in [200]

    users = r.json
    assert len(users) == 0

def test_single(
    app_client: AppClient,
    ensure_db_empty,
    db_connection: Connection,
) -> None:
    with db_connection.create_session() as db:
        db.add_all([
            User(
                name="Some Body",
                email="s@b.com",
                created_at=dt.datetime.now(),
                password_hash="abcdef"
            ),
        ])

        db.commit()

    r = app_client.get("/users")
    assert r.status_code in [200]

    users = r.json
    assert len(users) == 1
    assert users[0]["name"] == "Some Body"