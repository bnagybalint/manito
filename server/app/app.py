import flask
import connexion

from pathlib import Path
from typing import List

API_SPEC_FILES: List[Path] = [
    Path("spec/openapi.yaml"),
]

def get_openapi_spec_list() -> List[Path]:
    server_root_dir = Path(__file__).parent.parent
    return [server_root_dir / spec_path for spec_path in API_SPEC_FILES]

def create_app(name: str = "", openapi_spec_files: List[Path] = None) -> flask.Flask:
    options = {'swagger_url': '/'}

    app = connexion.FlaskApp(
        name,
        options=options,
    )

    spec_files = openapi_spec_files if openapi_spec_files is not None else get_openapi_spec_list()

    for spec_path in spec_files:
        app.add_api(spec_path)

    return app
