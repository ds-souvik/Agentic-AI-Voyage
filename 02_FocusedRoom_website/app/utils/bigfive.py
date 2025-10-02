"""
Big Five Personality Test Scoring Module

This module provides scoring logic for the Big Five personality traits
(Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism).

Standard Big Five tests typically use 44-50 questions with Likert scale responses.
"""

import statistics
from typing import Dict, List, Optional, Union

# Big Five trait keys
TRAITS = ["openness", "conscientiousness", "extraversion", "agreeableness", "neuroticism"]


def compute_bigfive_scores(
    answers: List[Union[int, float]], question_mapping: Optional[Dict[str, List[int]]] = None
) -> Dict[str, Union[float, Dict[str, float]]]:
    """
    Compute Big Five personality trait scores from a list of answers.

    This function validates the input, computes raw scores for each trait,
    normalizes them to a 0-100 scale, and calculates percentiles.

    Args:
        answers: List of numeric responses (typically 1-5 Likert scale).
                Expected length: 44 or 50 questions.
        question_mapping: Optional custom mapping of trait names to question indices.
                         If None, uses default mapping for 44-question test.

    Returns:
        Dictionary containing:
        - 'scores': Dict with trait names as keys and normalized scores (0-100) as values
        - 'percentiles': Dict with trait names as keys and percentile ranks as values
        - 'valid': Boolean indicating if scoring was successful

    Raises:
        ValueError: If answers length is invalid or contains non-numeric values

    Example:
        >>> answers = [3, 4, 2, 5, 3, ...] # 44 or 50 responses
        >>> result = compute_bigfive_scores(answers)
        >>> result['scores']['openness']
        72.5
    """

    # Validate input
    if not isinstance(answers, list):
        raise ValueError("Answers must be a list")

    if len(answers) not in [44, 50]:
        raise ValueError(f"Expected 44 or 50 answers, got {len(answers)}")

    # Validate all answers are numeric
    try:
        numeric_answers = [float(x) for x in answers]
    except (TypeError, ValueError) as e:
        raise ValueError(f"All answers must be numeric values: {e}")

    # Validate answer range (assuming 1-5 Likert scale)
    if any(x < 1 or x > 5 for x in numeric_answers):
        raise ValueError("All answers must be in the range 1-5")

    # Default question mapping for 44-question Big Five test
    # Based on standard IPIP Big Five markers
    # Each trait gets roughly equal number of questions
    if question_mapping is None:
        if len(answers) == 44:
            question_mapping = {
                "openness": [4, 9, 14, 19, 24, 29, 34, 39, 43],  # 9 questions
                "conscientiousness": [3, 8, 13, 18, 23, 28, 33, 38],  # 8 questions
                "extraversion": [0, 5, 10, 15, 20, 25, 30, 35, 40],  # 9 questions
                "agreeableness": [2, 7, 12, 17, 22, 27, 32, 37, 42],  # 9 questions
                "neuroticism": [1, 6, 11, 16, 21, 26, 31, 36, 41],  # 9 questions
            }
        else:  # 50 questions
            question_mapping = {
                "openness": [4, 9, 14, 19, 24, 29, 34, 39, 44, 49],  # 10 questions
                "conscientiousness": [3, 8, 13, 18, 23, 28, 33, 38, 43, 48],  # 10 questions
                "extraversion": [0, 5, 10, 15, 20, 25, 30, 35, 40, 45],  # 10 questions
                "agreeableness": [2, 7, 12, 17, 22, 27, 32, 37, 42, 47],  # 10 questions
                "neuroticism": [1, 6, 11, 16, 21, 26, 31, 36, 41, 46],  # 10 questions
            }

    # Compute raw scores for each trait
    raw_scores = {}
    for trait, indices in question_mapping.items():
        trait_answers = [numeric_answers[i] for i in indices if i < len(numeric_answers)]
        if trait_answers:
            raw_scores[trait] = statistics.mean(trait_answers)
        else:
            raw_scores[trait] = 0.0

    # Normalize scores to 0-100 scale
    # Assuming raw scores are on 1-5 scale, normalize to 0-100
    normalized_scores = {}
    for trait, raw_score in raw_scores.items():
        normalized_scores[trait] = ((raw_score - 1) / 4) * 100

    # Calculate percentiles (simplified approach using normal distribution assumption)
    # In production, you'd use normative data from a reference population
    percentiles = _calculate_percentiles(normalized_scores)

    return {
        "valid": True,
        "scores": normalized_scores,
        "percentiles": percentiles,
        "raw_scores": raw_scores,
    }


def _calculate_percentiles(normalized_scores: Dict[str, float]) -> Dict[str, float]:
    """
    Calculate percentile ranks for trait scores.

    This is a simplified calculation. In production, you would use
    normative data from a reference population sample.

    Args:
        normalized_scores: Dictionary of trait names to normalized scores (0-100)

    Returns:
        Dictionary of trait names to percentile ranks (0-100)
    """
    # Simplified approach: assume normal distribution with mean=50, sd=15
    # For demo purposes, use a linear approximation
    percentiles = {}
    for trait, score in normalized_scores.items():
        # Simple percentile approximation
        # In production, use scipy.stats.norm.cdf or lookup tables
        if score <= 25:
            percentile = score * 0.8  # 0-20th percentile
        elif score <= 50:
            percentile = 20 + (score - 25) * 1.2  # 20-50th percentile
        elif score <= 75:
            percentile = 50 + (score - 50) * 1.2  # 50-80th percentile
        else:
            percentile = 80 + (score - 75) * 0.8  # 80-100th percentile

        percentiles[trait] = min(100, max(0, percentile))

    return percentiles


def get_trait_interpretation(trait: str, score: float) -> str:
    """
    Get a human-readable interpretation of a trait score.

    Args:
        trait: Name of the Big Five trait
        score: Normalized score (0-100)

    Returns:
        String description of the score level
    """
    if score < 20:
        level = "very low"
    elif score < 40:
        level = "low"
    elif score < 60:
        level = "moderate"
    elif score < 80:
        level = "high"
    else:
        level = "very high"

    return f"{trait.capitalize()}: {level} ({score:.1f}/100)"


def validate_answers(answers: List[Union[int, float]]) -> tuple[bool, Optional[str]]:
    """
    Validate Big Five test answers without computing scores.

    Args:
        answers: List of numeric responses

    Returns:
        Tuple of (is_valid: bool, error_message: Optional[str])
    """
    if not isinstance(answers, list):
        return False, "Answers must be a list"

    if len(answers) not in [44, 50]:
        return False, f"Expected 44 or 50 answers, got {len(answers)}"

    try:
        numeric_answers = [float(x) for x in answers]
    except (TypeError, ValueError):
        return False, "All answers must be numeric values"

    if any(x < 1 or x > 5 for x in numeric_answers):
        return False, "All answers must be in the range 1-5"

    return True, None
