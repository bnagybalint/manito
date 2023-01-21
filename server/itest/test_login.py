import pytest

from itest.fixtures import app_client, AppClient

def get_status_code(app_client: AppClient, method: str, endpoint: str) -> None:
    r = app_client.open(endpoint, method=method)
    return r.status_code

def test_login_endpoint_is_unrestricted(app_client: AppClient) -> None:
    assert 401 != get_status_code(app_client, "POST", "/login")
def test_version_endpoint_is_unrestricted(app_client: AppClient) -> None:
    assert 401 != get_status_code(app_client, "GET", "/version")


# TODO enable after API authentication and authorization is implemented properly
@pytest.mark.xfail(
    reason="API authentication is not required at the moment, thus these checks will fail",
    raises=AssertionError,
)
def test_restricted_endpoints_require_login(app_client: AppClient) -> None:

    id = 123456789

    assert 401 == get_status_code(app_client, "GET", f"/users")
    assert 401 == get_status_code(app_client, "GET", f"/user/{id}")
    assert 401 == get_status_code(app_client, "GET", f"/user/{id}/wallets")
    assert 401 == get_status_code(app_client, "GET", f"/user/{id}/categories")
    assert 401 == get_status_code(app_client, "GET", f"/wallet/{id}")
    assert 401 == get_status_code(app_client, "GET", f"/wallet/{id}/transactions")
    assert 401 == get_status_code(app_client, "GET", f"/transaction/{id}")
    assert 401 == get_status_code(app_client, "PATCH", f"/transaction/{id}")
    assert 401 == get_status_code(app_client, "DELETE", f"/transaction/{id}")
    assert 401 == get_status_code(app_client, "POST", f"/transaction/search")
    assert 401 == get_status_code(app_client, "POST", f"/transaction/create")
    assert 401 == get_status_code(app_client, "POST", f"/category/create")
    assert 401 == get_status_code(app_client, "GET", f"/category/{id}")
    assert 401 == get_status_code(app_client, "PATCH", f"/category/{id}")
    assert 401 == get_status_code(app_client, "DELETE", f"/category/{id}")
    assert 401 == get_status_code(app_client, "POST", f"/category/merge")
    assert 401 == get_status_code(app_client, "GET", f"/icons")