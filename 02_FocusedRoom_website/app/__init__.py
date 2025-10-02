from datetime import datetime

from flask import Flask

from .config import Config
from .models import db


def create_app():
    app = Flask(__name__, static_folder="static", template_folder="templates")
    app.config.from_object(Config)
    db.init_app(app)

    # <-- ADD THIS CONTEXT PROCESSOR -->
    @app.context_processor
    def inject_now():
        # Provide a callable 'now' so templates can call now().year
        return {"now": lambda: datetime.utcnow()}

    # <-- end context processor -->

    with app.app_context():
        # register blueprints / routes
        from .routes import main_bp

        app.register_blueprint(main_bp)
        db.create_all()
    return app
