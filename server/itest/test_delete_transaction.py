import datetime as dt

from db.entities import (
    Icon,
    Wallet,
    Category,
)
from db.connection import Connection
from itest.fixtures import db_connection, ensure_db_empty, app_client, AppClient
from itest.data import create_dummy_users
from model import (
    TransactionApiModel,
    TransactionSearchParamsApiModel,
)

def create_dummy_transaction(
    db_connection: Connection,
    app_client: AppClient
) -> int:
    with db_connection.create_session() as db:
        user = create_dummy_users(num_users=1)[0]
        db.add(user)

        wallet = Wallet(
            name="My Awesome Wallet",
            creator=user,
            owner=user,
        )
        icon = Icon(name="TestIcon", image_url="dummy")
        category = Category(
            name="Dummy Category",
            creator=user,
            owner=user,
            icon=icon,
            icon_color="ff0000",
        )
        db.add_all([wallet, category])
        db.commit()
        wallet_id = wallet.id
        category_id = category.id

    transaction = TransactionApiModel(
        amount=1000,
        time=dt.datetime.now(),
        src_wallet_id=wallet_id,
        category_id=category_id,
    )

    r = app_client.post("/transaction/create", json=transaction.to_json())
    assert r.status_code == 200
    new_transaction = TransactionApiModel.from_json(r.json)
    assert new_transaction.id is not None
    return new_transaction.id

def test_fails_to_delete_nonexisting(
    app_client: AppClient,
    ensure_db_empty,
) -> None:
    r = app_client.delete("/transaction/666")
    assert r.status_code in [404]

def test_can_delete_existing(
    app_client: AppClient,
    ensure_db_empty,
    db_connection: Connection,
) -> None:
    transaction_id = create_dummy_transaction(
        db_connection=db_connection,
        app_client=app_client
    )

    r = app_client.delete(f"/transaction/{transaction_id}")
    assert r.status_code == 204

def test_delete_is_idempotent(
    app_client: AppClient,
    ensure_db_empty,
    db_connection: Connection,
) -> None:
    transaction_id = create_dummy_transaction(
        db_connection=db_connection,
        app_client=app_client
    )

    r = app_client.delete(f"/transaction/{transaction_id}")
    assert r.status_code == 204

    r = app_client.delete(f"/transaction/{transaction_id}")
    assert r.status_code == 204

def test_deleted_transaction_is_no_longer_accessible_via_get(
    app_client: AppClient,
    ensure_db_empty,
    db_connection: Connection,
) -> None:
    transaction_id = create_dummy_transaction(
        db_connection=db_connection,
        app_client=app_client
    )

    r = app_client.get(f"/transaction/{transaction_id}")
    assert r.status_code == 200

    r = app_client.delete(f"/transaction/{transaction_id}")
    assert r.status_code == 204

    r = app_client.get(f"/transaction/{transaction_id}")
    assert r.status_code == 404, "Deleted transaction should not be accessible anymore"

def test_deleted_transaction_is_no_longer_returned_by_search(
    app_client: AppClient,
    ensure_db_empty,
    db_connection: Connection,
) -> None:
    transaction_id = create_dummy_transaction(
        db_connection=db_connection,
        app_client=app_client
    )

    params = TransactionSearchParamsApiModel()

    r = app_client.post(f"/transaction/search", json=params.to_json())
    assert r.status_code == 200
    assert len(r.json) == 1

    r = app_client.delete(f"/transaction/{transaction_id}")
    assert r.status_code == 204

    r = app_client.post(f"/transaction/search", json=params.to_json())
    assert r.status_code == 200
    assert len(r.json) == 0, "Deleted transaction should not be returned"
