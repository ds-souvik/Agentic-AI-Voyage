"""
Gemini AI Client Module for Focused Room Website

This module provides AI-powered personality suggestions using Google's Gemini API
with graceful fallback to generic suggestions when the API is unavailable.
"""

import logging
import os
import time
from typing import Optional

# Configure logging
logger = logging.getLogger(__name__)

# Module-level genai reference (will be set after import attempt)
genai = None  # type: ignore
GEMINI_AVAILABLE = False

# Try to import Gemini, handle gracefully if not installed
try:
    import google.generativeai as genai  # type: ignore  # noqa: F811

    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False
    logger.warning("google-generativeai package not installed. Using fallback suggestions.")


class GeminiClient:
    """
    Gemini AI client for generating personalized personality suggestions.

    Supports:
    - Gemini API (primary)
    - Generic fallback suggestions (when API unavailable)
    """

    def __init__(self):
        """Initialize Gemini client with configuration from environment."""
        self.api_key = os.environ.get("GEMINI_API_KEY")
        self.model_name = "gemini-2.0-flash-exp"  # Updated for Gemini 2.5
        self.model = None
        self.provider = self._determine_provider()

        if self.provider == "gemini":
            self._initialize_gemini()

        logger.info(f"Gemini client initialized with provider: {self.provider}")

    def _determine_provider(self) -> str:
        """Determine which provider to use based on available credentials."""
        if not GEMINI_AVAILABLE:
            return "fallback"
        elif self.api_key and self.api_key.strip():
            return "gemini"
        else:
            return "fallback"

    def _initialize_gemini(self) -> None:
        """Initialize Gemini AI model with API key."""
        try:
            genai.configure(api_key=self.api_key)  # type: ignore
            self.model = genai.GenerativeModel(self.model_name)  # type: ignore
            logger.info(f"Gemini model '{self.model_name}' initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Gemini model: {str(e)}")
            self.provider = "fallback"
            self.model = None

    def generate_personality_suggestions(
        self,
        scores: dict[str, float],
        percentiles: dict[str, float],
        max_retries: int = 2,
        timeout: int = 30,
    ) -> str:
        """
        Generate personalized personality suggestions based on Big Five scores.

        Args:
            scores: Dictionary of Big Five trait scores (0-100)
            percentiles: Dictionary of Big Five trait percentiles (0-100)
            max_retries: Maximum number of API retry attempts
            timeout: API call timeout in seconds

        Returns:
            String containing personality suggestions
        """
        if self.provider == "fallback":
            logger.info("Using fallback suggestions (Gemini API not available)")
            return self._generate_fallback_suggestions(scores, percentiles)

        # Try Gemini API with retry logic
        for attempt in range(max_retries):
            try:
                suggestions = self._call_gemini_api(scores, percentiles, timeout)
                logger.info("Successfully generated suggestions using Gemini API")
                return suggestions
            except Exception as e:
                logger.warning(f"Gemini API attempt {attempt + 1}/{max_retries} failed: {str(e)}")
                if attempt < max_retries - 1:
                    time.sleep(2**attempt)  # Exponential backoff: 1s, 2s, 4s
                else:
                    logger.error("All Gemini API attempts failed, using fallback")
                    return self._generate_fallback_suggestions(scores, percentiles)

        # This return is for type checker (unreachable in practice)
        return self._generate_fallback_suggestions(scores, percentiles)

    def _call_gemini_api(
        self, scores: dict[str, float], percentiles: dict[str, float], timeout: int
    ) -> str:
        """
        Call Gemini API to generate personality suggestions.

        Args:
            scores: Big Five trait scores
            percentiles: Big Five trait percentiles
            timeout: API timeout in seconds

        Returns:
            Generated suggestions string

        Raises:
            Exception: If API call fails
        """
        if not self.model:
            raise Exception("Gemini model not initialized")

        # Construct prompt for Gemini
        prompt = self._build_gemini_prompt(scores, percentiles)

        # Call Gemini API
        response = self.model.generate_content(
            prompt,
            generation_config={
                "temperature": 0.7,
                "top_p": 0.9,
                "top_k": 40,
                "max_output_tokens": 800,
            },
        )

        # Extract and validate response
        if not response or not response.text:
            raise Exception("Empty response from Gemini API")

        return response.text.strip()

    def _build_gemini_prompt(self, scores: dict[str, float], percentiles: dict[str, float]) -> str:
        """
        Build a detailed prompt for Gemini API based on personality scores.

        Args:
            scores: Big Five trait scores
            percentiles: Big Five trait percentiles

        Returns:
            Formatted prompt string
        """
        openness_score = scores.get("openness", 0)
        conscientiousness_score = scores.get("conscientiousness", 0)
        extraversion_score = scores.get("extraversion", 0)
        agreeableness_score = scores.get("agreeableness", 0)
        neuroticism_score = scores.get("neuroticism", 0)

        openness_pct = percentiles.get("openness", 0)
        conscientiousness_pct = percentiles.get("conscientiousness", 0)
        extraversion_pct = percentiles.get("extraversion", 0)
        agreeableness_pct = percentiles.get("agreeableness", 0)
        neuroticism_pct = percentiles.get("neuroticism", 0)

        prompt = f"""You are a professional personality psychologist. Based on the \
Big Five personality test results below, provide personalized, actionable suggestions \
for personal development and productivity improvement.

Big Five Personality Scores (0-100 scale):
- Openness: {openness_score:.1f} (Percentile: {openness_pct:.0f}%)
- Conscientiousness: {conscientiousness_score:.1f} (Percentile: {conscientiousness_pct:.0f}%)
- Extraversion: {extraversion_score:.1f} (Percentile: {extraversion_pct:.0f}%)
- Agreeableness: {agreeableness_score:.1f} (Percentile: {agreeableness_pct:.0f}%)
- Neuroticism: {neuroticism_score:.1f} (Percentile: {neuroticism_pct:.0f}%)

Please provide:
1. A brief overview of this personality profile (2-3 sentences)
2. Top 3 strengths based on these scores
3. Top 3 areas for development
4. Specific, actionable productivity tips tailored to this profile
5. Recommended focus strategies for the Focused Room Chrome extension

Keep the tone friendly, encouraging, and practical. Format with clear sections and \
bullet points. Limit response to 500 words."""

        return prompt

    def _generate_fallback_suggestions(
        self, scores: dict[str, float], percentiles: dict[str, float]
    ) -> str:
        """
        Generate generic fallback suggestions when Gemini API is unavailable.

        Args:
            scores: Big Five trait scores
            percentiles: Big Five trait percentiles

        Returns:
            Generic suggestions string
        """
        suggestions = []

        # Header
        suggestions.append("## Your Personality Profile\n")
        suggestions.append(
            "Here are some insights based on your Big Five personality assessment.\n"
        )

        # Trait-specific suggestions
        trait_suggestions = {
            "openness": {
                "high": (
                    "Your high openness suggests you enjoy creativity and new "
                    "experiences. Try exploring diverse content and creative "
                    "problem-solving."
                ),
                "low": (
                    "Your preference for routine and practicality can help maintain "
                    "consistent focus. Stick to structured work environments."
                ),
            },
            "conscientiousness": {
                "high": (
                    "Your strong conscientiousness indicates excellent organization "
                    "skills. Use detailed to-do lists and time-blocking techniques."
                ),
                "low": (
                    "Consider using simple productivity tools to build better "
                    "organizational habits gradually."
                ),
            },
            "extraversion": {
                "high": (
                    "Your extraverted nature thrives on interaction. Balance social "
                    "activities with focused work sessions."
                ),
                "low": (
                    "Your introspective nature is great for deep work. Create quiet, "
                    "distraction-free environments."
                ),
            },
            "agreeableness": {
                "high": (
                    "Your cooperative nature makes you a great team player. Set clear "
                    "boundaries to protect your focus time."
                ),
                "low": (
                    "Your assertiveness helps maintain personal boundaries. Use this "
                    "strength to protect your productivity time."
                ),
            },
            "neuroticism": {
                "high": (
                    "Managing stress is important. Use the Focused Room extension to "
                    "create calm, controlled work sessions."
                ),
                "low": (
                    "Your emotional stability is an asset. Leverage it during "
                    "high-pressure situations."
                ),
            },
        }

        # Add personalized suggestions based on scores
        suggestions.append("\n### Key Insights\n")
        for trait, score in scores.items():
            level = "high" if score > 60 else "low"
            suggestion = trait_suggestions.get(trait, {}).get(
                level, f"Your {trait} score is {score:.1f}"
            )
            suggestions.append(f"**{trait.capitalize()}**: {suggestion}\n")

        # Generic productivity tips
        suggestions.append("\n### Productivity Tips for Focused Room\n")
        suggestions.append("- Set clear daily goals before starting work sessions\n")
        suggestions.append("- Use website blocking to eliminate distractions\n")
        suggestions.append("- Take regular breaks to maintain mental freshness\n")
        suggestions.append("- Track your progress to stay motivated\n")

        return "".join(suggestions)


# Singleton instance for reuse across requests
_gemini_client_instance: Optional[GeminiClient] = None


def get_gemini_client() -> GeminiClient:
    """
    Get or create singleton GeminiClient instance.

    Returns:
        GeminiClient instance
    """
    global _gemini_client_instance
    if _gemini_client_instance is None:
        _gemini_client_instance = GeminiClient()
    return _gemini_client_instance


def generate_personality_suggestions(
    scores: dict[str, float],
    percentiles: dict[str, float],
    fallback: bool = True,
) -> str:
    """
    Convenience function to generate personality suggestions.

    Args:
        scores: Dictionary of Big Five trait scores (0-100)
        percentiles: Dictionary of Big Five trait percentiles (0-100)
        fallback: Whether to use fallback if API fails (default: True)

    Returns:
        String containing personality suggestions
    """
    client = get_gemini_client()
    return client.generate_personality_suggestions(scores, percentiles)
