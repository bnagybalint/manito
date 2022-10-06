import datetime as dt
import urllib.parse

from typing import Any, Dict, Tuple

from db.entities import User, Wallet, Transaction
from db.connection import Connection
from model.transaction_search_params import TransactionSearchParamsApiModel
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
                amount=5432,
                dst_wallet=bank_wallet,
                creator=user,
            ),
            Transaction(
                time=dt.datetime.fromisoformat("2022-08-12T19:45:15"),
                description="Groceries",
                amount=13.51,
                src_wallet=bank_wallet,
                creator=user,
            ),
            Transaction(
                time=dt.datetime.fromisoformat("2022-08-31T12:30:00"),
                description="Transfer savings",
                amount=1500,
                src_wallet=bank_wallet,
                dst_wallet=savings_wallet,
                creator=user,
            ),
        ]
        db.add_all([user, bank_wallet, savings_wallet, *transactions])
        db.commit()
        return (bank_wallet.id, savings_wallet.id)

def test(
    app_client: AppClient,
    ensure_db_empty,
    db_connection: Connection,
) -> None:
    bank_wallet_id, savings_wallet_id = setup_db(db_connection)

    def check(sp: TransactionSearchParamsApiModel, expected_count: int, message: str = ""):
        payload = sp.to_json()
        r = app_client.post(f"/transactions/search", json=payload)
        transactions = r.json
        assert len(transactions) == expected_count, message

    M = TransactionSearchParamsApiModel

    check(M(), expected_count=3, message="Empty search matches everything")

    check(M(start_date=dt.date.fromisoformat("2022-08-01")), expected_count=3)
    check(M(start_date=dt.date.fromisoformat("2022-08-08")), expected_count=3)
    check(M(start_date=dt.date.fromisoformat("2022-08-09")), expected_count=2)
    check(M(start_date=dt.date.fromisoformat("2022-08-31")), expected_count=1)
    check(M(start_date=dt.date.fromisoformat("2022-09-01")), expected_count=0)

    check(M(end_date=dt.date.fromisoformat("2022-08-01")), expected_count=0)
    check(M(end_date=dt.date.fromisoformat("2022-08-08")), expected_count=1)
    check(M(end_date=dt.date.fromisoformat("2022-08-09")), expected_count=1)
    check(M(end_date=dt.date.fromisoformat("2022-08-31")), expected_count=3)
    check(M(end_date=dt.date.fromisoformat("2022-09-01")), expected_count=3)

    check(M(start_date=dt.date.fromisoformat("2022-08-01"), end_date=dt.date.fromisoformat("2022-09-01")), expected_count=3)
    check(M(start_date=dt.date.fromisoformat("2022-08-11"), end_date=dt.date.fromisoformat("2022-08-15")), expected_count=1)
    check(M(start_date=dt.date.fromisoformat("2022-08-11"), end_date=dt.date.fromisoformat("2022-10-01")), expected_count=2)
    check(M(start_date=dt.date.fromisoformat("2022-01-01"), end_date=dt.date.fromisoformat("2022-08-11")), expected_count=1)

    check(M(wallet_id=bank_wallet_id), expected_count=3)
    check(M(wallet_id=savings_wallet_id), expected_count=1)

    check(M(min_amount=0), expected_count=3)
    check(M(min_amount=20), expected_count=2)
    check(M(min_amount=20_000), expected_count=0)

    check(M(max_amount=0), expected_count=0)
    check(M(max_amount=20), expected_count=1)
    check(M(max_amount=20_000), expected_count=3)

    check(M(min_amount=1000, max_amount=2000), expected_count=1)

    check(M(search_string=""), expected_count=3, message="Empty search matches everything, even transactions without a note")
    check(M(search_string="Groceries"), expected_count=1)
    check(M(search_string="groceries"), expected_count=1, message="Search is case-insensitive")
    check(M(search_string="er"), expected_count=2, message="Search can match parts")