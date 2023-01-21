from manito.core.compare import objects_equal
from manito.db.entities import User
from manito.db import Connection
from data_service.model.wallet import WalletApiModel
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

def test_can_create_wallet(
    app_client: AppClient,
    ensure_db_empty,
    db_connection: Connection,
) -> None:
    user_id = setup_db(db_connection)

    data = WalletApiModel(
        name = "TestWallet",
        owner_id=user_id,
    )
    payload = data.to_json()
    r = app_client.post("/wallet/create", json=payload)

    assert r.status_code in [200]
    new_wallet = WalletApiModel.from_json(r.json)
    assert objects_equal(new_wallet, data, exclude=["id", "creator", "created_at"])
    assert new_wallet.id is not None
    assert new_wallet.created_at is not None

def test_should_fail_on_invalid_name(
    app_client: AppClient,
    ensure_db_empty,
    db_connection: Connection,
) -> None:
    user_id = setup_db(db_connection)

    payload = WalletApiModel(name="", owner_id=user_id).to_json()
    r = app_client.post("/wallet/create", json=payload)
    assert r.status_code in [400], "Request should be rejected if name is empty"

def test_should_fail_on_invalid_owner(
    app_client: AppClient,
    ensure_db_empty,
) -> None:
    payload = WalletApiModel(name="TestWallet", owner_id=None).to_json()
    r = app_client.post("/wallet/create", json=payload)
    assert r.status_code in [400], "Request should be rejected if owner is empty"

