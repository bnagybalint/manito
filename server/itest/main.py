import sys
import os
import pytest

from argparse import ArgumentParser
from pathlib import Path

from core import ConfigLoader, Config

if __name__ == "__main__":
    parser = ArgumentParser()
    parser.add_argument("config_file_path", help="Path to the config file of the server")

    args = parser.parse_args()
    config_file_path = Path(args.config_file_path).resolve()

    config: Config = ConfigLoader.load(config_file_path)
    db_secrets: Config = ConfigLoader.load(Path(config_file_path).parent / Path(config["db"]["secrets"]))

    os.environ["DB_HOST"] = str(config["db"]["host"])
    os.environ["DB_PORT"] = str(config["db"]["port"])
    os.environ["DB_DATABASE_NAME"] = str(config["db"]["database_name"])
    os.environ["DB_USERNAME"] = str(db_secrets["db"]["username"])
    os.environ["DB_PASSWORD"] = str(db_secrets["db"]["password"])
    
    pytest_args = [
        Path(__file__).parent,
    ]

    pytest.main(pytest_args)