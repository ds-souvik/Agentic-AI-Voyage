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
        demographics: dict = None,
        max_retries: int = 2,
        timeout: int = 30,
    ) -> str:
        """
        Generate personalized personality suggestions based on Big Five scores.

        Args:
            scores: Dictionary of Big Five trait scores (0-100)
            percentiles: Dictionary of Big Five trait percentiles (0-100)
            demographics: User demographic and life pillar data (optional)
            max_retries: Maximum number of API retry attempts
            timeout: API call timeout in seconds

        Returns:
            String containing personality suggestions
        """
        if demographics is None:
            demographics = {}

        if self.provider == "fallback":
            logger.info("Using fallback suggestions (Gemini API not available)")
            return self._generate_fallback_suggestions(scores, percentiles)

        # Try Gemini API with retry logic
        for attempt in range(max_retries):
            try:
                suggestions = self._call_gemini_api(scores, percentiles, demographics, timeout)
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
        self,
        scores: dict[str, float],
        percentiles: dict[str, float],
        demographics: dict,
        timeout: int,
    ) -> str:
        """
        Call Gemini API to generate personality suggestions.

        Args:
            scores: Big Five trait scores
            percentiles: Big Five trait percentiles
            demographics: User demographic and life pillar data
            timeout: API timeout in seconds

        Returns:
            Generated suggestions string

        Raises:
            Exception: If API call fails
        """
        if not self.model:
            raise Exception("Gemini model not initialized")

        # Construct prompt for Gemini with demographics
        prompt = self._build_gemini_prompt(scores, percentiles, demographics)

        # Call Gemini API with higher token limit for comprehensive report
        response = self.model.generate_content(
            prompt,
            generation_config={
                "temperature": 0.85,  # Slightly higher for more creative, personal tone
                "top_p": 0.95,
                "top_k": 40,
                "max_output_tokens": 2048,  # Increased for detailed life domain insights
            },
        )

        # Extract and validate response
        if not response or not response.text:
            raise Exception("Empty response from Gemini API")

        return response.text.strip()

    def _build_gemini_prompt(
        self, scores: dict[str, float], percentiles: dict[str, float], demographics: dict = None
    ) -> str:
        """
        Build a comprehensive, world-class prompt for Gemini API.

        Inspired by professional personality reports, this generates insights that are:
        - Deeply personalized to the unique score combination
        - Actionable across multiple life domains
        - Grounded in psychological research
        - Focused on productivity and personal growth
        - Hyper-personalized with demographic and life pillar data

        Args:
            scores: Big Five trait scores (0-100 scale)
            percentiles: Big Five trait percentiles (0-100 scale)
            demographics: User demographic and life pillar satisfaction data

        Returns:
            Formatted prompt string optimized for Gemini 2.0 Flash
        """
        if demographics is None:
            demographics = {}
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

        # Extract demographics
        name = demographics.get("name", "friend")
        age = demographics.get("age", "your age")
        career = demographics.get("career", "your field")
        career_stage = demographics.get("careerStage", "your career stage")
        primary_goal = demographics.get("primaryGoal", "personal growth")

        # Extract life pillar satisfaction
        life_pillars = demographics.get("lifePillars", {})
        career_sat = life_pillars.get("career", "Not specified")
        relationship_sat = life_pillars.get("relationships", "Not specified")
        health_sat = life_pillars.get("health", "Not specified")
        financial_sat = life_pillars.get("finances", "Not specified")
        growth_sat = life_pillars.get("growth", "Not specified")

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

PERSON YOU'RE ANALYZING:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Name: {name}
Age: {age}
Career: {career} ({career_stage})
Primary Goal: {primary_goal}

CURRENT LIFE SATISFACTION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💼 Work/Studies: {career_sat}
❤️ Relationships: {relationship_sat}
🏥 Health: {health_sat}
💰 Finances: {financial_sat}
🌱 Personal Growth: {growth_sat}

BIG FIVE PERSONALITY PROFILE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Openness to Experience: {openness_score:.1f}/100 ({get_level(openness_score)}) — {openness_pct:.0f}th percentile
Conscientiousness: {conscientiousness_score:.1f}/100 ({get_level(conscientiousness_score)}) — {conscientiousness_pct:.0f}th percentile
Extraversion: {extraversion_score:.1f}/100 ({get_level(extraversion_score)}) — {extraversion_pct:.0f}th percentile
Agreeableness: {agreeableness_score:.1f}/100 ({get_level(agreeableness_score)}) — {agreeableness_pct:.0f}th percentile
Emotional Stability: {100 - neuroticism_score:.1f}/100 ({get_level(100 - neuroticism_score)}) — {100 - neuroticism_pct:.0f}th percentile

YOUR MISSION:
Create a comprehensive, deeply personalized productivity and self-development analysis that will genuinely transform {name}'s life. This is NOT a generic report - you have their EXACT personality scores AND their current life satisfaction across all domains. Use this to create insights that feel like you've known them for years.

CRITICAL REQUIREMENTS:
1. Address {name} by name throughout (use "you" and "your" but sprinkle their name 3-5 times)
2. Reference their SPECIFIC life pillar satisfaction (career, relationships, health, finances, growth)
3. Connect personality traits to their ACTUAL current challenges
4. Make every recommendation actionable for their {career_stage} in {career}
5. Speak to their primary goal: {primary_goal}
6. Be deeply empathetic about struggles (e.g., if they hate their job, acknowledge the pain)
7. Write like a $10,000 executive coaching session - transformative, not generic

REQUIRED OUTPUT FORMAT (Use EXACT Markdown structure with ## and ### headers, ** for bold, - for lists):

## QUOTE
[Select ONE profound quote (15-25 words) that perfectly captures {name}'s personality essence AND current life situation. Choose from philosophers, psychologists, authors, or thought leaders. Format: "Quote text" — Author Name]

## 🎯 {name}, Here's Your Unique Personality Blueprint

[2-3 sentences that capture the ESSENCE of this specific combination AND their current life context. Reference at least ONE life pillar. Example: "You are a strategic visionary who operates at the intersection of creativity and discipline, which explains why you feel {career_sat} about your work - your personality craves both innovation and structure..." Make it profound and personally resonant.]

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
**Current Status:** {career_sat}

[CRITICAL: Start by acknowledging their current career satisfaction. If negative (hate/dislike), be deeply empathetic. If positive (love/like), celebrate it. Then provide 4-5 sentences about:
- WHY their personality explains their current career feelings
- Specific career moves aligned with their traits
- Ideal roles/industries for {career} at {career_stage}
- Work environment preferences
- Concrete next steps for their {primary_goal}]

**Recommended Resources:**
- **Book**: [Title by Author] - [Why perfect for {name}'s profile + career stage]
- **YouTube**: [Channel Name] - [Specific skills they'll gain]
- **Action**: [One concrete action for THIS WEEK]

### ❤️ Relationships & Communication
**Current Status:** {relationship_sat}

[CRITICAL: Acknowledge their relationship satisfaction. Connect their personality traits to relationship patterns. 4-5 sentences about:
- How their agreeableness + extraversion show up in relationships
- Why they might feel the way they do currently
- Communication style and conflict patterns
- What they need from partners/friends
- Specific advice for improving connections]

**Recommended Resources:**
- **Book**: [Relationship book for their agreeableness level]
- **YouTube**: [Relationship channel]
- **Action**: [One concrete action for THIS WEEK]

### 🏥 Health & Stress Management
**Current Status:** {health_sat}

[CRITICAL: Acknowledge their health status with empathy. 4-5 sentences about:
- How their emotional stability affects stress response
- Physical/mental health patterns for their profile
- Why they might feel burned out/energized
- Best stress relief for THEIR personality
- Sleep, exercise, recovery needs]

**Recommended Resources:**
- **Book**: [Health book for their stress level]
- **YouTube**: [Wellness channel]
- **Action**: [One concrete action for THIS WEEK]

### 💰 Wealth & Financial Success
**Current Status:** {financial_sat}

[CRITICAL: Acknowledge financial stress/comfort. 4-5 sentences about:
- How conscientiousness affects money habits
- Spending/saving patterns for their profile
- Risk tolerance (openness + emotional stability)
- Why they feel this way financially
- Practical money moves for {career_stage}]

**Recommended Resources:**
- **Book**: [Finance book for their situation]
- **YouTube**: [Financial channel]
- **Action**: [One concrete action for THIS WEEK]

### 🌱 Personal Growth & Learning
**Current Status:** {growth_sat}

[CRITICAL: Acknowledge growth feelings. 4-5 sentences about:
- How openness affects learning style
- Why they feel stagnant/thriving
- Best growth strategies for their profile
- Learning pace and methods
- Path from current state to transformation]

**Recommended Resources:**
- **Book**: [Growth book for their openness level]
- **YouTube**: [Learning channel]
- **Action**: [One concrete action for THIS WEEK]

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

## 💎 Final Insight for {name}

[One profound, memorable takeaway that synthesizes EVERYTHING - their personality, current life situation, and transformation potential. Address {name} directly. Reference at least ONE life pillar. Make them feel DEEPLY SEEN and EMPOWERED. 3-4 sentences maximum. This should be the most powerful paragraph in the entire report.]

CRITICAL GUIDELINES FOR THE ENTIRE REPORT:
1. **USE THEIR NAME**: Address {name} by name 3-5 times throughout the report
2. **REFERENCE LIFE PILLARS**: Explicitly mention their career, relationship, health, financial, and growth satisfaction
3. **BE DEEPLY EMPATHETIC**: If they're struggling (hate job, isolated, burned out, stressed), acknowledge the PAIN first
4. **CONNECT DOTS**: Show how personality traits EXPLAIN their current life satisfaction
5. **Write like a human friend, not a robot**: Use contractions ("you're", "don't"), colloquial language
6. **Analyze INTERACTIONS**: Never describe traits in isolation - show how they combine with life context
7. **Be ULTRA-SPECIFIC**: Use exact scores, percentiles, time blocks, concrete examples for {career} at {career_stage}
8. **Sound like you're reading their mind**: "You probably...", "You might notice...", "When X happens, you tend to..."
9. **Include REAL resources**: Actual book titles and YouTube channels that exist and match their profile
10. **Balance warmth with honesty**: Affirm strengths genuinely, address weaknesses compassionately
11. **Focus on PRODUCTIVITY**: This is for the Focused Room extension - tie everything to focus and work
12. **Make it personal**: Reference {career}, {age}, {career_stage}, and their {primary_goal}
13. **Use second person with name**: "You are...", "{name}, you...", never "they" or "one"
14. **$10,000 consultation quality**: Every sentence must provide unique, actionable value
15. **NO GENERIC FLUFF**: Every insight must be traceable to their specific data

TONE EXAMPLES:
❌ BAD: "Individuals with this profile tend to exhibit characteristics..."
✅ GOOD: "You're the person who color-codes their calendar but also keeps a 'creative chaos' folder for inspiration. That's not contradictory — it's your superpower."

❌ BAD: "Consider implementing structured time management"
✅ GOOD: "Try time-blocking your mornings in 90-minute chunks. Your conscientiousness loves the structure, but leave your afternoons loose — that's when your openness needs room to explore."

❌ BAD: "You may be experiencing career dissatisfaction."
✅ GOOD: "{name}, the fact that you feel {career_sat} about your work makes complete sense given your {conscientiousness_score:.0f}/100 conscientiousness - you crave structure and achievement, and your current role isn't providing that."

Length: 1500-2000 words. NO LENGTH LIMIT if needed to be comprehensive. Dense. Valuable. Transformative. This is a $10,000 report."""

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
    demographics: dict = None,
    fallback: bool = True,
) -> str:
    """
    Convenience function to generate personality suggestions.

    Args:
        scores: Dictionary of Big Five trait scores (0-100)
        percentiles: Dictionary of Big Five trait percentiles (0-100)
        demographics: User demographic and life pillar data (optional)
        fallback: Whether to use fallback if API fails (default: True)

    Returns:
        String containing personality suggestions
    """
    client = get_gemini_client()
    return client.generate_personality_suggestions(scores, percentiles, demographics or {})
