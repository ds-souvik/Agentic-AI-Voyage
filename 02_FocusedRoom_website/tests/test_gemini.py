"""
Unit tests for Gemini AI client functionality.

Tests cover:
- Gemini API integration with mocked responses
- Fallback mechanism when API unavailable
- Error handling and retry logic
- Timeout and rate limiting behavior
- Provider determination logic
"""

import os
from unittest.mock import Mock, patch

from app.utils.gemini_client import (
    GeminiClient,
    generate_personality_suggestions,
    get_gemini_client,
)


class TestGeminiClientInitialization:
    """Test suite for GeminiClient initialization and configuration."""

    @patch.dict(os.environ, {"GEMINI_API_KEY": "test-api-key"}, clear=False)
    @patch("app.utils.gemini_client.GEMINI_AVAILABLE", True)
    @patch("app.utils.gemini_client.genai")
    def test_initialization_with_valid_api_key(self, mock_genai):
        """Test client initializes correctly with valid API key."""
        mock_model = Mock()
        mock_genai.GenerativeModel.return_value = mock_model

        client = GeminiClient()

        assert client.provider == "gemini"
        assert client.api_key == "test-api-key"
        assert client.model == mock_model
        mock_genai.configure.assert_called_once_with(api_key="test-api-key")

    @patch.dict(os.environ, {}, clear=True)
    @patch("app.utils.gemini_client.GEMINI_AVAILABLE", True)
    def test_initialization_without_api_key(self):
        """Test client falls back when API key is missing."""
        client = GeminiClient()

        assert client.provider == "fallback"
        assert client.model is None

    @patch.dict(os.environ, {"GEMINI_API_KEY": "   "}, clear=False)
    @patch("app.utils.gemini_client.GEMINI_AVAILABLE", True)
    def test_initialization_with_empty_api_key(self):
        """Test client falls back when API key is empty/whitespace."""
        client = GeminiClient()

        assert client.provider == "fallback"

    @patch("app.utils.gemini_client.GEMINI_AVAILABLE", False)
    def test_initialization_without_genai_package(self):
        """Test client falls back when google-generativeai not installed."""
        client = GeminiClient()

        assert client.provider == "fallback"
        assert client.model is None


class TestGeminiAPIIntegration:
    """Test suite for Gemini API calls and response handling."""

    @patch.dict(os.environ, {"GEMINI_API_KEY": "test-key"}, clear=False)
    @patch("app.utils.gemini_client.GEMINI_AVAILABLE", True)
    @patch("app.utils.gemini_client.genai")
    def test_successful_api_call(self, mock_genai):
        """Test successful Gemini API call returns suggestions."""
        # Setup
        mock_response = Mock()
        mock_response.text = "Your personality profile shows high openness and creativity."
        mock_model = Mock()
        mock_model.generate_content.return_value = mock_response
        mock_genai.GenerativeModel.return_value = mock_model

        client = GeminiClient()
        scores = {
            "openness": 85.0,
            "conscientiousness": 60.0,
            "extraversion": 45.0,
            "agreeableness": 70.0,
            "neuroticism": 35.0,
        }
        percentiles = {
            "openness": 92.0,
            "conscientiousness": 55.0,
            "extraversion": 40.0,
            "agreeableness": 75.0,
            "neuroticism": 30.0,
        }

        # Execute
        result = client.generate_personality_suggestions(scores, percentiles)

        # Assert
        assert "openness" in result.lower()
        assert mock_model.generate_content.called
        call_args = mock_model.generate_content.call_args
        prompt = call_args[0][0]
        assert "85.0" in prompt  # Check scores in prompt
        assert "92" in prompt  # Check percentiles in prompt

    @patch.dict(os.environ, {"GEMINI_API_KEY": "test-key"}, clear=False)
    @patch("app.utils.gemini_client.GEMINI_AVAILABLE", True)
    @patch("app.utils.gemini_client.genai")
    def test_api_call_with_retry_logic(self, mock_genai):
        """Test retry logic when API call fails initially."""
        # Setup - fail first attempt, succeed second
        mock_response = Mock()
        mock_response.text = "Retry successful response"
        mock_model = Mock()
        mock_model.generate_content.side_effect = [
            Exception("API timeout"),
            mock_response,
        ]
        mock_genai.GenerativeModel.return_value = mock_model

        client = GeminiClient()
        scores = {"openness": 50.0, "conscientiousness": 50.0}
        percentiles = {"openness": 50.0, "conscientiousness": 50.0}

        # Execute
        with patch("time.sleep"):  # Speed up test
            result = client.generate_personality_suggestions(scores, percentiles, max_retries=2)

        # Assert
        assert result == "Retry successful response"
        assert mock_model.generate_content.call_count == 2

    @patch.dict(os.environ, {"GEMINI_API_KEY": "test-key"}, clear=False)
    @patch("app.utils.gemini_client.GEMINI_AVAILABLE", True)
    @patch("app.utils.gemini_client.genai")
    def test_api_exhausts_retries_falls_back(self, mock_genai):
        """Test fallback when all API retry attempts fail."""
        # Setup - all attempts fail
        mock_model = Mock()
        mock_model.generate_content.side_effect = Exception("Persistent API error")
        mock_genai.GenerativeModel.return_value = mock_model

        client = GeminiClient()
        scores = {"openness": 75.0}
        percentiles = {"openness": 80.0}

        # Execute
        with patch("time.sleep"):  # Speed up test
            result = client.generate_personality_suggestions(scores, percentiles, max_retries=2)

        # Assert - should contain fallback suggestions
        assert "personality" in result.lower() or "openness" in result.lower()
        assert len(result) > 50  # Fallback provides substantial content

    @patch.dict(os.environ, {"GEMINI_API_KEY": "test-key"}, clear=False)
    @patch("app.utils.gemini_client.GEMINI_AVAILABLE", True)
    @patch("app.utils.gemini_client.genai")
    def test_empty_response_handling(self, mock_genai):
        """Test handling of empty/None response from API."""
        # Setup
        mock_response = Mock()
        mock_response.text = None  # Empty response
        mock_model = Mock()
        mock_model.generate_content.return_value = mock_response
        mock_genai.GenerativeModel.return_value = mock_model

        client = GeminiClient()
        scores = {"openness": 50.0}
        percentiles = {"openness": 50.0}

        # Execute
        with patch("time.sleep"):
            result = client.generate_personality_suggestions(scores, percentiles, max_retries=2)

        # Assert - should fall back
        assert len(result) > 0
        assert "personality" in result.lower()


class TestFallbackSuggestions:
    """Test suite for fallback suggestion generation."""

    def test_fallback_with_high_scores(self):
        """Test fallback generates appropriate suggestions for high scores."""
        client = GeminiClient()
        client.provider = "fallback"  # Force fallback

        scores = {
            "openness": 85.0,
            "conscientiousness": 90.0,
            "extraversion": 25.0,
            "agreeableness": 80.0,
            "neuroticism": 20.0,
        }
        percentiles = dict(scores)

        result = client._generate_fallback_suggestions(scores, percentiles)

        assert "openness" in result.lower()
        assert "conscientiousness" in result.lower()
        assert len(result) > 100  # Substantial content

    def test_fallback_with_low_scores(self):
        """Test fallback generates appropriate suggestions for low scores."""
        client = GeminiClient()
        client.provider = "fallback"

        scores = {
            "openness": 25.0,
            "conscientiousness": 30.0,
            "extraversion": 85.0,
            "agreeableness": 35.0,
            "neuroticism": 75.0,
        }
        percentiles = dict(scores)

        result = client._generate_fallback_suggestions(scores, percentiles)

        assert "openness" in result.lower()
        assert "productivity" in result.lower()
        assert len(result) > 100

    def test_fallback_with_balanced_scores(self):
        """Test fallback with all medium/balanced scores."""
        client = GeminiClient()
        client.provider = "fallback"

        scores = {
            "openness": 50.0,
            "conscientiousness": 55.0,
            "extraversion": 45.0,
            "agreeableness": 52.0,
            "neuroticism": 48.0,
        }
        percentiles = dict(scores)

        result = client._generate_fallback_suggestions(scores, percentiles)

        assert len(result) > 50
        assert "personality" in result.lower()


class TestPromptGeneration:
    """Test suite for Gemini API prompt construction."""

    def test_prompt_includes_all_scores(self):
        """Test that prompt includes all Big Five scores."""
        client = GeminiClient()

        scores = {
            "openness": 75.5,
            "conscientiousness": 60.2,
            "extraversion": 45.8,
            "agreeableness": 70.1,
            "neuroticism": 35.9,
        }
        percentiles = {
            "openness": 80.0,
            "conscientiousness": 55.0,
            "extraversion": 40.0,
            "agreeableness": 75.0,
            "neuroticism": 30.0,
        }

        prompt = client._build_gemini_prompt(scores, percentiles)

        # Check all traits are in prompt
        for trait in [
            "openness",
            "conscientiousness",
            "extraversion",
            "agreeableness",
            "neuroticism",
        ]:
            assert trait.lower() in prompt.lower()

        # Check scores are included
        assert "75.5" in prompt
        assert "60.2" in prompt

        # Check percentiles are included
        assert "80%" in prompt or "80" in prompt
        assert "55%" in prompt or "55" in prompt

    def test_prompt_includes_instructions(self):
        """Test that prompt includes clear instructions for AI."""
        client = GeminiClient()

        scores = {"openness": 50.0, "conscientiousness": 50.0}
        percentiles = {"openness": 50.0, "conscientiousness": 50.0}

        prompt = client._build_gemini_prompt(scores, percentiles)

        # Check for key instruction elements
        assert "personality" in prompt.lower()
        assert "suggestions" in prompt.lower() or "advice" in prompt.lower()
        assert "focused room" in prompt.lower()


class TestSingletonPattern:
    """Test suite for singleton client instance management."""

    def test_get_gemini_client_returns_same_instance(self):
        """Test that get_gemini_client returns singleton instance."""
        client1 = get_gemini_client()
        client2 = get_gemini_client()

        assert client1 is client2

    @patch("app.utils.gemini_client._gemini_client_instance", None)
    def test_get_gemini_client_creates_new_if_none(self):
        """Test that singleton is created if not exists."""
        client = get_gemini_client()

        assert client is not None
        assert isinstance(client, GeminiClient)


class TestConvenienceFunction:
    """Test suite for generate_personality_suggestions convenience function."""

    @patch("app.utils.gemini_client.get_gemini_client")
    def test_convenience_function_calls_client(self, mock_get_client):
        """Test that convenience function properly delegates to client."""
        mock_client = Mock()
        mock_client.generate_personality_suggestions.return_value = "Test suggestions"
        mock_get_client.return_value = mock_client

        scores = {"openness": 70.0}
        percentiles = {"openness": 75.0}

        result = generate_personality_suggestions(scores, percentiles, fallback=True)

        assert result == "Test suggestions"
        mock_client.generate_personality_suggestions.assert_called_once_with(scores, percentiles)


class TestEdgeCases:
    """Test suite for edge cases and error conditions."""

    def test_missing_trait_in_scores(self):
        """Test handling of missing traits in scores dict."""
        client = GeminiClient()
        client.provider = "fallback"

        scores = {"openness": 75.0}  # Missing other traits
        percentiles = {"openness": 80.0}

        result = client._generate_fallback_suggestions(scores, percentiles)

        assert len(result) > 0
        assert "openness" in result.lower()

    def test_extreme_score_values(self):
        """Test handling of edge case score values."""
        client = GeminiClient()
        client.provider = "fallback"

        scores = {
            "openness": 0.0,
            "conscientiousness": 100.0,
            "extraversion": 50.0,
            "agreeableness": 0.0,
            "neuroticism": 100.0,
        }
        percentiles = scores.copy()

        result = client._generate_fallback_suggestions(scores, percentiles)

        assert len(result) > 50
        assert "personality" in result.lower()

    @patch.dict(os.environ, {"GEMINI_API_KEY": "test-key"}, clear=False)
    @patch("app.utils.gemini_client.GEMINI_AVAILABLE", True)
    @patch("app.utils.gemini_client.genai")
    def test_initialization_error_falls_back_gracefully(self, mock_genai):
        """Test graceful fallback when Gemini initialization fails."""
        mock_genai.configure.side_effect = Exception("API configuration error")

        client = GeminiClient()

        assert client.provider == "fallback"
        assert client.model is None
