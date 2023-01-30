import os
import sys

from pathlib import Path
from argparse import ArgumentParser
from flask import Flask

from app.app import create_app
from manito.db import ConnectionManager, ConnectionParams
from manito.core import Config, ConfigLoader

def parse_args():
    parser = ArgumentParser()
    parser.add_argument("config_file_path", help="Path to the config file of the server")

    return parser.parse_args()

def setup_db(app_config: Config, db_secrets: Config) -> None:
    conn_params = ConnectionParams(
        database_name=app_config["db"]["database_name"],
        host=app_config["db"]["host"],
        port=int(app_config["db"]["port"]),
        username=db_secrets["db"]["username"],
        password=db_secrets["db"]["password"],
    )

    conn_mgr = ConnectionManager()
    conn_mgr.init(connection_params=conn_params)

def setup_auth(app_config: Config, jwt_secrets: Config) -> None:
    os.environ["GOOGLE_CLIENT_ID"] = app_config["google"]["client_id"]
    os.environ["JWT_SIGNING_KEY"] = jwt_secrets["jwt"]["key"]
    os.environ["JWT_EXPIRY_MINUTES"] = str(int(jwt_secrets["jwt"]["expiryMinutes"]))

def setup_app(app, config_file_path: Path) -> None:
    app_config: Config = ConfigLoader.load(config_file_path)
    db_secrets: Config = ConfigLoader.load(Path(config_file_path).parent / Path(app_config["db"]["secrets"]))
    jwt_secrets: Config = ConfigLoader.load(Path(config_file_path).parent / Path(app_config["jwt"]["secrets"]))

    setup_db(app_config=app_config, db_secrets=db_secrets)
    setup_auth(app_config=app_config, jwt_secrets=jwt_secrets)


if __name__ == "__main__":
    args = parse_args()
    config_file_path = Path(args.config_file_path).resolve()

    app = create_app(name=__name__)

    setup_app(app, config_file_path=config_file_path)

    app.run(port=5000)
