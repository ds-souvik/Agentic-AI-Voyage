import logging
import os
from datetime import datetime, timezone

from flask import Blueprint, Response, jsonify, redirect, render_template, request
from sqlalchemy import text

from app.utils.gemini_client import generate_personality_suggestions, get_gemini_client

from .models import BigFiveResult, Subscriber, db
from .utils.bigfive import compute_bigfive_scores, validate_answers
from .utils.emailer import send_subscription_confirmation
from .utils.rate_limiter import rate_limit
from .utils.seo import generate_sitemap_xml
from .utils.validators import validate_subscription_request

# Configure logging
logger = logging.getLogger(__name__)

main_bp = Blueprint("main", __name__)


def _get_gemini_provider() -> str:
    """Helper function to get current Gemini provider for logging."""
    try:
        client = get_gemini_client()
        return client.provider
    except Exception:
        return "unknown"


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
    """
    Big Five Personality Test endpoint.

    GET: Render test page
    POST: Process test results, store in database, return AI insights
    """
    if request.method == "GET":
        return render_template("bigfive.html")

    if request.method == "POST":
        # Get request data
        try:
            data = request.get_json()
        except Exception:
            return jsonify({"success": False, "error": "Invalid JSON data"}), 400

        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400

        # Extract and validate required fields
        answers = data.get("answers")
        email = data.get("email", "").strip().lower() if data.get("email") else None
        demographics = data.get("demographics", {})

        if not answers:
            return jsonify({"success": False, "error": "Answers array required"}), 400

        # Log demographics for debugging
        logger.info(f"Received demographics: {demographics}")

        # Validate answers format and content
        is_valid, error_msg = validate_answers(answers)
        if not is_valid:
            return jsonify({"success": False, "error": error_msg}), 400

        # Validate email if provided (email is optional for anonymous tests)
        subscriber_id = None
        if email:
            # Validate email format using existing validator
            email_validation = validate_subscription_request({"email": email})
            if not email_validation[0]:
                return jsonify({"success": False, "error": email_validation[1]}), 400

            # Get or create subscriber (idempotent)
            try:
                subscriber = Subscriber.query.filter_by(email=email).first()
                if not subscriber:
                    subscriber = Subscriber(email=email, opt_in=True)
                    db.session.add(subscriber)
                    db.session.flush()  # Get subscriber.id without committing
                    logger.info(f"Created new subscriber: {email}")
                else:
                    logger.info(f"Found existing subscriber: {email}")

                subscriber_id = subscriber.id
            except Exception as e:
                logger.error(f"Error managing subscriber: {str(e)}")
                db.session.rollback()
                return jsonify({"success": False, "error": "Failed to process email"}), 500

        try:
            # Compute Big Five scores
            result_data = compute_bigfive_scores(answers)
            scores = result_data["scores"]
            percentiles = result_data["percentiles"]
            raw_scores = result_data.get("raw_scores", {})

            user_type = f"subscriber {subscriber_id}" if subscriber_id else "anonymous user"
            logger.info(f"Computed Big Five scores for {user_type}")

            # Generate AI-powered personality suggestions (Gemini with fallback)
            # Pass demographics for hyper-personalized insights
            suggestions = generate_personality_suggestions(
                scores=scores,
                percentiles=percentiles,
                demographics=demographics,
                fallback=True,  # Graceful fallback if API fails
            )

            logger.info(f"Generated personality suggestions using {_get_gemini_provider()}")

            # Store result in database with subscriber link
            result = BigFiveResult(
                subscriber_id=subscriber_id,
                scores={
                    "scores": scores,
                    "percentiles": percentiles,
                    "raw_scores": raw_scores,
                },
                suggestions=suggestions,
            )
            db.session.add(result)
            db.session.commit()

            user_type = f"subscriber {subscriber_id}" if subscriber_id else "anonymous user"
            logger.info(f"Stored Big Five result (ID: {result.id}) for {user_type}")

            # Return comprehensive response
            return jsonify(
                {
                    "success": True,
                    "result_id": result.id,
                    "scores": scores,
                    "percentiles": percentiles,
                    "suggestions": suggestions,
                    "email_captured": email is not None,
                    "subscriber_id": subscriber_id,
                }
            )

        except ValueError as e:
            logger.error(f"Validation error in Big Five processing: {str(e)}")
            return jsonify({"success": False, "error": str(e)}), 400
        except Exception as e:
            logger.error(f"Unexpected error in Big Five processing: {str(e)}")
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
