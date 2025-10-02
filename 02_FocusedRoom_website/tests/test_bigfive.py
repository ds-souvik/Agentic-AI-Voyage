"""
Unit tests for Big Five personality scoring module.

Tests cover:
- Valid input scenarios (44 and 50 questions)
- Edge cases (all min, all max, mixed values)
- Invalid inputs (wrong length, non-numeric, out of range)
- Helper functions (validation, interpretation)
"""

import pytest

from app.utils.bigfive import (
    TRAITS,
    compute_bigfive_scores,
    get_trait_interpretation,
    validate_answers,
)


class TestComputeBigFiveScores:
    """Test suite for compute_bigfive_scores function."""

    def test_valid_44_questions_all_neutral(self):
        """Test with 44 neutral responses (all 3s)."""
        answers = [3] * 44
        result = compute_bigfive_scores(answers)

        assert result["valid"] is True
        assert "scores" in result
        assert "percentiles" in result
        assert "raw_scores" in result

        # All scores should be 50 (middle of 0-100 scale)
        for trait in TRAITS:
            assert trait in result["scores"]
            assert 45 <= result["scores"][trait] <= 55  # Allow small variance

    def test_valid_50_questions_all_neutral(self):
        """Test with 50 neutral responses (all 3s)."""
        answers = [3] * 50
        result = compute_bigfive_scores(answers)

        assert result["valid"] is True
        assert len(result["scores"]) == 5

        for trait in TRAITS:
            assert 45 <= result["scores"][trait] <= 55

    def test_valid_44_questions_all_minimum(self):
        """Test with all minimum values (all 1s)."""
        answers = [1] * 44
        result = compute_bigfive_scores(answers)

        assert result["valid"] is True
        for trait in TRAITS:
            assert result["scores"][trait] == 0.0

    def test_valid_44_questions_all_maximum(self):
        """Test with all maximum values (all 5s)."""
        answers = [5] * 44
        result = compute_bigfive_scores(answers)

        assert result["valid"] is True
        for trait in TRAITS:
            assert result["scores"][trait] == 100.0

    def test_valid_44_questions_mixed_values(self):
        """Test with realistic mixed responses."""
        # Simulate varied responses
        answers = [
            4,
            2,
            5,
            3,
            4,
            2,
            1,
            5,
            3,
            4,
            3,
            2,
            5,
            4,
            3,
            2,
            4,
            5,
            3,
            4,
            2,
            3,
            5,
            4,
            3,
            2,
            4,
            5,
            3,
            4,
            2,
            3,
            4,
            5,
            3,
            2,
            4,
            5,
            3,
            4,
            2,
            3,
            4,
            5,
        ]

        result = compute_bigfive_scores(answers)

        assert result["valid"] is True
        assert len(result["scores"]) == 5

        # All scores should be in valid range
        for trait in TRAITS:
            assert 0 <= result["scores"][trait] <= 100
            assert 0 <= result["percentiles"][trait] <= 100

    def test_valid_50_questions_mixed_values(self):
        """Test with 50 mixed responses."""
        answers = [
            3,
            4,
            2,
            5,
            3,
            4,
            2,
            1,
            5,
            3,
            4,
            3,
            2,
            5,
            4,
            3,
            2,
            4,
            5,
            3,
            4,
            2,
            3,
            5,
            4,
            3,
            2,
            4,
            5,
            3,
            4,
            2,
            3,
            4,
            5,
            3,
            2,
            4,
            5,
            3,
            4,
            2,
            3,
            4,
            5,
            3,
            2,
            4,
            5,
            3,
        ]

        result = compute_bigfive_scores(answers)

        assert result["valid"] is True
        assert len(result["scores"]) == 5

    def test_invalid_length_too_short(self):
        """Test with too few answers."""
        answers = [3] * 30

        with pytest.raises(ValueError, match="Expected 44 or 50 answers"):
            compute_bigfive_scores(answers)

    def test_invalid_length_too_long(self):
        """Test with too many answers."""
        answers = [3] * 60

        with pytest.raises(ValueError, match="Expected 44 or 50 answers"):
            compute_bigfive_scores(answers)

    def test_invalid_non_numeric_values(self):
        """Test with non-numeric values."""
        answers = [3] * 43 + ["invalid"]

        with pytest.raises(ValueError, match="must be numeric"):
            compute_bigfive_scores(answers)

    def test_invalid_out_of_range_low(self):
        """Test with values below valid range."""
        answers = [0] * 44  # 0 is below minimum of 1

        with pytest.raises(ValueError, match="must be in the range 1-5"):
            compute_bigfive_scores(answers)

    def test_invalid_out_of_range_high(self):
        """Test with values above valid range."""
        answers = [6] * 44  # 6 is above maximum of 5

        with pytest.raises(ValueError, match="must be in the range 1-5"):
            compute_bigfive_scores(answers)

    def test_invalid_not_a_list(self):
        """Test with non-list input."""
        with pytest.raises(ValueError, match="must be a list"):
            compute_bigfive_scores("not a list")

    def test_float_values_accepted(self):
        """Test that float values are accepted."""
        answers = [3.5] * 44
        result = compute_bigfive_scores(answers)

        assert result["valid"] is True

    def test_scores_structure(self):
        """Test that result structure contains all required keys."""
        answers = [3] * 44
        result = compute_bigfive_scores(answers)

        assert "valid" in result
        assert "scores" in result
        assert "percentiles" in result
        assert "raw_scores" in result

        # Check all traits are present
        for trait in TRAITS:
            assert trait in result["scores"]
            assert trait in result["percentiles"]
            assert trait in result["raw_scores"]

    def test_percentiles_in_valid_range(self):
        """Test that percentiles are always 0-100."""
        test_cases = [
            [1] * 44,  # All minimum
            [5] * 44,  # All maximum
            [3] * 44,  # All neutral
            [1, 2, 3, 4] * 11,  # Varied pattern (44 total)
        ]

        for answers in test_cases:
            result = compute_bigfive_scores(answers)
            for trait in TRAITS:
                percentile = result["percentiles"][trait]
                assert 0 <= percentile <= 100, f"Percentile for {trait} out of range: {percentile}"


class TestGetTraitInterpretation:
    """Test suite for get_trait_interpretation function."""

    def test_very_low_score(self):
        """Test interpretation of very low score."""
        result = get_trait_interpretation("openness", 10)
        assert "very low" in result.lower()
        assert "openness" in result.lower()

    def test_low_score(self):
        """Test interpretation of low score."""
        result = get_trait_interpretation("conscientiousness", 30)
        assert "low" in result.lower()

    def test_moderate_score(self):
        """Test interpretation of moderate score."""
        result = get_trait_interpretation("extraversion", 50)
        assert "moderate" in result.lower()

    def test_high_score(self):
        """Test interpretation of high score."""
        result = get_trait_interpretation("agreeableness", 70)
        assert "high" in result.lower()

    def test_very_high_score(self):
        """Test interpretation of very high score."""
        result = get_trait_interpretation("neuroticism", 90)
        assert "very high" in result.lower()

    def test_boundary_values(self):
        """Test boundary values for score ranges."""
        boundaries = [0, 20, 40, 60, 80, 100]
        for score in boundaries:
            result = get_trait_interpretation("openness", score)
            assert isinstance(result, str)
            assert len(result) > 0


class TestValidateAnswers:
    """Test suite for validate_answers function."""

    def test_valid_44_answers(self):
        """Test validation of valid 44-answer list."""
        answers = [3] * 44
        is_valid, error = validate_answers(answers)

        assert is_valid is True
        assert error is None

    def test_valid_50_answers(self):
        """Test validation of valid 50-answer list."""
        answers = [3] * 50
        is_valid, error = validate_answers(answers)

        assert is_valid is True
        assert error is None

    def test_invalid_length(self):
        """Test validation fails with wrong length."""
        answers = [3] * 40
        is_valid, error = validate_answers(answers)

        assert is_valid is False
        assert "44 or 50" in error

    def test_invalid_non_numeric(self):
        """Test validation fails with non-numeric values."""
        answers = [3] * 43 + ["text"]
        is_valid, error = validate_answers(answers)

        assert is_valid is False
        assert "numeric" in error.lower()

    def test_invalid_out_of_range(self):
        """Test validation fails with out-of-range values."""
        answers = [6] * 44
        is_valid, error = validate_answers(answers)

        assert is_valid is False
        assert "range" in error.lower()

    def test_invalid_not_list(self):
        """Test validation fails with non-list input."""
        is_valid, error = validate_answers("not a list")

        assert is_valid is False
        assert "list" in error.lower()

    def test_edge_case_empty_list(self):
        """Test validation fails with empty list."""
        is_valid, error = validate_answers([])

        assert is_valid is False
        assert error is not None


class TestEdgeCases:
    """Test suite for edge cases and boundary conditions."""

    def test_extreme_variance(self):
        """Test with alternating extreme values."""
        answers = [1, 5] * 22  # 44 total, alternating min/max
        result = compute_bigfive_scores(answers)

        assert result["valid"] is True
        # Should result in moderate scores (mean of extremes)
        for trait in TRAITS:
            assert 40 <= result["scores"][trait] <= 60

    def test_string_numeric_values(self):
        """Test that string numbers are converted."""
        answers = ["3"] * 44
        result = compute_bigfive_scores(answers)

        assert result["valid"] is True

    def test_mixed_int_float(self):
        """Test with mixed int and float values."""
        answers = [3, 3.5, 4, 2.5] * 11  # 44 total
        result = compute_bigfive_scores(answers)

        assert result["valid"] is True
        for trait in TRAITS:
            assert 0 <= result["scores"][trait] <= 100
