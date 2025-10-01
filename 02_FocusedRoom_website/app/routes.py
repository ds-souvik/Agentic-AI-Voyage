from flask import Blueprint, render_template, request, jsonify, redirect, url_for
from .models import db, Subscriber, BigFiveResult
from .utils.emailer import send_subscription_confirmation
from .utils.bigfive import compute_bigfive_scores, validate_answers

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    return render_template('index.html')

@main_bp.route('/download')
def download():
    # redirect to Chrome Web Store; include UTM
    cws = "https://chromewebstore.google.com/detail/distraction-killer-deep-f/caeoilelbbcpmpfifbkgkmabbeiibiko?utm_source=ext_app_menu<your-extension-id>?utm_source=site&utm_medium=cta&utm_campaign=launch"
    return redirect(cws)

@main_bp.route('/api/subscribe', methods=['POST'])
def subscribe():
    data = request.get_json()
    email = data.get('email')
    if not email:
        return jsonify({"success": False, "error": "Email required"}), 400
    existing = Subscriber.query.filter_by(email=email).first()
    if existing:
        return jsonify({"success": True, "message": "Already subscribed"})
    sub = Subscriber(email=email)
    db.session.add(sub)
    db.session.commit()
    # send confirmation email (async recommended)
    send_subscription_confirmation(email)
    return jsonify({"success": True})

@main_bp.route('/big-five', methods=['GET', 'POST'])
def big_five():
    if request.method == 'GET':
        return render_template('bigfive.html')
    if request.method == 'POST':
        # Get answers from request
        data = request.get_json()
        if not data:
            return jsonify({"success": False, "error": "No data provided"}), 400
        
        answers = data.get('answers')
        if not answers:
            return jsonify({"success": False, "error": "Answers array required"}), 400
        
        # Validate answers first
        is_valid, error_msg = validate_answers(answers)
        if not is_valid:
            return jsonify({"success": False, "error": error_msg}), 400
        
        try:
            # Compute Big Five scores
            result_data = compute_bigfive_scores(answers)
            scores = result_data['scores']
            percentiles = result_data['percentiles']
            
            # For now, generate placeholder suggestions
            # In MILESTONE 5, this will be replaced with Gemini/LLM integration
            suggestions = _generate_placeholder_suggestions(scores)
            
            # Store result in database
            result = BigFiveResult(
                scores={
                    "scores": scores,
                    "percentiles": percentiles,
                    "raw_scores": result_data.get('raw_scores', {})
                },
                suggestions=suggestions
            )
            db.session.add(result)
            db.session.commit()
            
            return jsonify({
                "success": True,
                "id": result.id,
                "scores": scores,
                "percentiles": percentiles,
                "suggestions": suggestions
            })
        
        except ValueError as e:
            return jsonify({"success": False, "error": str(e)}), 400
        except Exception as e:
            db.session.rollback()
            return jsonify({"success": False, "error": "Internal server error"}), 500


def _generate_placeholder_suggestions(scores: dict) -> str:
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
        "neuroticism": "emotional stability"
    }
    
    for trait, description in trait_descriptions.items():
        score = scores.get(trait, 50)
        if score >= 70:
            suggestions.append(f"Your high {trait} score suggests strong {description}.")
        elif score <= 30:
            suggestions.append(f"Your lower {trait} score indicates a different approach to {description}.")
    
    if not suggestions:
        suggestions.append("Your personality profile shows balanced traits across all dimensions.")
    
    return " ".join(suggestions)