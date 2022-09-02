import datetime as dt

from db.entities import User
from db.connection import Connection
from itest.fixtures import db_connection, ensure_db_empty, app_client, AppClient

def test_nonexistent(
    app_client: AppClient,
    ensure_db_empty,
) -> None:
    r = app_client.get("/user/666")
    assert r.status_code in [404]

def test_single(
    app_client: AppClient,
    ensure_db_empty,
    db_connection: Connection,
) -> None:
    with db_connection.create_session() as db:
        user = User(
            name="Some Body",
            email="s@b.com",
            created_at=dt.datetime.now(),
            password_hash="abcdef"
        )
        db.add(user)
        
        db.flush()
        new_user_id = user.id
        
        db.commit()


    r = app_client.get(f"/user/{new_user_id}")
    assert r.status_code in [200]

    user = r.json
    assert user["name"] == "Some Body"