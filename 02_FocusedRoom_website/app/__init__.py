from datetime import datetime

from flask import Flask, request

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

    # ============================================
    # PERFORMANCE OPTIMIZATIONS (MILESTONE 7)
    # ============================================

    @app.after_request
    def add_performance_headers(response):
        """
        Add HTTP caching and security headers for optimal performance.

        Caching Strategy:
        - Static assets (CSS, JS, images): 1 year (immutable)
        - HTML pages: No cache (always fresh)
        - API endpoints: No cache

        Security Headers:
        - X-Content-Type-Options: Prevent MIME sniffing
        - X-Frame-Options: Prevent clickjacking
        - X-XSS-Protection: Enable XSS filtering (legacy browsers)

        Performance Headers:
        - Cache-Control: Aggressive caching for static assets
        - Vary: Handle different Accept-Encoding for compression
        """
        # Don't cache if already set
        if "Cache-Control" not in response.headers:
            # Static assets: aggressive caching (1 year)
            if request.path.startswith("/static/"):
                response.cache_control.public = True
                response.cache_control.max_age = 31536000  # 1 year
                response.cache_control.immutable = True
            # Everything else: no cache (HTML pages, API endpoints)
            else:
                response.cache_control.no_cache = True
                response.cache_control.no_store = True
                response.cache_control.must_revalidate = True
                response.cache_control.max_age = 0

        # Security headers (best practice)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "SAMEORIGIN"
        response.headers["X-XSS-Protection"] = "1; mode=block"

        # Enable compression via Vary header
        if "Vary" not in response.headers:
            response.headers["Vary"] = "Accept-Encoding"

        return response

    with app.app_context():
        # register blueprints / routes
        from .routes import main_bp

        app.register_blueprint(main_bp)
        db.create_all()
    return app
