from manito.core import objects_equal
from data_service.model import WalletApiModel

from itest.factory import DummyFactory
from itest.utils import (
    create_app_client,
    create_auto_auth_client,
    create_db_connection,
    purge_database,
)


class TestWallet:
    @classmethod
    def setup_class(cls):
        cls.db_connection = create_db_connection()
        cls.original_app_client = create_app_client()

    def setup_method(self, method: str):
        purge_database(self.db_connection)
        self.dummy_factory = DummyFactory(self.db_connection)
        self.user_id = self.dummy_factory.create_user()
        self.jwt = self.dummy_factory.get_user_jwt(self.user_id)
        self.app_client = create_auto_auth_client(self.original_app_client, user_id=self.user_id)

        self.main_wallet_id = self.dummy_factory.create_dummy_wallet(
            owner_id=self.user_id,
            name="My Awesome Wallet",
        )

    def test_cannot_get_user_wallets_for_nonexisting_user(self) -> None:
        r = self.app_client.get("/user/666/wallets")
        assert r.status_code in [404]

    def test_can_get_user_wallets(self) -> None:
        r = self.app_client.get(f"/user/{self.user_id}/wallets")
        assert r.status_code in [200]

        wallets = r.json
        assert len(wallets) == 1
        assert wallets[0]["id"] == self.main_wallet_id
        assert wallets[0]["name"] == "My Awesome Wallet"

    def test_can_create_wallet(self) -> None:
        data = WalletApiModel(
            name = "TestWallet",
            owner_id=self.user_id,
        )
        payload = data.to_json()
        r = self.app_client.post("/wallet/create", json=payload)

        assert r.status_code in [200]
        new_wallet = WalletApiModel.from_json(r.json)
        assert objects_equal(new_wallet, data, exclude=["id", "creator", "created_at"])
        assert new_wallet.id is not None
        assert new_wallet.created_at is not None

    def test_create_wallet_should_fail_on_invalid_name(self) -> None:
        payload = WalletApiModel(name="", owner_id=self.user_id).to_json()
        r = self.app_client.post("/wallet/create", json=payload)
        assert r.status_code in [400], "Request should be rejected if name is empty"

    def test_create_wallet_should_fail_on_invalid_owner(self) -> None:
        payload = WalletApiModel(name="TestWallet", owner_id=None).to_json()
        r = self.app_client.post("/wallet/create", json=payload)
        assert r.status_code in [400], "Request should be rejected if owner is empty"

    def test_cannot_get_wallet_details_for_nonexisting_wallet(self) -> None:
        r = self.app_client.get("/wallet/666")
        assert r.status_code in [404]

    def test_can_get_wallet_details(self) -> None:
        r = self.app_client.get(f"/wallet/{self.main_wallet_id}")
        assert r.status_code in [200]

        wallet = r.json
        assert wallet["id"] == self.main_wallet_id
        assert wallet["name"] == "My Awesome Wallet"

    def test_cannot_edit_nonexisting_wallet(self) -> None:
        payload = {
            "name": "Bad Mofo",
            "ownerId": self.user_id,
        }
        r = self.app_client.patch("/wallet/666", json=payload)
        assert r.status_code in [404]

    def test_can_edit_wallet(self) -> None:
        payload = {
            "name": "Bad Mofo",
            "ownerId": self.user_id,
        }
        r = self.app_client.patch(f"/wallet/{self.main_wallet_id}", json=payload)
        assert r.status_code in [200]

        r = self.app_client.get(f"/wallet/{self.main_wallet_id}")
        assert r.status_code in [200]

        wallet = r.json
        assert wallet["id"] == self.main_wallet_id
        assert wallet["name"] == payload["name"]
        assert wallet["ownerId"] == payload["ownerId"]

    def test_cannot_delete_nonexisting_wallet(self) -> None:
        r = self.app_client.delete("/wallet/666")
        assert r.status_code in [404]

    def test_can_delete_existing_wallet(self) -> None:
        wallet_id = self.dummy_factory.create_dummy_wallet(owner_id=self.user_id)

        r = self.app_client.delete(f"/wallet/{wallet_id}")
        assert r.status_code == 204

    def test_wallet_delete_is_idempotent(self) -> None:
        wallet_id = self.dummy_factory.create_dummy_wallet(owner_id=self.user_id)

        r = self.app_client.delete(f"/wallet/{wallet_id}")
        assert r.status_code == 204

        r = self.app_client.delete(f"/wallet/{wallet_id}")
        assert r.status_code == 204

    def test_deleted_wallet_is_no_longer_accessible(self) -> None:
        wallet_id = self.dummy_factory.create_dummy_wallet(owner_id=self.user_id)

        r = self.app_client.get(f"/wallet/{wallet_id}")
        assert r.status_code == 200

        r = self.app_client.delete(f"/wallet/{wallet_id}")
        assert r.status_code == 204

        r = self.app_client.get(f"/wallet/{wallet_id}")
        assert r.status_code == 404, "Deleted wallet should not be accessible anymore"

    def test_deleted_wallet_is_no_longer_listed(self) -> None:
        wallet_id = self.dummy_factory.create_dummy_wallet(owner_id=self.user_id)

        r = self.app_client.get(f"/user/{self.user_id}/wallets")
        assert r.status_code == 200

        r = self.app_client.delete(f"/wallet/{wallet_id}")
        assert r.status_code == 204

        r = self.app_client.get(f"/user/{self.user_id}/wallets")
        assert r.status_code == 200
        assert wallet_id not in [w["id"] for w in r.json]
