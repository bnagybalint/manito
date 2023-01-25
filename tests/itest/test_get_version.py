from itest.fixtures import (
    AppClient,
    app_client,
)

def test_get_version(app_client: AppClient) -> None:
    r = app_client.get("/version")
    assert r.status_code in [200]

    assert "version" in r.json