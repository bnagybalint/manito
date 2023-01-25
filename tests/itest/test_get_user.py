from manito.db import Connection
from itest.fixtures import db_connection, ensure_db_empty, app_client, AppClient
from itest.data import create_dummy_users


def test_nonexisting(
    app_client: AppClient,
    ensure_db_empty,
) -> None:
    r = app_client.get("/user/666")
    assert r.status_code in [404]

def test_existing(
    app_client: AppClient,
    ensure_db_empty,
    db_connection: Connection,
) -> None:
    with db_connection.create_session() as db:
        user = create_dummy_users(num_users=1)[0]
        db.add(user)
        db.commit()
        user_id = user.id


    r = app_client.get(f"/user/{user_id}")
    assert r.status_code in [200]

    user = r.json
    assert "name" in user