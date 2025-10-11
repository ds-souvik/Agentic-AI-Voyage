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


class BlogEngagement(db.Model):  # type: ignore[name-defined]
    """Track blog post engagement metrics."""

    id = db.Column(db.Integer, primary_key=True)
    # Blog post slug (from blog_data.json)
    post_slug = db.Column(db.String(255), nullable=False, index=True)
    # Engagement type: 'like', 'helpful_yes', 'helpful_no'
    engagement_type = db.Column(db.String(50), nullable=False, index=True)
    # User identifier (IP hash or session ID for anonymous tracking)
    user_identifier = db.Column(db.String(255), nullable=False, index=True)
    # Optional feedback text for 'helpful_no' responses
    feedback_text = db.Column(db.Text, nullable=True)
    # Timestamp
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)

    # Composite unique constraint to prevent duplicate engagement from same user
    __table_args__ = (
        db.UniqueConstraint('post_slug', 'engagement_type', 'user_identifier', 
                           name='unique_engagement'),
    )
