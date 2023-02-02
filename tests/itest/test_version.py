from itest.utils import create_app_client

class TestVersion:
    @classmethod
    def setup_class(cls):
        cls.app_client = create_app_client()

    def test_can_get_api_version(self) -> None:
        r = self.app_client.get("/version")
        assert r.status_code in [200]

        assert "version" in r.json