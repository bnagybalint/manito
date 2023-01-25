from manito.db import Connection
from itest.fixtures import db_connection, ensure_db_empty, app_client, AppClient
from itest.data import create_dummy_users

def test_empty_db(
    app_client: AppClient,
    ensure_db_empty,
) -> None:
    r = app_client.get("/users")
    assert r.status_code in [200]

    users = r.json
    assert len(users) == 0

def test_simple(
    app_client: AppClient,
    ensure_db_empty,
    db_connection: Connection,
) -> None:
    with db_connection.create_session() as db:
        db.add_all(create_dummy_users(num_users=1))
        db.commit()

    r = app_client.get("/users")
    assert r.status_code in [200]

    users = r.json
    assert len(users) == 1
    assert "name" in users[0]