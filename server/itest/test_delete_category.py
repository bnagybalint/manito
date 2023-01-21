from typing import Tuple

from core.color import Color
from db.connection import Connection
from db.entities import Icon
from itest.fixtures import db_connection, ensure_db_empty, app_client, AppClient
from itest.data import create_dummy_users
from model import CategoryApiModel

def create_dummy_category(
    db_connection: Connection,
    app_client: AppClient
) -> Tuple[int, int]:
    with db_connection.create_session() as db:
        user = create_dummy_users(num_users=1)[0]
        icon = Icon(name="TestIcon", image_url="dummy")
        db.add(user)
        db.add(icon)
        db.commit()
        user_id = user.id
        icon_id = icon.id

    category = CategoryApiModel(
        name="Dummy",
        owner_id=user_id,
        icon_id=icon_id,
        icon_color=Color(255,0,0)
    )

    r = app_client.post("/category/create", json=category.to_json())
    assert r.status_code == 200
    new_category = CategoryApiModel.from_json(r.json)
    assert new_category.id is not None

    return new_category.id, user_id


def test_fails_to_delete_nonexisting(
    app_client: AppClient,
    ensure_db_empty,
) -> None:
    r = app_client.delete("/category/666")
    assert r.status_code in [404]

def test_can_delete_existing(
    app_client: AppClient,
    ensure_db_empty,
    db_connection: Connection,
) -> None:
    category_id, _ = create_dummy_category(
        db_connection=db_connection,
        app_client=app_client
    )

    r = app_client.delete(f"/category/{category_id}")
    assert r.status_code == 204

def test_delete_is_idempotent(
    app_client: AppClient,
    ensure_db_empty,
    db_connection: Connection,
) -> None:
    category_id, _ = create_dummy_category(
        db_connection=db_connection,
        app_client=app_client
    )

    r = app_client.delete(f"/category/{category_id}")
    assert r.status_code == 204

    r = app_client.delete(f"/category/{category_id}")
    assert r.status_code == 204

def test_deleted_category_is_no_longer_returned_in_user_categories(
    app_client: AppClient,
    ensure_db_empty,
    db_connection: Connection,
) -> None:
    category_id, user_id = create_dummy_category(
        db_connection=db_connection,
        app_client=app_client
    )

    r = app_client.get(f"/user/{user_id}/categories")
    assert r.status_code == 200
    assert len(r.json) == 1

    r = app_client.delete(f"/category/{category_id}")
    assert r.status_code == 204

    r = app_client.get(f"/user/{user_id}/categories")
    assert r.status_code == 200
    assert len(r.json) == 0, "Deleted category should not be returned"
