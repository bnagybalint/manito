import sqlalchemy
import sqlalchemy.orm

from dataclasses import dataclass
from manito.core import Singleton


@dataclass
class ConnectionParams:
    host: str
    port: int
    database_name: str
    username: str
    password: str
    protocol: str = "postgresql"

    @property
    def connection_string(self) -> str:
        # TODO URL sanitize parts
        return f"{self.protocol}://{self.username}:{self.password}@{self.host}:{self.port}/{self.database_name}"

    def __str__(self) -> str:
        return f"{self.protocol}://{self.username}:SECRET@{self.host}:{self.port}/{self.database_name}"


class Connection:
    def __init__(self, connection_params: ConnectionParams) -> None:
        connection_string = connection_params.connection_string
        self.engine = sqlalchemy.create_engine(connection_string)

    def create_session(self) -> sqlalchemy.orm.Session:
        """Creates a new ORM session, using this Connection's database engine object.
        Can be used as a context manager with the same semantics as SQLAlchemy's ORM Session class.

        Returns
        -------
        sqlalchemy.orm.Session
            The ORM session
        """
        return sqlalchemy.orm.Session(self.engine)


class ConnectionManager(metaclass=Singleton):
    def __init__(self) -> None:
        self.connection_params = None

    def init(self, connection_params: ConnectionParams) -> None:
        self.connection_params = connection_params

    def create_connection(self) -> Connection:
        if self.connection_params is None:
            raise RuntimeError("Connection pool is uninitialized!")

        return Connection(connection_params=self.connection_params)