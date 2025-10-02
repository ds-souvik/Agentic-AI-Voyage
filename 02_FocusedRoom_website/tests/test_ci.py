"""
Unit tests for CI/CD configuration and code quality checks.
Tests configuration files and ensures CI/CD pipeline requirements are met.
"""

import subprocess
from pathlib import Path

import pytest


class TestConfigurationFiles:
    """Test that all required configuration files exist and are valid."""

    def test_github_actions_workflow_exists(self):
        """Test that GitHub Actions workflow file exists."""
        workflow_path = Path(".github/workflows/ci.yml")
        assert workflow_path.exists(), "GitHub Actions workflow file not found"
        assert workflow_path.is_file(), "Workflow path is not a file"

    def test_pre_commit_config_exists(self):
        """Test that pre-commit configuration exists."""
        config_path = Path(".pre-commit-config.yaml")
        assert config_path.exists(), "Pre-commit config not found"
        assert config_path.is_file(), "Pre-commit config is not a file"

    def test_pyproject_toml_exists(self):
        """Test that pyproject.toml exists."""
        pyproject_path = Path("pyproject.toml")
        assert pyproject_path.exists(), "pyproject.toml not found"
        assert pyproject_path.is_file(), "pyproject.toml is not a file"

    def test_flake8_config_exists(self):
        """Test that .flake8 configuration exists."""
        flake8_path = Path(".flake8")
        assert flake8_path.exists(), ".flake8 config not found"
        assert flake8_path.is_file(), ".flake8 config is not a file"

    def test_gitignore_exists(self):
        """Test that .gitignore exists."""
        gitignore_path = Path(".gitignore")
        assert gitignore_path.exists(), ".gitignore not found"
        assert gitignore_path.is_file(), ".gitignore is not a file"


class TestPyprojectToml:
    """Test pyproject.toml configuration."""

    def test_pyproject_toml_is_valid(self):
        """Test that pyproject.toml is valid TOML."""
        try:
            import tomli
        except ImportError:
            # Python 3.11+ has tomllib built-in
            import tomllib as tomli

        pyproject_path = Path("pyproject.toml")
        with open(pyproject_path, "rb") as f:
            config = tomli.load(f)

        # Check essential sections exist
        assert "build-system" in config
        assert "project" in config
        assert "tool" in config

    def test_black_configuration(self):
        """Test that Black is configured."""
        try:
            import tomli
        except ImportError:
            import tomllib as tomli

        pyproject_path = Path("pyproject.toml")
        with open(pyproject_path, "rb") as f:
            config = tomli.load(f)

        assert "tool" in config
        assert "black" in config["tool"]
        assert config["tool"]["black"]["line-length"] == 100

    def test_pytest_configuration(self):
        """Test that pytest is configured."""
        try:
            import tomli
        except ImportError:
            import tomllib as tomli

        pyproject_path = Path("pyproject.toml")
        with open(pyproject_path, "rb") as f:
            config = tomli.load(f)

        assert "tool" in config
        assert "pytest" in config["tool"]
        assert "ini_options" in config["tool"]["pytest"]


class TestPreCommitConfig:
    """Test pre-commit configuration."""

    def test_precommit_yaml_is_valid(self):
        """Test that pre-commit YAML is valid."""
        import yaml

        config_path = Path(".pre-commit-config.yaml")
        with open(config_path) as f:
            config = yaml.safe_load(f)

        assert "repos" in config
        assert len(config["repos"]) > 0

    def test_precommit_has_required_hooks(self):
        """Test that essential pre-commit hooks are configured."""
        import yaml

        config_path = Path(".pre-commit-config.yaml")
        with open(config_path) as f:
            config = yaml.safe_load(f)

        # Extract all hook IDs
        hook_ids = []
        for repo in config["repos"]:
            for hook in repo.get("hooks", []):
                hook_ids.append(hook["id"])

        # Check for essential hooks
        assert "black" in hook_ids, "Black hook not found"
        assert "flake8" in hook_ids, "Flake8 hook not found"
        assert "isort" in hook_ids, "isort hook not found"
        assert "trailing-whitespace" in hook_ids, "Trailing whitespace hook not found"


class TestGitHubActionsWorkflow:
    """Test GitHub Actions workflow configuration."""

    def test_workflow_yaml_is_valid(self):
        """Test that workflow YAML is valid."""
        import yaml

        workflow_path = Path(".github/workflows/ci.yml")
        with open(workflow_path) as f:
            workflow = yaml.safe_load(f)

        assert "name" in workflow
        assert "on" in workflow
        assert "jobs" in workflow

    def test_workflow_has_required_jobs(self):
        """Test that workflow has essential jobs."""
        import yaml

        workflow_path = Path(".github/workflows/ci.yml")
        with open(workflow_path) as f:
            workflow = yaml.safe_load(f)

        jobs = workflow["jobs"]

        # Check for required jobs
        assert "test" in jobs, "Test job not found"
        assert "lint" in jobs, "Lint job not found"
        assert "build" in jobs, "Build job not found"

    def test_workflow_tests_multiple_python_versions(self):
        """Test that workflow tests multiple Python versions."""
        import yaml

        workflow_path = Path(".github/workflows/ci.yml")
        with open(workflow_path) as f:
            workflow = yaml.safe_load(f)

        test_job = workflow["jobs"]["test"]

        assert "strategy" in test_job
        assert "matrix" in test_job["strategy"]
        assert "python-version" in test_job["strategy"]["matrix"]

        versions = test_job["strategy"]["matrix"]["python-version"]
        assert len(versions) >= 3, "Should test at least 3 Python versions"


class TestCodeQualityTools:
    """Test that code quality tools are available and configured."""

    def test_pytest_is_available(self):
        """Test that pytest is installed."""
        result = subprocess.run(["pytest", "--version"], capture_output=True, text=True)
        assert result.returncode == 0, "pytest not available"
        assert "pytest" in result.stdout.lower()

    def test_black_is_available(self):
        """Test that black is installed."""
        result = subprocess.run(["black", "--version"], capture_output=True, text=True)
        assert result.returncode == 0, "black not available"
        assert "black" in result.stdout.lower()

    def test_flake8_is_available(self):
        """Test that flake8 is installed."""
        result = subprocess.run(["flake8", "--version"], capture_output=True, text=True)
        assert result.returncode == 0, "flake8 not available"
        assert "flake8" in result.stdout.lower() or "flake8" in result.stderr.lower()

    def test_isort_is_available(self):
        """Test that isort is installed."""
        result = subprocess.run(["isort", "--version"], capture_output=True, text=True)
        assert result.returncode == 0, "isort not available"

    def test_ruff_is_available(self):
        """Test that ruff is installed."""
        result = subprocess.run(["ruff", "--version"], capture_output=True, text=True)
        assert result.returncode == 0, "ruff not available"
        assert "ruff" in result.stdout.lower()


class TestProjectStructure:
    """Test that project structure meets CI/CD requirements."""

    def test_tests_directory_exists(self):
        """Test that tests directory exists."""
        tests_dir = Path("tests")
        assert tests_dir.exists(), "Tests directory not found"
        assert tests_dir.is_dir(), "Tests path is not a directory"

    def test_app_directory_exists(self):
        """Test that app directory exists."""
        app_dir = Path("app")
        assert app_dir.exists(), "App directory not found"
        assert app_dir.is_dir(), "App path is not a directory"

    def test_requirements_file_exists(self):
        """Test that requirements.txt exists."""
        req_path = Path("requirements.txt")
        assert req_path.exists(), "requirements.txt not found"
        assert req_path.is_file(), "requirements.txt is not a file"

    def test_readme_exists(self):
        """Test that README.md exists."""
        readme_path = Path("README.md")
        assert readme_path.exists(), "README.md not found"
        assert readme_path.is_file(), "README.md is not a file"

    def test_all_test_files_follow_naming_convention(self):
        """Test that all test files start with 'test_'."""
        tests_dir = Path("tests")
        test_files = list(tests_dir.glob("*.py"))

        for test_file in test_files:
            if test_file.name != "__init__.py":
                assert test_file.name.startswith(
                    "test_"
                ), f"Test file {test_file.name} doesn't follow naming convention"


class TestCoverageConfiguration:
    """Test that test coverage is properly configured."""

    def test_coverage_can_run(self):
        """Test that pytest can run with coverage."""
        result = subprocess.run(
            ["pytest", "--cov=app", "--cov-report=term", "tests/test_ci.py", "-v"],
            capture_output=True,
            text=True,
        )
        # Should not fail (returncode 0 or 5 for no tests collected is okay)
        assert result.returncode in [0, 5], "Coverage run failed"

    def test_coverage_config_in_pyproject(self):
        """Test that coverage is configured in pyproject.toml."""
        try:
            import tomli
        except ImportError:
            import tomllib as tomli

        pyproject_path = Path("pyproject.toml")
        with open(pyproject_path, "rb") as f:
            config = tomli.load(f)

        assert "tool" in config
        assert "coverage" in config["tool"]
        assert "run" in config["tool"]["coverage"]
        assert "report" in config["tool"]["coverage"]


class TestEnvironmentSetup:
    """Test that the environment is properly set up."""

    def test_python_version_is_supported(self):
        """Test that Python version is 3.9 or higher."""
        import sys

        version = sys.version_info
        assert version.major == 3, "Python 3 required"
        assert version.minor >= 9, "Python 3.9 or higher required"

    def test_all_required_packages_installed(self):
        """Test that essential packages can be imported."""
        required_packages = [
            "flask",
            "sqlalchemy",
            "pytest",
            "black",
            "flake8",
            "isort",
            "ruff",
        ]

        for package in required_packages:
            try:
                __import__(package)
            except ImportError:
                pytest.fail(f"Required package '{package}' not installed")
