import flask
import connexion

from pathlib import Path
from typing import List
from connexion.resolver import RelativeResolver
from flask_jwt_extended import JWTManager

API_SPEC_FILES: List[Path] = [
    Path("spec/openapi.yaml"),
]

def get_openapi_spec_list() -> List[Path]:
    # TODO this parent chaining should not de depended upon
    service_root_dir = Path(__file__).parent.parent.parent
    return [service_root_dir / spec_path for spec_path in API_SPEC_FILES]

def create_app(name: str = "", openapi_spec_files: List[Path] = None) -> flask.Flask:
    options = {'swagger_url': '/'}

    app = connexion.FlaskApp(
        name,
        options=options,
    )

    spec_files = openapi_spec_files if openapi_spec_files is not None else get_openapi_spec_list()

    for spec_path in spec_files:
        app.add_api(spec_path, resolver=RelativeResolver('data_service.server'))

    return app.app

def configure_auth(app: flask.Flask, jwt_signing_key: str) -> flask.Flask:

    app.config["JWT_SECRET_KEY"] = jwt_signing_key

    app.config["JWT_TOKEN_LOCATION"] = ["cookies"]

    app.config["JWT_COOKIE_CSRF_PROTECT"] = True
    app.config["JWT_CSRF_IN_COOKIES"] = True

    jwt_manager = JWTManager()
    jwt_manager.init_app(app)

    return app
