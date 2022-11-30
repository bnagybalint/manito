from core.compare import objects_equal
from db.entities import User
from db.connection import Connection
from model.category import CategoryApiModel
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
        db.add(user)
        db.commit()
        return user.id

def test_can_create_category(
    app_client: AppClient,
    ensure_db_empty,
    db_connection: Connection,
) -> None:
    user_id = setup_db(db_connection)

    data = CategoryApiModel(
        name = "TestCategory",
        owner_id=user_id,
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
    user_id = setup_db(db_connection)

    payload = CategoryApiModel(name="", owner_id=user_id).to_json()
    r = app_client.post("/category/create", json=payload)
    assert r.status_code in [400], "Request should be rejected if name is empty"

def test_should_fail_on_invalid_owner(
    app_client: AppClient,
    ensure_db_empty,
) -> None:
    payload = CategoryApiModel(name="TestCategory", owner_id=None).to_json()
    r = app_client.post("/category/create", json=payload)
    assert r.status_code in [400], "Request should be rejected if owner is empty"

