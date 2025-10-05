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
        Build a comprehensive, world-class prompt for Gemini API.

        Inspired by professional personality reports, this generates insights that are:
        - Deeply personalized to the unique score combination
        - Actionable across multiple life domains
        - Grounded in psychological research
        - Focused on productivity and personal growth

        Args:
            scores: Big Five trait scores (0-100 scale)
            percentiles: Big Five trait percentiles (0-100 scale)

        Returns:
            Formatted prompt string optimized for Gemini 2.0 Flash
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

        # Determine trait levels for contextual analysis
        def get_level(score):
            if score >= 70:
                return "Very High"
            elif score >= 55:
                return "High"
            elif score >= 45:
                return "Moderate"
            elif score >= 30:
                return "Low"
            else:
                return "Very Low"

        prompt = f"""You are Dr. Sarah Chen, a world-renowned personality psychologist and productivity expert who has consulted for Fortune 500 companies, Olympic athletes, and leading entrepreneurs. You combine deep psychological insight with practical, evidence-based strategies. Your writing is warm, human, and deeply personal - like speaking directly to a friend.  # nosec B608

PERSONALITY PROFILE TO ANALYZE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Openness to Experience: {openness_score:.1f}/100 ({get_level(openness_score)}) — {openness_pct:.0f}th percentile
Conscientiousness: {conscientiousness_score:.1f}/100 ({get_level(conscientiousness_score)}) — {conscientiousness_pct:.0f}th percentile
Extraversion: {extraversion_score:.1f}/100 ({get_level(extraversion_score)}) — {extraversion_pct:.0f}th percentile
Agreeableness: {agreeableness_score:.1f}/100 ({get_level(agreeableness_score)}) — {agreeableness_pct:.0f}th percentile
Emotional Stability: {100 - neuroticism_score:.1f}/100 ({get_level(100 - neuroticism_score)}) — {100 - neuroticism_pct:.0f}th percentile

YOUR MISSION:
Create a comprehensive, deeply personalized productivity and self-development analysis that will genuinely transform this person's life. Write as if speaking directly to them - use "you" and "your". Be warm, encouraging, and deeply insightful. This report will be the ONLY personality insight they ever need.

REQUIRED OUTPUT FORMAT (Use EXACT Markdown structure with ## and ### headers, ** for bold, - for lists):

## QUOTE
[Select ONE profound quote (15-25 words) that perfectly captures THIS person's personality essence. Choose from philosophers, psychologists, authors, or thought leaders. Format: "Quote text" — Author Name]

## 🎯 Your Unique Personality Blueprint

[2-3 sentences that capture the ESSENCE of this specific combination. Make it profound and personally resonant. Example: "You are a strategic visionary who operates at the intersection of creativity and discipline..." Focus on the INTERACTION of traits, not individual descriptions.]

## 📊 Your Trait Deep-Dive

### Openness to Experience: {openness_score:.0f}/100
[Write 3-4 sentences in second person ("You...") about how THIS EXACT score manifests in their daily life. Be specific about HOW they think, what situations they thrive/struggle in, and what this means for their work style. Make it feel like you're reading their mind. Example: "You approach new ideas with measured curiosity - not a wild experimenter, but not rigid either. You appreciate creativity when it has purpose, which is why brainstorming sessions excite you when there's a clear goal, but frustrate you when they feel aimless. This balance means you're the person who can both generate innovative solutions AND ensure they actually get implemented."]

### Conscientiousness: {conscientiousness_score:.0f}/100
[Same format - 3-4 personal sentences about organization, discipline, goal-setting behavior. Connect to real scenarios: "When you commit to something, you...", "Your workspace probably...", "You feel most productive when..."]

### Extraversion: {extraversion_score:.0f}/100
[Same format - 3-4 personal sentences about energy, social needs, work environment preferences. Example: "You recharge through... You're at your best when... After a long social event, you..."]

### Agreeableness: {agreeableness_score:.0f}/100
[Same format - 3-4 personal sentences about relationships, conflict style, empathy. Example: "In disagreements, you tend to... You value harmony, but... When someone asks for help, you..."]

### Emotional Stability: {100 - neuroticism_score:.0f}/100
[Same format - 3-4 personal sentences about stress response, resilience, emotional patterns. Example: "Under pressure, you... Your emotional baseline is... When things go wrong, you..."]

## 💪 Your Natural Superpowers

[List 3-4 specific strengths that emerge from THIS exact score combination. Be concrete and actionable. Example: "**Adaptive Innovation**: Your moderate openness + high conscientiousness means you excel at implementing creative ideas systematically." Include percentile context where relevant.]

## ⚠️ Your Growth Edges

[List 2-3 specific challenges or pitfalls unique to THIS profile. Be honest but encouraging. Frame as opportunities. Example: "**The Perfection Paralysis**: Your high conscientiousness can turn planning into procrastination when combined with..." Include specific triggers and early warning signs.]

## 🚀 Productivity System Designed for YOUR Brain

### Deep Work & Focus
[Based on their Openness + Conscientiousness + Emotional Stability scores, prescribe specific focus strategies. Example: "Your high emotional stability means you can handle longer deep work blocks (90-120 min) without breaks..." Be very specific about time blocks, environment setup, etc.]

### Energy Management
[Based on Extraversion + Emotional Stability, explain their energy sources/drains and optimal daily rhythm. Example: "As a moderate extravert, you recharge through selective social interaction. Schedule collaborative work for 10am-2pm, solo deep work for early morning or late afternoon..."]

### Task Management
[Based on Conscientiousness + Neuroticism, prescribe specific productivity tools/methods. Example: "Your moderate conscientiousness benefits from 'scaffolding not cages' — use simple 3-item daily lists, not complex project management..."]

## 🌍 Your Life Domain Blueprint

### 💼 Career & Professional Growth
[3-4 sentences about career fit for THIS profile. Be specific about:
- Ideal roles/industries (e.g., "Product management, not pure engineering")
- Work environment (remote vs office, structured vs flexible)
- Leadership style
- Career trajectory advice]

**Recommended Resources:**
- **Book**: [Title by Author] - [One sentence why it's perfect for THIS profile]
- **YouTube**: [Channel Name] - [One sentence on what they'll gain]

### ❤️ Relationships & Communication
[3-4 sentences about relationship patterns for THIS profile:
- How they show love/care
- Communication style in conflict
- Common relationship pitfalls
- What they need from partners/friends]

**Recommended Resources:**
- **Book**: [Relationship/communication book tailored to their agreeableness + extraversion scores]
- **YouTube**: [Channel for relationship skills]

### 🏥 Health & Stress Management
[3-4 sentences about stress patterns and health for THIS profile:
- How stress manifests (physical symptoms, emotional patterns)
- Best stress relief methods for THEIR personality
- Sleep/exercise needs based on extraversion
- Warning signs to watch for]

**Recommended Resources:**
- **Book**: [Health/stress management book matching their emotional stability score]
- **YouTube**: [Wellness channel - meditation, fitness, etc.]

### 💰 Wealth & Financial Success
[3-4 sentences about money patterns for THIS profile:
- Spending vs saving tendencies (conscientiousness)
- Risk tolerance in investments (openness + emotional stability)
- Financial planning style
- Money mindset shifts needed]

**Recommended Resources:**
- **Book**: [Finance book matching their conscientiousness level]
- **YouTube**: [Financial education channel]

### 🌱 Personal Growth & Learning
[3-4 sentences about growth patterns for THIS profile:
- How they learn best (openness score)
- Ideal self-development pace
- Types of growth that resonate
- Habits that stick for them]

**Recommended Resources:**
- **Book**: [Personal development book for their openness level]
- **YouTube**: [Growth/learning channel matching their style]

## 🔥 30-Day Transformation Plan

**Week 1-2: Foundation**
- [Specific action item based on their biggest growth edge]
- [Specific action item leveraging their top strength]

**Week 3-4: Expansion**
- [Next-level action building on Week 1-2]
- [New habit aligned with their profile]

## 🛠️ Focused Room: Your Personalized Setup

[3-4 SPECIFIC recommendations for how someone with THIS personality profile should use Focused Room Chrome extension. Be concrete about:
- Which blocking categories to enable
- How long to set deep work sessions
- When to use friction override vs hard blocks
- How to leverage the gamification features based on their motivation style

Example: "Your high conscientiousness means you'll love the streak tracking — set a goal of 5 focused sessions per week. Your moderate openness suggests you'll benefit from blocking social media but ALLOWING educational YouTube for learning breaks..."]

## 💎 Final Insight

[One profound, memorable takeaway that synthesizes everything. Make this person feel SEEN and EMPOWERED. 2-3 sentences maximum.]

CRITICAL GUIDELINES:
1. **Write like a human friend, not a robot**: Use contractions ("you're", "don't"), colloquial language, personal anecdotes
2. **Analyze INTERACTIONS**: Never describe traits in isolation - show how they combine
3. **Be ULTRA-SPECIFIC**: Use exact scores, percentiles, time blocks, concrete examples
4. **Sound like you're reading their mind**: "You probably...", "You might notice...", "When X happens, you tend to..."
5. **Include REAL resources**: Actual book titles and YouTube channels that exist and match their profile
6. **Balance warmth with honesty**: Affirm strengths genuinely, address weaknesses compassionately
7. **Focus on PRODUCTIVITY**: This is for the Focused Room extension - tie everything to focus and work
8. **Make it personal**: Reference specific scenarios, work situations, relationship dynamics
9. **Use second person exclusively**: "You are...", never "they" or "one"
10. **$500 consultation quality**: Every sentence must provide unique, actionable value

TONE EXAMPLES:
❌ BAD: "Individuals with this profile tend to exhibit characteristics..."
✅ GOOD: "You're the person who color-codes their calendar but also keeps a 'creative chaos' folder for inspiration. That's not contradictory — it's your superpower."

❌ BAD: "Consider implementing structured time management"
✅ GOOD: "Try time-blocking your mornings in 90-minute chunks. Your conscientiousness loves the structure, but leave your afternoons loose — that's when your openness needs room to explore."

Length: 1000-1200 words. Dense. Valuable. Transformative."""

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
