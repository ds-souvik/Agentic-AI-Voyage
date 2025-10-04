"""
Comprehensive tests for MILESTONE 6 - Deployment Configuration

Tests Docker configuration, health checks, and deployment readiness.
"""

from pathlib import Path

import yaml  # type: ignore[import-untyped]


class TestHealthCheckEndpoint:
    """Test the /health endpoint for monitoring."""

    def test_health_endpoint_exists(self, client):
        """Test that health endpoint is accessible."""
        response = client.get("/health")
        assert response.status_code in [200, 503]  # Either healthy or degraded

    def test_health_response_structure(self, client):
        """Test that health response has correct structure."""
        response = client.get("/health")
        data = response.get_json()

        assert "status" in data
        assert "timestamp" in data
        assert "database" in data
        assert "version" in data
        assert "environment" in data

    def test_health_status_values(self, client):
        """Test that health status is either healthy or degraded."""
        response = client.get("/health")
        data = response.get_json()

        assert data["status"] in ["healthy", "degraded"]

    def test_health_returns_200_when_healthy(self, client):
        """Test that healthy status returns 200."""
        response = client.get("/health")
        data = response.get_json()

        if data["status"] == "healthy":
            assert response.status_code == 200
            assert data["database"] == "healthy"

    def test_health_version_is_correct(self, client):
        """Test that version matches current version."""
        response = client.get("/health")
        data = response.get_json()

        assert data["version"] == "1.5.0"

    def test_health_timestamp_format(self, client):
        """Test that timestamp is in ISO format."""
        response = client.get("/health")
        data = response.get_json()

        # Should be parseable ISO datetime
        from datetime import datetime

        try:
            datetime.fromisoformat(data["timestamp"])
            timestamp_valid = True
        except ValueError:
            timestamp_valid = False

        assert timestamp_valid


class TestDockerConfiguration:
    """Test Docker-related configuration files."""

    def test_dockerfile_exists(self):
        """Test that Dockerfile exists."""
        dockerfile_path = Path("Dockerfile")
        assert dockerfile_path.exists()

    def test_dockerfile_has_multi_stage_build(self):
        """Test that Dockerfile uses multi-stage build."""
        dockerfile_path = Path("Dockerfile")
        content = dockerfile_path.read_text()

        assert "FROM python:3.11-slim as builder" in content
        assert "FROM python:3.11-slim" in content.split("as builder")[1]

    def test_dockerfile_uses_non_root_user(self):
        """Test that Dockerfile creates and uses non-root user."""
        dockerfile_path = Path("Dockerfile")
        content = dockerfile_path.read_text()

        assert "useradd" in content
        assert "USER appuser" in content

    def test_dockerfile_has_healthcheck(self):
        """Test that Dockerfile includes healthcheck."""
        dockerfile_path = Path("Dockerfile")
        content = dockerfile_path.read_text()

        assert "HEALTHCHECK" in content
        assert "/health" in content

    def test_dockerfile_uses_gunicorn(self):
        """Test that Dockerfile uses gunicorn for production."""
        dockerfile_path = Path("Dockerfile")
        content = dockerfile_path.read_text()

        assert "gunicorn" in content
        assert "run:app" in content

    def test_dockerignore_exists(self):
        """Test that .dockerignore exists."""
        dockerignore_path = Path(".dockerignore")
        assert dockerignore_path.exists()

    def test_dockerignore_excludes_tests(self):
        """Test that .dockerignore excludes test files."""
        dockerignore_path = Path(".dockerignore")
        content = dockerignore_path.read_text()

        assert "tests/" in content
        assert ".pytest_cache/" in content

    def test_dockerignore_excludes_env_files(self):
        """Test that .dockerignore excludes environment files."""
        dockerignore_path = Path(".dockerignore")
        content = dockerignore_path.read_text()

        assert ".env" in content
        assert "*.db" in content


class TestDockerComposeConfiguration:
    """Test docker-compose.yml configuration."""

    def test_docker_compose_exists(self):
        """Test that docker-compose.yml exists."""
        compose_path = Path("docker-compose.yml")
        assert compose_path.exists()

    def test_docker_compose_is_valid_yaml(self):
        """Test that docker-compose.yml is valid YAML."""
        compose_path = Path("docker-compose.yml")
        content = compose_path.read_text()

        try:
            yaml.safe_load(content)
            is_valid = True
        except yaml.YAMLError:
            is_valid = False

        assert is_valid

    def test_docker_compose_has_web_service(self):
        """Test that docker-compose defines web service."""
        compose_path = Path("docker-compose.yml")
        content = yaml.safe_load(compose_path.read_text())

        assert "services" in content
        assert "web" in content["services"]

    def test_docker_compose_web_exposes_port_5000(self):
        """Test that web service exposes port 5000."""
        compose_path = Path("docker-compose.yml")
        content = yaml.safe_load(compose_path.read_text())

        web_service = content["services"]["web"]
        assert "ports" in web_service
        assert "5000:5000" in web_service["ports"]

    def test_docker_compose_has_environment_variables(self):
        """Test that web service has environment variables."""
        compose_path = Path("docker-compose.yml")
        content = yaml.safe_load(compose_path.read_text())

        web_service = content["services"]["web"]
        assert "environment" in web_service

        env_vars = web_service["environment"]
        env_keys = [var.split("=")[0] for var in env_vars]

        assert "FLASK_ENV" in env_keys
        assert "SECRET_KEY" in env_keys
        assert "DATABASE_URL" in env_keys

    def test_docker_compose_has_healthcheck(self):
        """Test that web service has healthcheck configured."""
        compose_path = Path("docker-compose.yml")
        content = yaml.safe_load(compose_path.read_text())

        web_service = content["services"]["web"]
        assert "healthcheck" in web_service

    def test_docker_compose_has_db_service(self):
        """Test that docker-compose defines PostgreSQL service."""
        compose_path = Path("docker-compose.yml")
        content = yaml.safe_load(compose_path.read_text())

        assert "db" in content["services"]
        db_service = content["services"]["db"]
        assert "postgres" in db_service["image"]


class TestRenderConfiguration:
    """Test Render.com deployment configuration."""

    def test_render_yaml_exists(self):
        """Test that render.yaml exists."""
        render_path = Path("render.yaml")
        assert render_path.exists()

    def test_render_yaml_is_valid(self):
        """Test that render.yaml is valid YAML."""
        render_path = Path("render.yaml")
        content = render_path.read_text()

        try:
            yaml.safe_load(content)
            is_valid = True
        except yaml.YAMLError:
            is_valid = False

        assert is_valid

    def test_render_defines_web_service(self):
        """Test that render.yaml defines web service."""
        render_path = Path("render.yaml")
        content = yaml.safe_load(render_path.read_text())

        assert "services" in content
        assert len(content["services"]) > 0

        web_service = content["services"][0]
        assert web_service["type"] == "web"

    def test_render_web_service_has_python_env(self):
        """Test that web service uses Python environment."""
        render_path = Path("render.yaml")
        content = yaml.safe_load(render_path.read_text())

        web_service = content["services"][0]
        assert web_service["env"] == "python"

    def test_render_has_health_check_path(self):
        """Test that render.yaml specifies health check path."""
        render_path = Path("render.yaml")
        content = yaml.safe_load(render_path.read_text())

        web_service = content["services"][0]
        assert "healthCheckPath" in web_service
        assert web_service["healthCheckPath"] == "/health"

    def test_render_uses_gunicorn(self):
        """Test that render.yaml uses gunicorn."""
        render_path = Path("render.yaml")
        content = yaml.safe_load(render_path.read_text())

        web_service = content["services"][0]
        assert "gunicorn" in web_service["startCommand"]

    def test_render_has_database_config(self):
        """Test that render.yaml defines database."""
        render_path = Path("render.yaml")
        content = yaml.safe_load(render_path.read_text())

        assert "databases" in content
        assert len(content["databases"]) > 0

    def test_render_env_vars_configured(self):
        """Test that render.yaml has required environment variables."""
        render_path = Path("render.yaml")
        content = yaml.safe_load(render_path.read_text())

        web_service = content["services"][0]
        assert "envVars" in web_service

        env_var_keys = [var["key"] for var in web_service["envVars"]]

        assert "SECRET_KEY" in env_var_keys
        assert "FLASK_ENV" in env_var_keys
        assert "DATABASE_URL" in env_var_keys
        assert "GEMINI_API_KEY" in env_var_keys


class TestDeploymentDocumentation:
    """Test deployment documentation."""

    def test_deployment_md_exists(self):
        """Test that DEPLOYMENT.md exists."""
        deployment_path = Path("DEPLOYMENT.md")
        assert deployment_path.exists()

    def test_deployment_has_prerequisites_section(self):
        """Test that deployment docs have prerequisites."""
        deployment_path = Path("DEPLOYMENT.md")
        content = deployment_path.read_text()

        assert "Prerequisites" in content or "prerequisites" in content

    def test_deployment_has_docker_instructions(self):
        """Test that deployment docs have Docker instructions."""
        deployment_path = Path("DEPLOYMENT.md")
        content = deployment_path.read_text()

        assert "docker" in content.lower()
        assert "docker-compose" in content.lower()

    def test_deployment_has_render_instructions(self):
        """Test that deployment docs have Render instructions."""
        deployment_path = Path("DEPLOYMENT.md")
        content = deployment_path.read_text()

        assert "render" in content.lower()

    def test_deployment_has_environment_variables_section(self):
        """Test that deployment docs document environment variables."""
        deployment_path = Path("DEPLOYMENT.md")
        content = deployment_path.read_text()

        assert "environment" in content.lower() or "env" in content.lower()
        assert "SECRET_KEY" in content
        assert "DATABASE_URL" in content

    def test_deployment_has_health_check_documentation(self):
        """Test that deployment docs document health check."""
        deployment_path = Path("DEPLOYMENT.md")
        content = deployment_path.read_text()

        assert "/health" in content
        assert "Health" in content or "health" in content

    def test_deployment_has_troubleshooting_section(self):
        """Test that deployment docs have troubleshooting section."""
        deployment_path = Path("DEPLOYMENT.md")
        content = deployment_path.read_text()

        assert "troubleshoot" in content.lower() or "debug" in content.lower()


class TestProductionReadiness:
    """Test production readiness configurations."""

    def test_gunicorn_is_installed(self):
        """Test that gunicorn is in requirements.txt."""
        requirements_path = Path("requirements.txt")
        content = requirements_path.read_text()

        assert "gunicorn" in content

    def test_environment_variables_documented(self):
        """Test that environment variables are documented."""
        # Check README or DEPLOYMENT.md
        readme_path = Path("README.md")
        deployment_path = Path("DEPLOYMENT.md")

        readme_content = readme_path.read_text() if readme_path.exists() else ""
        deployment_content = deployment_path.read_text() if deployment_path.exists() else ""

        combined = readme_content + deployment_content

        assert "SECRET_KEY" in combined
        assert "DATABASE_URL" in combined
        assert "FLASK_ENV" in combined

    def test_gitignore_excludes_sensitive_files(self):
        """Test that .gitignore excludes sensitive files."""
        gitignore_path = Path(".gitignore")

        if gitignore_path.exists():
            content = gitignore_path.read_text()
            assert ".env" in content
            assert "*.db" in content or "instance/" in content


class TestSecurityConfiguration:
    """Test security-related configurations."""

    def test_dockerfile_doesnt_expose_secrets(self):
        """Test that Dockerfile doesn't contain hardcoded secrets."""
        dockerfile_path = Path("Dockerfile")
        content = dockerfile_path.read_text()

        # Check for common secret patterns
        assert "password" not in content.lower() or "PASSWORD" in content  # Only env vars
        assert "api_key" not in content.lower() or "API_KEY" in content  # Only env vars
        assert "secret" not in content.lower() or "SECRET" in content  # Only env vars

    def test_docker_compose_uses_env_vars(self):
        """Test that docker-compose uses environment variables for secrets."""
        compose_path = Path("docker-compose.yml")
        content = compose_path.read_text()

        # Should use ${VAR:-default} pattern
        assert "${SECRET_KEY" in content
        assert "${GEMINI_API_KEY" in content

    def test_render_yaml_uses_secure_env_vars(self):
        """Test that render.yaml uses secure environment variable handling."""
        render_path = Path("render.yaml")
        content = yaml.safe_load(render_path.read_text())

        web_service = content["services"][0]
        env_vars = web_service["envVars"]

        # Check that sensitive vars use sync: false or generateValue
        secret_key_var = next(v for v in env_vars if v["key"] == "SECRET_KEY")
        assert secret_key_var.get("generateValue") is True

        gemini_var = next(v for v in env_vars if v["key"] == "GEMINI_API_KEY")
        assert gemini_var.get("sync") is False
