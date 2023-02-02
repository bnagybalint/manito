import datetime as dt

import pytest

from itest.utils import create_app_client


class TestAuthorization:
    @classmethod
    def setup_class(cls):
        cls.app_client = create_app_client()

    def get_status_code(self, method: str, endpoint: str, **kwargs) -> None:
        r = self.app_client.open(endpoint, method=method, **kwargs)
        return r.status_code

    # TODO enable after API authentication and authorization is implemented properly
    @pytest.mark.xfail(
        reason="This test is not properly implemented at the moment",
        raises=AssertionError,
    )
    def test_login_endpoint_is_unrestricted(self) -> None:
        assert 200 == self.get_status_code("POST", "/login")

    @pytest.mark.xfail(
        reason="This test is not properly implemented at the moment",
        raises=AssertionError,
    )
    def test_google_login_endpoint_is_unrestricted(self) -> None:
        assert 200 == self.get_status_code("POST", "/login/google")

    def test_version_endpoint_is_unrestricted(self) -> None:
        assert 200 == self.get_status_code("GET", "/version")

    def test_restricted_endpoints_require_login(self) -> None:
        id = 123456789

        assert 401 == self.get_status_code("GET", f"/users")
        assert 401 == self.get_status_code("GET", f"/user/{id}")
        assert 401 == self.get_status_code("GET", f"/user/{id}/wallets")
        assert 401 == self.get_status_code("GET", f"/user/{id}/categories")
        assert 401 == self.get_status_code("GET", f"/wallet/{id}")
        assert 401 == self.get_status_code("GET", f"/wallet/{id}/transactions")
        assert 401 == self.get_status_code("GET", f"/transaction/{id}")
        assert 401 == self.get_status_code("PATCH", f"/transaction/{id}")
        assert 401 == self.get_status_code("DELETE", f"/transaction/{id}")
        assert 401 == self.get_status_code("POST", f"/transaction/search", json={})
        assert 401 == self.get_status_code("POST", f"/transaction/create", json={"amount": 1, "time": dt.datetime.now().isoformat(), "categoryId": 1})
        assert 401 == self.get_status_code("POST", f"/category/create", json={"name": "X", "ownerId": 1, "iconId": 1, "iconColor": "#ffffff"})
        assert 401 == self.get_status_code("PATCH", f"/category/{id}")
        assert 401 == self.get_status_code("DELETE", f"/category/{id}")
        assert 401 == self.get_status_code("POST", f"/category/merge", json={})
        assert 401 == self.get_status_code("GET", f"/icons")