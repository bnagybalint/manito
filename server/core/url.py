from __future__ import annotations

from typing import Dict

FIELDS_CONSIDERED_AS_MISSING = [None, ""]

class URL:
    def __init__(self,
        scheme: str = None,
        username: str = None,
        password: str = None,
        host: str = None,
        port: int = None,
        path: str = None,
        query: Dict[str,str] = None,
    ) -> None:
        self.scheme = scheme
        self.username = username
        self.password = password
        self.host = host
        self.port = port
        self.path = path
        self.query = query

    def validate(self) -> bool:
        if self.scheme in FIELDS_CONSIDERED_AS_MISSING:
            raise RuntimeError("URL scheme is missing")
        if self.host in FIELDS_CONSIDERED_AS_MISSING:
            raise RuntimeError("URL host address is missing")
        if self.password not in FIELDS_CONSIDERED_AS_MISSING and self.username in FIELDS_CONSIDERED_AS_MISSING:
            raise RuntimeError("URL password cannot be specified if username is missing")

        if self.scheme.endswith("://"):
            raise RuntimeError("URL scheme should not contain the end separator '://'")
        if self.host.endswith("/"):
            raise RuntimeError("URL host should not contain the end separator '/'")

    @staticmethod
    def parse() -> URL:
        return URL()

    def __str__(self) -> str:
        self.validate()

        scheme = self._prepare_scheme()
        host = self._prepare_host()
        
        url = host
        if self.port is not None:
            port = self._prepare_port()
            url = f"{url}:{port}"

        if self.username is not None and self.username != "":
            username = self._prepare_username()
            auth = f"{username}"
            if self.password is not None and self.password != "":
                password = self._prepare_password()
                auth = f"{auth}:{password}"
            url = f"{auth}@{url}"
        
        url = f"{scheme}://{url}"

        if self.path is not None and self.path != "":
            path = self._prepare_path()
            url = f"{url}/{path}"

        if self.query is not None and self.query != {}:
            query = self._prepare_query()
            url = f"{url}?{query}"

        return url

    def _prepare_scheme(self) -> str:
        return self.scheme
    def _prepare_host(self) -> str:
        return self.host
    def _prepare_port(self) -> str:
        return str(self.port)
    def _prepare_username(self) -> str:
        return self.username
    def _prepare_password(self) -> str:
        return self.password
    def _prepare_path(self) -> str:
        return self.path
    def _prepare_query(self) -> str:
        return "&".join([f"{k}={v}" for k,v in self.query.items()])