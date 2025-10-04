import os
from datetime import datetime, timezone

from flask import Blueprint, Response, jsonify, redirect, render_template, request
from sqlalchemy import text

from app.utils.gemini_client import generate_personality_suggestions

from .models import BigFiveResult, Subscriber, db
from .utils.bigfive import compute_bigfive_scores, validate_answers
from .utils.emailer import send_subscription_confirmation
from .utils.rate_limiter import rate_limit
from .utils.seo import generate_sitemap_xml
from .utils.validators import validate_subscription_request

main_bp = Blueprint("main", __name__)


@main_bp.route("/")
def index():
    return render_template("index.html")


# Line 23 - Split long URL
@main_bp.route("/download")
def download():
    """Redirect to Chrome Web Store."""
    base_url = "https://chromewebstore.google.com/detail/"
    extension_id = "distraction-killer-deep-f/"
    tracking = "caeoilelbbcpmpfifbkgkmabbeiibiko?"
    utm_params = "utm_source=site&utm_medium=cta&utm_campaign=launch"
    cws = f"{base_url}{extension_id}{tracking}{utm_params}"
    return redirect(cws)


@main_bp.route("/api/subscribe", methods=["POST"])
@rate_limit(limit=5, window=3600)  # 5 requests per hour per IP
def subscribe():
    """
    Enhanced newsletter subscription endpoint with validation and rate limiting.

    Rate limit: 5 requests per hour per IP address
    """
    try:
        # Get request data
        try:
            data = request.get_json()
        except Exception:
            # Handle malformed JSON or empty body
            return jsonify({"success": False, "error": "Email is required"}), 400

        # Validate request data
        is_valid, error_msg = validate_subscription_request(data)
        if not is_valid:
            return jsonify({"success": False, "error": error_msg}), 400

        email = data["email"].lower().strip()  # Normalize email

        # Check for existing subscription (idempotent operation)
        existing = Subscriber.query.filter_by(email=email).first()
        if existing:
            # Update existing subscription if needed
            existing.opt_in = True
            db.session.commit()

            # Send confirmation email (idempotent - safe to resend)
            email_result = send_subscription_confirmation(email)

            return jsonify(
                {
                    "success": True,
                    "message": "Already subscribed - confirmation sent",
                    "email_sent": email_result.get("success", False),
                    "email_provider": email_result.get("provider", "unknown"),
                }
            )

        # Create new subscription
        subscriber = Subscriber(email=email, opt_in=True)
        db.session.add(subscriber)
        db.session.commit()

        # Send confirmation email
        email_result = send_subscription_confirmation(email)

        return jsonify(
            {
                "success": True,
                "message": "Successfully subscribed to newsletter",
                "email_sent": email_result.get("success", False),
                "email_provider": email_result.get("provider", "unknown"),
                "subscriber_id": subscriber.id,
            }
        )

    except Exception as e:
        # Rollback database transaction on error
        db.session.rollback()

        # Log error (in production, use proper logging)
        print(f"Subscription error: {str(e)}")

        return jsonify({"success": False, "error": "Internal server error"}), 500


@main_bp.route("/big-five", methods=["GET", "POST"])
def big_five():
    if request.method == "GET":
        return render_template("bigfive.html")
    if request.method == "POST":
        # Get answers from request
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400

        answers = data.get("answers")
        if not answers:
            return jsonify({"success": False, "error": "Answers array required"}), 400

        # Validate answers first
        is_valid, error_msg = validate_answers(answers)
        if not is_valid:
            return jsonify({"success": False, "error": error_msg}), 400

        try:
            # Compute Big Five scores
            result_data = compute_bigfive_scores(answers)
            scores = result_data["scores"]
            percentiles = result_data["percentiles"]

            # For now, generate placeholder suggestions
            # In MILESTONE 5, this will be replaced with Gemini/LLM integration
            suggestions = generate_personality_suggestions(
                scores=scores, percentiles=percentiles, fallback=True  # Auto-fallback if API fails
            )

            # Store result in database
            result = BigFiveResult(
                scores={
                    "scores": scores,
                    "percentiles": percentiles,
                    "raw_scores": result_data.get("raw_scores", {}),
                },
                suggestions=suggestions,
            )
            db.session.add(result)
            db.session.commit()

            return jsonify(
                {
                    "success": True,
                    "id": result.id,
                    "scores": scores,
                    "percentiles": percentiles,
                    "suggestions": suggestions,
                }
            )

        except ValueError as e:
            return jsonify({"success": False, "error": str(e)}), 400
        except Exception:
            db.session.rollback()
            return jsonify({"success": False, "error": "Internal server error"}), 500


# commenting out the placeholder suggestions for now
''' def _generate_placeholder_suggestions(scores: dict) -> str:
    """
    Generate placeholder suggestions based on scores.
    This will be replaced with LLM integration in MILESTONE 5.
    """
    suggestions = []

    trait_descriptions = {
        "openness": "creativity and curiosity",
        "conscientiousness": "organization and reliability",
        "extraversion": "sociability and enthusiasm",
        "agreeableness": "cooperation and empathy",
        "neuroticism": "emotional stability",
    }

    for trait, description in trait_descriptions.items():
        score = scores.get(trait, 50)
        if score >= 70:
            suggestions.append(f"Your high {trait} score suggests strong {description}.")
        elif score <= 30:
            suggestions.append(
                f"Your lower {trait} score indicates a different approach to {description}."
            )

    if not suggestions:
        suggestions.append("Your personality profile shows balanced traits across all dimensions.")

    return " ".join(suggestions) '''


@main_bp.route("/sitemap.xml")
def sitemap():
    """Generate and serve XML sitemap."""
    base_url = request.url_root.rstrip("/")
    sitemap_xml = generate_sitemap_xml(base_url)
    return Response(sitemap_xml, mimetype="application/xml")


# Use context manager for file handling
@main_bp.route("/robots.txt")
def robots():
    """Serve robots.txt file."""
    with open("app/static/robots.txt") as f:
        content = f.read()
    return Response(content, mimetype="text/plain")


@main_bp.route("/features")
def features():
    """Features page."""
    return render_template("features.html")


@main_bp.route("/privacy")
def privacy():
    """Privacy policy page."""
    return render_template("privacy.html")


@main_bp.route("/blog")
def blog():
    """Blog listing page."""
    return render_template("blog_list.html")


@main_bp.route("/blog/<slug>")
def blog_post(slug):
    """Individual blog post page."""
    return render_template("blog_post.html", slug=slug)


@main_bp.route("/health")
def health_check():
    """
    Health check endpoint for monitoring and load balancers.

    Returns:
        JSON response with application health status
    """
    try:
        # Check database connection
        db.session.execute(text("SELECT 1"))
        db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    health_data = {
        "status": "healthy" if db_status == "healthy" else "degraded",
        "timestamp": datetime.now(timezone.utc).isoformat(),  # Python 3.9+ compatible
        "database": db_status,
        "version": "1.5.0",
        "environment": os.environ.get("FLASK_ENV", "production"),
    }

    status_code = 200 if health_data["status"] == "healthy" else 503
    return jsonify(health_data), status_code
