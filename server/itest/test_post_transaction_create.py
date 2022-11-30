import datetime as dt

from typing import Tuple

from core.compare import objects_equal
from db.entities import User, Wallet
from db.connection import Connection
from model.transaction import TransactionApiModel
from itest.fixtures import db_connection, ensure_db_empty, app_client, AppClient


SERVER_ASSIGNED_FIELDS = ["id", "creator", "created_at"]

def setup_db(db_connection: Connection) -> Tuple[int, int]:
    """Sets up DB data for this test.

    Returns
    -------
    Tuple[int, int]
        ID of the bank account and the savings account in the database
    """
    with db_connection.create_session() as db:
        user = User(name="Some Body", email="s{i}@b.com", password_hash="abcdef")
        bank_wallet = Wallet(name="Bank account", creator=user, owner=user)
        savings_wallet = Wallet(name="Savings account", creator=user, owner=user)
        db.add_all([user, bank_wallet, savings_wallet])
        db.commit()
        return (bank_wallet.id, savings_wallet.id)

def test_create_income(
    app_client: AppClient,
    ensure_db_empty,
    db_connection: Connection,
) -> None:
    bank_wallet_id, _ = setup_db(db_connection)

    data = TransactionApiModel(
        amount=1000,
        time=dt.datetime.now(),
        src_wallet_id=bank_wallet_id
    )
    payload = data.to_json()
    r = app_client.post("/transaction/create", json=payload)

    assert r.status_code in [200]
    new_transaction = TransactionApiModel.from_json(r.json)
    assert objects_equal(new_transaction, data, exclude=SERVER_ASSIGNED_FIELDS)
    assert new_transaction.id is not None
    assert new_transaction.created_at is not None

def test_create_spending(
    app_client: AppClient,
    ensure_db_empty,
    db_connection: Connection,
) -> None:
    bank_wallet_id, _ = setup_db(db_connection)

    data = TransactionApiModel(
        amount=1000,
        time=dt.datetime.now(),
        dst_wallet_id=bank_wallet_id
    )
    payload = data.to_json()
    r = app_client.post("/transaction/create", json=payload)

    assert r.status_code in [200]
    new_transaction = TransactionApiModel.from_json(r.json)
    assert objects_equal(new_transaction, data, exclude=SERVER_ASSIGNED_FIELDS)
    assert new_transaction.id is not None
    assert new_transaction.created_at is not None

def test_create_transfer(
    app_client: AppClient,
    ensure_db_empty,
    db_connection: Connection,
) -> None:
    bank_wallet_id, savings_wallet_id = setup_db(db_connection)

    data = TransactionApiModel(
        amount=1000,
        time=dt.datetime.now(),
        src_wallet_id=bank_wallet_id,
        dst_wallet_id=savings_wallet_id,
    )
    payload = data.to_json()
    r = app_client.post("/transaction/create", json=payload)

    assert r.status_code in [200]
    new_transaction = TransactionApiModel.from_json(r.json)
    assert objects_equal(new_transaction, data, exclude=SERVER_ASSIGNED_FIELDS)
    assert new_transaction.id is not None
    assert new_transaction.created_at is not None

def test_create_with_notes(
    app_client: AppClient,
    ensure_db_empty,
    db_connection: Connection,
) -> None:
    bank_wallet_id, _ = setup_db(db_connection)

    data = TransactionApiModel(
        amount=1000,
        time=dt.datetime.now(),
        src_wallet_id=bank_wallet_id,
        notes="Groceries",
    )
    payload = data.to_json()
    r = app_client.post("/transaction/create", json=payload)

    assert r.status_code in [200]
    new_transaction = TransactionApiModel.from_json(r.json)
    assert objects_equal(new_transaction, data, exclude=SERVER_ASSIGNED_FIELDS)
    assert new_transaction.id is not None
    assert new_transaction.created_at is not None

def test_should_fail_when_wallet_is_missing(
    app_client: AppClient,
    ensure_db_empty,
    db_connection: Connection,
) -> None:
    bank_wallet_id, _ = setup_db(db_connection)

    data = TransactionApiModel(
        amount=1000,
        time=dt.datetime.now(),
        # src_wallet_id=bank_wallet_id, # intentionally omitted
    )
    payload = data.to_json()
    r = app_client.post("/transaction/create", json=payload)

    assert r.status_code in [400], "Request should be rejected if not wallet was defined"

def test_should_fail_when_transferring_to_the_same_wallet(
    app_client: AppClient,
    ensure_db_empty,
    db_connection: Connection,
) -> None:
    bank_wallet_id, _ = setup_db(db_connection)

    data = TransactionApiModel(
        amount=1000,
        time=dt.datetime.now(),
        src_wallet_id=bank_wallet_id,
        dst_wallet_id=bank_wallet_id,
    )
    payload = data.to_json()
    r = app_client.post("/transaction/create", json=payload)

    assert r.status_code in [400], "Request should be rejected if the source and destination wallets are the same"

def test_should_fail_on_invalid_amount(
    app_client: AppClient,
    ensure_db_empty,
    db_connection: Connection,
) -> None:
    bank_wallet_id, _ = setup_db(db_connection)

    data = TransactionApiModel(
        amount=-666,
        time=dt.datetime.now(),
        src_wallet_id=bank_wallet_id,
    )
    payload = data.to_json()
    r = app_client.post("/transaction/create", json=payload)

    assert r.status_code in [400], "Request should be rejected if amount is invalid"
