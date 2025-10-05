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
    # Foreign key to link result to subscriber (optional for anonymous tests)
    subscriber_id = db.Column(db.Integer, db.ForeignKey("subscriber.id"), nullable=True, index=True)
    # Store normalized trait scores as JSON (scores, percentiles, raw_scores)
    scores = db.Column(db.JSON, nullable=False)
    # AI-generated personality suggestions (from Gemini or fallback)
    suggestions = db.Column(db.Text)
    # Timestamp for analytics and sorting
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)

    # Relationship to Subscriber (enables result.subscriber.email access)
    subscriber = db.relationship(
        "Subscriber", backref=db.backref("big_five_results", lazy="dynamic")
    )
