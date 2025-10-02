from datetime import datetime

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class Subscriber(db.Model):  # type: ignore[name-defined]
    """Subscriber model for newsletter subscriptions."""

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    opt_in = db.Column(db.Boolean, default=True)


class BigFiveResult(db.Model):  # type: ignore[name-defined]
    """Big Five personality test result model."""

    id = db.Column(db.Integer, primary_key=True)
    # store normalized trait scores as JSON
    scores = db.Column(db.JSON, nullable=False)
    suggestions = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
