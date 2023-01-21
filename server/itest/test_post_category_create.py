from core.compare import objects_equal
from core import Color
from db.entities import (
    User,
    Icon,
)
from db.connection import Connection
from model import CategoryApiModel
from itest.fixtures import db_connection, ensure_db_empty, app_client, AppClient


def setup_db(db_connection: Connection) -> int:
    """Sets up DB data for this test.

    Returns
    -------
    int
        ID of the user
    """
    with db_connection.create_session() as db:
        user = User(name="Some Body", email="s{i}@b.com", password_hash="abcdef")
        icon = Icon(name="TestIcon", image_url="dummy")
        db.add_all([user, icon])
        db.commit()
        return user.id, icon.id

def test_can_create_category(
    app_client: AppClient,
    ensure_db_empty,
    db_connection: Connection,
) -> None:
    user_id, icon_id = setup_db(db_connection)

    data = CategoryApiModel(
        name = "TestCategory",
        owner_id=user_id,
        icon_id=icon_id,
        icon_color=Color(255,0,0)
    )
    payload = data.to_json()
    r = app_client.post("/category/create", json=payload)

    assert r.status_code in [200]
    new_category = CategoryApiModel.from_json(r.json)
    assert objects_equal(new_category, data, exclude=["id", "creator", "created_at"])
    assert new_category.id is not None
    assert new_category.created_at is not None

def test_should_fail_on_invalid_name(
    app_client: AppClient,
    ensure_db_empty,
    db_connection: Connection,
) -> None:
    user_id, icon_id = setup_db(db_connection)

    data = CategoryApiModel(
        name="",
        owner_id=user_id,
        icon_id=icon_id,
        icon_color=Color(255,0,0)
    )
    payload = data.to_json()
    r = app_client.post("/category/create", json=payload)
    assert r.status_code in [400], "Request should be rejected if name is empty"

def test_should_fail_on_invalid_owner(
    app_client: AppClient,
    ensure_db_empty,
    db_connection: Connection,
) -> None:
    _, icon_id = setup_db(db_connection)

    data = CategoryApiModel(
        name="TestCategory",
        owner_id=None,
        icon_id=icon_id,
        icon_color=Color(255,0,0)
    )
    payload = data.to_json()
    r = app_client.post("/category/create", json=payload)
    assert r.status_code in [400], "Request should be rejected if owner is empty"

def test_should_fail_on_nonexistent_icon(
    app_client: AppClient,
    ensure_db_empty,
    db_connection: Connection,
) -> None:
    user_id, _ = setup_db(db_connection)

    data = CategoryApiModel(
        name="TestCategory",
        owner_id=user_id,
        icon_id=6666666,
        icon_color=Color(255,0,0)
    )
    payload = data.to_json()
    r = app_client.post("/category/create", json=payload)
    assert r.status_code in [400], "Request should be rejected if icon does not exist"

def test_should_fail_on_invalid_icon_color(
    app_client: AppClient,
    ensure_db_empty,
    db_connection: Connection,
) -> None:
    user_id, icon_id = setup_db(db_connection)

    data = CategoryApiModel(
        name="TestCategory",
        owner_id=user_id,
        icon_id=icon_id,
        icon_color=Color(255,0,0)
    )
    payload = data.to_json()
    payload["iconColor"] = "123efg" # forcing an invalid hex

    r = app_client.post("/category/create", json=payload)
    assert r.status_code in [400], "Request should be rejected if icon color is invalid"

