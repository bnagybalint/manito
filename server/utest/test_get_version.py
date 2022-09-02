from utest.fixtures import (
    AppClient,
    app_client,
)

def test_get_version(app_client: AppClient) -> None:
    r = app_client.get("/version")

    assert "version" in r.json