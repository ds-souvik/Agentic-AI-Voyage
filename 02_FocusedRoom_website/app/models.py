from datetime import datetime

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()


class ChannelDetails(db.Model):  # type: ignore[name-defined]
    """Reference table for customer acquisition channels."""

    __tablename__ = "channel_details"

    channel_id = db.Column(db.Integer, primary_key=True)
    channel_name = db.Column(db.String(100), unique=True, nullable=False)
    channel_description = db.Column(db.String(255), nullable=True)

    # Relationship to customers
    customers = db.relationship("Customer", backref="channel", lazy="dynamic")


class Customer(db.Model):  # type: ignore[name-defined]
    """Customer model (formerly Subscriber) with demographic information."""

    __tablename__ = "customer"

    customer_id = db.Column(db.Integer, primary_key=True)
    email_id = db.Column(db.String(255), unique=True, nullable=False, index=True)
    name = db.Column(db.String(255), nullable=True)
    age = db.Column(db.Integer, nullable=True)
    profession = db.Column(db.Text, nullable=True)
    career_stage = db.Column(db.String(100), nullable=True)
    purpose = db.Column(db.Text, nullable=True)  # Primary goal
    channel_id = db.Column(
        db.Integer, db.ForeignKey("channel_details.channel_id"), nullable=True, index=True
    )
    create_dt = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)
    opt_in = db.Column(db.Boolean, default=True, nullable=False)

    # Relationship to BigFiveResult
    big_five_results = db.relationship("BigFiveResult", backref="customer", lazy="dynamic")


# Backward compatibility alias (will be removed after migration)
Subscriber = Customer


class BigFiveResult(db.Model):  # type: ignore[name-defined]
    """Big Five personality test result model."""

    id = db.Column(db.Integer, primary_key=True)
    # Foreign key to link result to customer (formerly subscriber_id)
    customer_id = db.Column(
        db.Integer, db.ForeignKey("customer.customer_id"), nullable=True, index=True
    )
    # Report number for this customer (1st test, 2nd test, etc.)
    report_id = db.Column(db.Integer, nullable=False, default=1)
    # Store normalized trait scores as JSON (scores, percentiles, raw_scores)
    scores = db.Column(db.JSON, nullable=False)
    # AI-generated personality suggestions (from Gemini or fallback)
    suggestions = db.Column(db.Text)
    # Timestamp for analytics and sorting
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)


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
        db.UniqueConstraint(
            "post_slug", "engagement_type", "user_identifier", name="unique_engagement"
        ),
    )
