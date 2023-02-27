from manito.core import Color, objects_equal
from data_service.model.category import CategoryApiModel

from itest.factory import DummyFactory
from itest.utils import (
    create_app_client,
    create_auto_auth_client,
    create_db_connection,
    purge_database,
)


SERVER_ASSIGNED_FIELDS = ["id", "creator", "created_at"]

class TestCategory:
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

        self.icon_id = self.dummy_factory.create_dummy_icon()

    def test_can_create_category(self) -> None:
        data = CategoryApiModel(
            name = "TestCategory",
            owner_id=self.user_id,
            icon_id=self.icon_id,
            icon_color=Color(255,0,0)
        )
        payload = data.to_json()
        r = self.app_client.post("/category/create", json=payload)

        assert r.status_code in [200]
        new_category = CategoryApiModel.from_json(r.json)
        assert objects_equal(new_category, data, exclude=SERVER_ASSIGNED_FIELDS)
        assert new_category.id is not None
        assert new_category.created_at is not None

    def test_create_category_should_fail_on_invalid_name(self) -> None:
        data = CategoryApiModel(
            name="",
            owner_id=self.user_id,
            icon_id=self.icon_id,
            icon_color=Color(255,0,0)
        )
        payload = data.to_json()
        r = self.app_client.post("/category/create", json=payload)
        assert r.status_code in [400], "Request should be rejected if name is empty"

    def test_create_category_should_fail_on_invalid_owner(self) -> None:
        data = CategoryApiModel(
            name="TestCategory",
            owner_id=None,
            icon_id=self.icon_id,
            icon_color=Color(255,0,0)
        )
        payload = data.to_json()
        r = self.app_client.post("/category/create", json=payload)
        assert r.status_code in [400], "Request should be rejected if owner is empty"

    def test_create_category_should_fail_on_nonexistent_icon(self) -> None:
        data = CategoryApiModel(
            name="TestCategory",
            owner_id=self.user_id,
            icon_id=6666666,
            icon_color=Color(255,0,0)
        )
        payload = data.to_json()
        r = self.app_client.post("/category/create", json=payload)
        assert r.status_code in [400], "Request should be rejected if icon does not exist"

    def test_create_category_should_fail_on_invalid_icon_color(self) -> None:
        data = CategoryApiModel(
            name="TestCategory",
            owner_id=self.user_id,
            icon_id=self.icon_id,
            icon_color=Color(255,0,0)
        )
        payload = data.to_json()
        payload["iconColor"] = "123efg" # forcing an invalid hex

        r = self.app_client.post("/category/create", json=payload)
        assert r.status_code in [400], "Request should be rejected if icon color is invalid"


    def test_cannot_delete_nonexisting_category(self) -> None:
        r = self.app_client.delete("/category/666")
        assert r.status_code in [404]

    def test_can_delete_existing_category(self) -> None:
        category_id = self.dummy_factory.create_dummy_category(owner_id=self.user_id, icon_id=self.icon_id)

        r = self.app_client.delete(f"/category/{category_id}")
        assert r.status_code == 204

    def test_category_delete_is_idempotent(self) -> None:
        category_id = self.dummy_factory.create_dummy_category(owner_id=self.user_id, icon_id=self.icon_id)

        r = self.app_client.delete(f"/category/{category_id}")
        assert r.status_code == 204

        r = self.app_client.delete(f"/category/{category_id}")
        assert r.status_code == 204

    def test_deleted_category_is_no_longer_returned_in_user_categories(self) -> None:
        category_id = self.dummy_factory.create_dummy_category(owner_id=self.user_id, icon_id=self.icon_id)

        r = self.app_client.get(f"/user/{self.user_id}/categories")
        assert r.status_code == 200
        assert len(r.json) == 1

        r = self.app_client.delete(f"/category/{category_id}")
        assert r.status_code == 204

        r = self.app_client.get(f"/user/{self.user_id}/categories")
        assert r.status_code == 200
        assert len(r.json) == 0, "Deleted category should not be returned"