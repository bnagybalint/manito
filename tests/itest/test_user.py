from itest.factory import DummyFactory
from itest.utils import (
    create_app_client,
    create_auto_auth_client,
    create_db_connection,
    purge_database,
)


class TestUser:
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

    def test_can_list_users(self) -> None:
        r = self.app_client.get("/users")
        assert r.status_code in [200]
        users = r.json
        assert len(users) == 1
        assert users[0]["id"] == self.user_id

        self.dummy_factory.create_user(
            name="Its Me Mario",
            email="mario@brothers.inc",
        )
        r = self.app_client.get("/users")
        assert r.status_code in [200]
        users = r.json
        assert len(users) == 2

    def test_cannot_get_user_details_for_nonexisting(self) -> None:
        r = self.app_client.get("/user/666")
        assert r.status_code in [404]

    def test_can_get_user_details(self) -> None:
        r = self.app_client.get(f"/user/{self.user_id}")
        assert r.status_code in [200]

        user = r.json
        assert "name" in user

    def test_cannot_get_user_categories_for_nonexisting_user(self) -> None:
        r = self.app_client.get("/user/666/categories")
        assert r.status_code in [404]

    def test_can_get_user_categories(self) -> None:
        icon_id = self.dummy_factory.create_dummy_icon()
        category_id = self.dummy_factory.create_dummy_category(
            owner_id=self.user_id,
            icon_id=icon_id,
            name="Expendable 2",
        )

        r = self.app_client.get(f"/user/{self.user_id}/categories")
        assert r.status_code in [200]

        categories = r.json
        assert len(categories) == 1
        assert categories[0]["id"] == category_id
        assert categories[0]["name"] == "Expendable 2"

    def test_cannot_get_user_wallets_for_nonexisting_user(self) -> None:
        r = self.app_client.get("/user/666/wallets")
        assert r.status_code in [404]

    def test_can_get_user_wallets(self) -> None:
        wallet_id = self.dummy_factory.create_dummy_wallet(
            owner_id=self.user_id,
            name="My Awesome Wallet",
        )

        r = self.app_client.get(f"/user/{self.user_id}/wallets")
        assert r.status_code in [200]

        wallets = r.json
        assert len(wallets) == 1
        assert wallets[0]["id"] == wallet_id
        assert wallets[0]["name"] == "My Awesome Wallet"
