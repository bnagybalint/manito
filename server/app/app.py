import flask
import connexion

def create_app(name: str = "") -> flask.Flask:
    options = {'swagger_url': '/'}

    app = connexion.FlaskApp(
        name,
        specification_dir='spec/',
        options=options,
    )
    app.add_api('openapi.yaml')

    return app
