import datetime as dt
import urllib.parse

from typing import Tuple

from manito.db.entities import User, Wallet, Transaction
from manito.db import Connection
from itest.fixtures import db_connection, ensure_db_empty, app_client, AppClient


def setup_db(db_connection: Connection) -> Tuple[int, int]:
    """Sets up DB data for this test.

    Creates a user with two wallets: a bank account and a savings account, with three transactions:
    - one incoming transaction to the bank account
    - one outgoing transaction from the bank account
    - one transfer from the bank account to the savings account

    Returns
    -------
    Tuple[int, int]
        ID of the bank account and the savings account in the database
    """
    with db_connection.create_session() as db:
        user = User(name="Some Body", email="s{i}@b.com", password_hash="abcdef")
        bank_wallet = Wallet(name="Bank account", creator=user, owner=user)
        savings_wallet = Wallet(name="Savings account", creator=user, owner=user)
        transactions = [
            Transaction(
                time=dt.datetime.fromisoformat("2022-08-08T13:20:00"),
                notes="Salary",
                amount=5432,
                dst_wallet=bank_wallet,
                creator=user,
            ),
            Transaction(
                time=dt.datetime.fromisoformat("2022-08-12T19:45:15"),
                notes="Groceries",
                amount=13.51,
                src_wallet=bank_wallet,
                creator=user,
            ),
            Transaction(
                time=dt.datetime.fromisoformat("2022-08-31T12:30:00"),
                notes="Transfer savings",
                amount=1500,
                src_wallet=bank_wallet,
                dst_wallet=savings_wallet,
                creator=user,
            ),
        ]
        db.add_all([user, bank_wallet, savings_wallet, *transactions])
        db.commit()
        return (bank_wallet.id, savings_wallet.id)

def test_nonexisting(
    app_client: AppClient,
    ensure_db_empty,
) -> None:
    r = app_client.get("/wallet/666/transactions")
    assert r.status_code in [404]

def test_simple(
    app_client: AppClient,
    ensure_db_empty,
    db_connection: Connection,
) -> None:
    bank_wallet_id, savings_wallet_id = setup_db(db_connection)

    r = app_client.get(f"/wallet/{bank_wallet_id}/transactions")
    assert r.status_code in [200]
    transactions = r.json
    assert len(transactions) == 3, "One incoming, one outgoing transaction and one transfer between wallets"

    r = app_client.get(f"/wallet/{savings_wallet_id}/transactions")
    assert r.status_code in [200]
    transactions = r.json
    assert len(transactions) == 1, "One incoming transaction"

def test_filtering(
    app_client: AppClient,
    ensure_db_empty,
    db_connection: Connection,
) -> None:
    bank_wallet_id, savings_wallet_id = setup_db(db_connection)

    def check(from_date: str, to_date: str, expected_count: int):
        params = {}
        if from_date is not None:
            params["from_date"] = from_date
        if to_date is not None:
            params["to_date"] = to_date

        query = urllib.parse.urlencode(params)
        r = app_client.get(f"/wallet/{bank_wallet_id}/transactions?{query}")
        transactions = r.json
        assert len(transactions) == expected_count

    check(from_date="2022-08-01", to_date=None, expected_count=3)
    check(from_date="2022-08-08", to_date=None, expected_count=3)
    check(from_date="2022-08-09", to_date=None, expected_count=2)
    check(from_date="2022-08-31", to_date=None, expected_count=1)
    check(from_date="2022-09-01", to_date=None, expected_count=0)

    check(from_date=None, to_date="2022-08-01", expected_count=0)
    check(from_date=None, to_date="2022-08-08", expected_count=1)
    check(from_date=None, to_date="2022-08-09", expected_count=1)
    check(from_date=None, to_date="2022-08-31", expected_count=3)
    check(from_date=None, to_date="2022-09-01", expected_count=3)

    check(from_date="2022-08-01", to_date="2022-08-31", expected_count=3)
    check(from_date="2022-07-30", to_date="2022-09-01", expected_count=3)
    check(from_date="2022-08-11", to_date="2022-08-15", expected_count=1)

    check(from_date="2022-08-11", to_date="2022-10-01", expected_count=2)
    check(from_date="2022-01-01", to_date="2022-08-11", expected_count=1)
