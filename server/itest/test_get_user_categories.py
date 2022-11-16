from db.entities import Category
from db.connection import Connection
from itest.fixtures import db_connection, ensure_db_empty, app_client, AppClient
from itest.data import create_dummy_users


def test_nonexisting(
    app_client: AppClient,
    ensure_db_empty,
) -> None:
    r = app_client.get("/user/666/categories")
    assert r.status_code in [404]

def test_single(
    app_client: AppClient,
    ensure_db_empty,
    db_connection: Connection,
) -> None:
    with db_connection.create_session() as db:
        user = create_dummy_users(num_users=1)[0]
        db.add(user)

        category = Category(
            name="Expendable 2",
            creator=user,
            owner=user,
        )
        db.add(category)
        db.commit()
        user_id = user.id

    r = app_client.get(f"/user/{user_id}/categories")
    assert r.status_code in [200]

    categories = r.json
    assert len(categories) == 1
    assert categories[0]["name"] == "Expendable 2"
