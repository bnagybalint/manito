from manito.db.entities import Wallet
from manito.db import Connection
from itest.fixtures import db_connection, ensure_db_empty, app_client, AppClient
from itest.data import create_dummy_users


def test_nonexisting(
    app_client: AppClient,
    ensure_db_empty,
) -> None:
    r = app_client.get("/wallet/666")
    assert r.status_code in [404]

def test_single(
    app_client: AppClient,
    ensure_db_empty,
    db_connection: Connection,
) -> None:
    with db_connection.create_session() as db:
        user = create_dummy_users(num_users=1)[0]
        wallet = Wallet(
            name="My Awesome Wallet",
            creator=user,
            owner=user,
        )
        db.add_all([user, wallet])
        db.commit()
        wallet_id = wallet.id

    r = app_client.get(f"/wallet/{wallet_id}")
    assert r.status_code in [200]

    wallet = r.json
    assert wallet["name"] == "My Awesome Wallet"
