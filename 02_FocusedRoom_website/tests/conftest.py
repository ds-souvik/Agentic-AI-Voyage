"""
Pytest configuration and shared fixtures for all test modules.

This file provides reusable fixtures following pytest best practices.
"""

import pytest

from app import create_app, db


@pytest.fixture(scope="function")
def app():
    """
    Create and configure a Flask application instance for testing.

    Scope: function - Each test gets a fresh app instance

    Yields:
        Flask app instance configured for testing
    """
    app = create_app()
    app.config["TESTING"] = True
    app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
    app.config["WTF_CSRF_ENABLED"] = False  # Disable CSRF for testing

    # Create application context
    ctx = app.app_context()
    ctx.push()

    # Create all database tables
    db.create_all()

    yield app

    # Cleanup
    db.session.remove()
    db.drop_all()
    ctx.pop()


@pytest.fixture(scope="function")
def client(app):
    """
    Create a test client for the Flask application.

    Args:
        app: Flask app instance from app fixture

    Returns:
        Flask test client for making requests
    """
    return app.test_client()


@pytest.fixture(scope="function")
def runner(app):
    """
    Create a test CLI runner for the Flask application.

    Args:
        app: Flask app instance from app fixture

    Returns:
        Flask CLI test runner
    """
    return app.test_cli_runner()


@pytest.fixture(scope="function")
def db_session(app):
    """
    Provide a database session for direct database operations in tests.

    Args:
        app: Flask app instance from app fixture

    Returns:
        SQLAlchemy database session
    """
    return db.session
