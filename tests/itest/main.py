import sys
import os
import pytest

from argparse import ArgumentParser
from pathlib import Path

from manito.core import ConfigLoader, Config

if __name__ == "__main__":
    parser = ArgumentParser()
    parser.add_argument("config_file_path", help="Path to the config file of the server")

    args = parser.parse_args()
    config_file_path = Path(args.config_file_path).resolve()

    config: Config = ConfigLoader.load(config_file_path)
    db_secrets: Config = ConfigLoader.load(Path(config_file_path).parent / Path(config["db"]["secrets"]))
    jwt_secrets: Config = ConfigLoader.load(Path(config_file_path).parent / Path(config["jwt"]["secrets"]))

    os.environ["MANITO_DB_HOST"] = os.environ.get("MANITO_DB_HOST", str(config["db"]["host"]))
    os.environ["MANITO_DB_PORT"] = os.environ.get("MANITO_DB_PORT", str(config["db"]["port"]))
    os.environ["MANITO_DB_DATABASE_NAME"] = os.environ.get("MANITO_DB_DATABASE_NAME", str(config["db"]["database_name"]))
    os.environ["MANITO_DB_USERNAME"] = os.environ.get("MANITO_DB_USERNAME", str(db_secrets["db"]["username"]))
    os.environ["MANITO_DB_PASSWORD"] = os.environ.get("MANITO_DB_PASSWORD", str(db_secrets["db"]["password"]))
    os.environ["MANITO_JWT_SIGNING_KEY"] = os.environ.get("MANITO_JWT_SIGNING_KEY", str(jwt_secrets["jwt"]["key"]))
    
    pytest_args = [
        "--verbose",
        Path(__file__).parent,
    ]

    sys.exit(pytest.main(pytest_args))
