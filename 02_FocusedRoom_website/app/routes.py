import json
import logging
import os
from datetime import datetime, timezone
from pathlib import Path

from flask import Blueprint, Response, jsonify, redirect, render_template, request
from sqlalchemy import text

from app.utils.gemini_client import generate_personality_suggestions, get_gemini_client

from .models import BigFiveResult, BlogEngagement, Subscriber, db
from .utils.bigfive import compute_bigfive_scores, validate_answers
from .utils.emailer import email_service, send_subscription_confirmation
from .utils.rate_limiter import rate_limit
from .utils.seo import generate_sitemap_xml
from .utils.validators import (
    extract_name_from_big_five_report,
    extract_name_from_email,
    validate_subscription_request,
)

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

            # Extract name for personalized email
            user_name = extract_name_from_email(email)
            
            # Send NEW Welcome + Vision email (idempotent - safe to resend)
            email_result = email_service.send_welcome_vision_email(email, user_name)
            logger.info(f"Re-sent welcome email to existing subscriber: {email}")

            return jsonify(
                {
                    "success": True,
                    "message": "Already subscribed - welcome email sent",
                    "email_sent": email_result.get("success", False),
                    "email_provider": email_result.get("provider", "unknown"),
                }
            )

        # Create new subscription
        subscriber = Subscriber(email=email, opt_in=True)
        db.session.add(subscriber)
        db.session.commit()

        # Extract name for personalized email
        user_name = extract_name_from_email(email)
        
        # Send NEW Welcome + Vision email
        email_result = email_service.send_welcome_vision_email(email, user_name)
        logger.info(f"Sent welcome email to new subscriber: {email} (Name: {user_name})")

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

            # Send Big Five report email if email was provided
            email_sent = False
            if email and subscriber_id:
                try:
                    # Extract name from Big Five report (best source!)
                    user_name = extract_name_from_big_five_report(suggestions)
                    if not user_name:
                        # Fallback to email-based name extraction
                        user_name = extract_name_from_email(email)
                    
                    # Send the NEW Big Five Report email
                    email_result = email_service.send_big_five_report_email(
                        email=email,
                        user_name=user_name,
                        markdown_report=suggestions,
                        scores=scores
                    )
                    
                    email_sent = email_result.get("success", False)
                    if email_sent:
                        logger.info(f"Sent Big Five report email to {email} (Name: {user_name})")
                    else:
                        logger.error(f"Failed to send Big Five email to {email}: {email_result.get('error')}")
                        
                except Exception as email_error:
                    # Don't fail the request if email fails - just log it
                    logger.error(f"Exception sending Big Five email to {email}: {str(email_error)}")
                    email_sent = False

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
                    "email_sent": email_sent,  # NEW: Track if email was sent
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


@main_bp.route("/admin/subscribers/export")
def export_subscribers():
    """
    Export all subscribers to CSV format.

    Returns:
        CSV file download with subscriber data including:
        - Email, opt-in status, subscription date
        - Big Five test count and latest test date

    TODO: Add authentication/admin protection in production.
    """
    import csv
    from io import StringIO

    try:
        # Query all subscribers with their Big Five results
        subscribers = Subscriber.query.order_by(Subscriber.created_at.desc()).all()

        logger.info(f"Exporting {len(subscribers)} subscribers to CSV")

        # Create CSV in memory
        output = StringIO()
        writer = csv.writer(output)

        # Write header
        writer.writerow(
            [
                "ID",
                "Email",
                "Opt-In",
                "Subscription Date",
                "Total Big Five Tests",
                "Latest Test Date",
            ]
        )

        # Write data
        for sub in subscribers:
            # Count associated Big Five results
            test_count = sub.big_five_results.count() if hasattr(sub, "big_five_results") else 0

            # Get latest test date
            if test_count > 0:
                latest_test = sub.big_five_results.order_by(BigFiveResult.created_at.desc()).first()
                latest_test_date = (
                    latest_test.created_at.strftime("%Y-%m-%d %H:%M:%S") if latest_test else "N/A"
                )
            else:
                latest_test_date = "N/A"

            writer.writerow(
                [
                    sub.id,
                    sub.email,
                    "Yes" if sub.opt_in else "No",
                    sub.created_at.strftime("%Y-%m-%d %H:%M:%S"),
                    test_count,
                    latest_test_date,
                ]
            )

        # Prepare response
        output.seek(0)
        filename = f'focused_room_subscribers_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'

        logger.info(f"CSV export complete: {filename}")

        return Response(
            output.getvalue(),
            mimetype="text/csv",
            headers={"Content-Disposition": f"attachment; filename={filename}"},
        )

    except Exception as e:
        logger.error(f"Error exporting subscribers: {str(e)}")
        return jsonify({"success": False, "error": "Failed to export subscribers"}), 500


# ============================================
# BLOG ROUTES - WORLD-CLASS CONTENT SYSTEM
# ============================================


@main_bp.route("/blog")
def blog_list():
    """Display blog post listing."""
    try:
        # Load blog data from JSON
        blog_data_path = Path(__file__).parent / "static" / "blog_data.json"
        with open(blog_data_path, encoding="utf-8") as f:
            blog_data = json.load(f)

        posts = blog_data.get("posts", [])
        logger.info(f"Loaded {len(posts)} blog posts")

        return render_template("blog_list.html", posts=posts)

    except Exception as e:
        logger.error(f"Error loading blog list: {str(e)}")
        return render_template("blog_list.html", posts=[])


@main_bp.route("/blog/<slug>")
def blog_post(slug):
    """Display individual blog post."""
    try:
        # Load blog data
        blog_data_path = Path(__file__).parent / "static" / "blog_data.json"
        with open(blog_data_path, encoding="utf-8") as f:
            blog_data = json.load(f)

        # Find the post
        posts = blog_data.get("posts", [])
        post = next((p for p in posts if p["slug"] == slug), None)

        if not post:
            logger.warning(f"Blog post not found: {slug}")
            return "Blog post not found", 404

        # Load post content
        content_path = Path(__file__).parent / "blog_content" / f"{slug}.html"
        if not content_path.exists():
            logger.error(f"Blog content file not found: {content_path}")
            return "Blog content not found", 404

        with open(content_path, encoding="utf-8") as f:
            content = f.read()

        # Get related posts (all posts except current)
        related_posts = [p for p in posts if p["slug"] != slug]

        logger.info(f"Serving blog post: {slug}")

        return render_template(
            "blog_post.html", post=post, content=content, related_posts=related_posts
        )

    except Exception as e:
        logger.error(f"Error loading blog post {slug}: {str(e)}")
        return "Error loading blog post", 500


# ============================================================================
# Blog Engagement API Endpoints
# ============================================================================


def _get_user_identifier():
    """Generate a user identifier for anonymous engagement tracking."""
    import hashlib

    # Use IP + User Agent hash for anonymous but consistent tracking
    ip = request.headers.get("X-Forwarded-For", request.remote_addr)
    user_agent = request.headers.get("User-Agent", "")
    identifier = f"{ip}:{user_agent}"
    return hashlib.sha256(identifier.encode()).hexdigest()


@main_bp.route("/api/blog/engagement/<slug>", methods=["GET"])
def get_blog_engagement(slug):
    """Get engagement stats for a blog post."""
    try:
        from sqlalchemy import func

        # Get counts for each engagement type
        likes_count = (
            db.session.query(func.count(BlogEngagement.id))
            .filter(BlogEngagement.post_slug == slug)
            .filter(BlogEngagement.engagement_type == "like")
            .scalar()
            or 0
        )

        helpful_yes_count = (
            db.session.query(func.count(BlogEngagement.id))
            .filter(BlogEngagement.post_slug == slug)
            .filter(BlogEngagement.engagement_type == "helpful_yes")
            .scalar()
            or 0
        )

        helpful_no_count = (
            db.session.query(func.count(BlogEngagement.id))
            .filter(BlogEngagement.post_slug == slug)
            .filter(BlogEngagement.engagement_type == "helpful_no")
            .scalar()
            or 0
        )

        # Check if current user has engaged
        user_id = _get_user_identifier()
        user_engagement = (
            db.session.query(BlogEngagement)
            .filter(BlogEngagement.post_slug == slug)
            .filter(BlogEngagement.user_identifier == user_id)
            .all()
        )

        user_liked = any(e.engagement_type == "like" for e in user_engagement)
        user_voted_helpful = any(
            e.engagement_type in ["helpful_yes", "helpful_no"] for e in user_engagement
        )

        return jsonify(
            {
                "success": True,
                "data": {
                    "likes": likes_count,
                    "helpful_yes": helpful_yes_count,
                    "helpful_no": helpful_no_count,
                    "user_liked": user_liked,
                    "user_voted_helpful": user_voted_helpful,
                },
            }
        )

    except Exception as e:
        logger.error(f"Error getting engagement for {slug}: {str(e)}")
        return jsonify({"success": False, "error": "Server error"}), 500


@main_bp.route("/api/blog/engagement/<slug>/like", methods=["POST"])
@rate_limit(limit=10, window=60)
def toggle_blog_like(slug):
    """Toggle like on a blog post."""
    try:
        user_id = _get_user_identifier()

        # Check if user already liked
        existing_like = (
            db.session.query(BlogEngagement)
            .filter(BlogEngagement.post_slug == slug)
            .filter(BlogEngagement.engagement_type == "like")
            .filter(BlogEngagement.user_identifier == user_id)
            .first()
        )

        if existing_like:
            # Unlike
            db.session.delete(existing_like)
            db.session.commit()
            action = "unliked"
        else:
            # Like
            new_like = BlogEngagement(
                post_slug=slug, engagement_type="like", user_identifier=user_id
            )
            db.session.add(new_like)
            db.session.commit()
            action = "liked"

        # Get updated count
        from sqlalchemy import func

        likes_count = (
            db.session.query(func.count(BlogEngagement.id))
            .filter(BlogEngagement.post_slug == slug)
            .filter(BlogEngagement.engagement_type == "like")
            .scalar()
            or 0
        )

        return jsonify({"success": True, "data": {"action": action, "likes": likes_count}})

    except Exception as e:
        logger.error(f"Error toggling like for {slug}: {str(e)}")
        db.session.rollback()
        return jsonify({"success": False, "error": "Server error"}), 500


@main_bp.route("/api/blog/engagement/<slug>/helpful", methods=["POST"])
@rate_limit(limit=5, window=60)
def vote_blog_helpful(slug):
    """Vote on whether blog post was helpful."""
    try:
        data = request.get_json()
        is_helpful = data.get("helpful", True)
        feedback = data.get("feedback", "")

        user_id = _get_user_identifier()

        # Check if user already voted
        existing_vote = (
            db.session.query(BlogEngagement)
            .filter(BlogEngagement.post_slug == slug)
            .filter(BlogEngagement.engagement_type.in_(["helpful_yes", "helpful_no"]))
            .filter(BlogEngagement.user_identifier == user_id)
            .first()
        )

        if existing_vote:
            return jsonify({"success": False, "error": "You already voted on this post"}), 400

        # Add vote
        engagement_type = "helpful_yes" if is_helpful else "helpful_no"
        new_vote = BlogEngagement(
            post_slug=slug,
            engagement_type=engagement_type,
            user_identifier=user_id,
            feedback_text=feedback if not is_helpful else None,
        )
        db.session.add(new_vote)
        db.session.commit()

        return jsonify({"success": True, "data": {"voted": engagement_type}})

    except Exception as e:
        logger.error(f"Error voting helpful for {slug}: {str(e)}")
        db.session.rollback()
        return jsonify({"success": False, "error": "Server error"}), 500
