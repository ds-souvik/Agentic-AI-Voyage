# Focused Room Website

Privacy-first landing page and web platform for the Focused Room Chrome extension.

![CI/CD Pipeline](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/CI%2FCD%20Pipeline/badge.svg)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [CI/CD & Code Quality](#cicd--code-quality)
- [SEO & Social Media](#seo--social-media)
- [Development Workflow](#development-workflow)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Milestones & Roadmap](#milestones--roadmap)
- [Security & Privacy](#security--privacy)
- [Contributing](#contributing)
- [Contact](#contact)

## Overview

The Focused Room Website is a Flask-based web platform that serves as the landing page and web companion for the Focused Room Chrome extension. It provides personality testing, newsletter subscription, and educational content about productivity.

**Current Status**: 6 of 7 milestones complete (Big Five, Subscribe & Email, SEO, CI/CD, Gemini AI, Deployment)

## Features

- ✅ **Landing Page** - Modern, SEO-optimized homepage showcasing the extension
- ✅ **Big Five Personality Test** - Science-backed personality assessment with scoring
- ✅ **Newsletter Subscription** - Email collection with rate limiting and validation
- ✅ **SEO Optimization** - Sitemap, robots.txt, Open Graph, JSON-LD structured data
- ✅ **CI/CD Pipeline** - Automated testing and code quality checks
- ⏳ **Blog** - Educational content about productivity and focus (coming soon)
- ✅ **AI Suggestions** - Gemini-powered personality recommendations

## Tech Stack

### Backend
- **Framework**: Flask 2.2.5 (Python 3.9+)
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: SQLAlchemy with Flask-SQLAlchemy
- **Email**: SendGrid with SMTP fallback
- **AI**: Google Gemini 2.0 Flash with fallback logic
- **Testing**: pytest with 99.5% pass rate (202 tests, 1 skipped)

### Frontend
- **Templates**: Jinja2
- **Styling**: Custom CSS
- **JavaScript**: Vanilla JS (no frameworks)
- **SEO**: Open Graph, Twitter Cards, JSON-LD

### DevOps & Quality
- **CI/CD**: GitHub Actions (Python 3.9-3.12)
- **Code Quality**: Black, Flake8, Ruff, isort, mypy
- **Pre-commit Hooks**: Automated quality gates
- **Security**: Bandit, Safety scanning
- **Coverage**: pytest-cov with detailed reporting

## Quick Start

### Prerequisites

- Python 3.9 or higher
- pip (Python package manager)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd 02_FocusedRoom_website
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up environment variables**

   Create a `.env` file in the project root:
   ```bash
   # Flask Configuration
   SECRET_KEY=your-secret-key-here-change-in-production
   FLASK_ENV=development

   # Database (optional, defaults to SQLite)
   DATABASE_URL=sqlite:///focusedroom.db

   # Email Service (optional for local development)
   MAIL_SERVER=smtp.sendgrid.net
   MAIL_PORT=587
   MAIL_USERNAME=apikey
   MAIL_PASSWORD=your-sendgrid-api-key
   MAIL_DEFAULT_SENDER=noreply@focusedroom.com

  # Gemini API (for AI-powered personality suggestions)
  GEMINI_API_KEY=your-gemini-api-key-here
  ```


   **⚠️ IMPORTANT**: Never commit the `.env` file to version control.

5. **Run the application**
   ```bash
   python run.py
   ```

6. **Access the application**

   Open your browser to: `http://127.0.0.1:5000`

### Quick Test

```bash
# Run all tests
pytest -v

# Run with coverage
pytest --cov=app --cov-report=term-missing
```

## API Documentation

### Big Five Personality Test

#### `POST /big-five`

Submit Big Five personality test responses and receive scores.

**Request:**
```json
{
  "answers": [3, 4, 2, 5, 3, ...]  // Array of 44 or 50 values (1-5)
}
```

**Success Response (200):**
```json
{
  "success": true,
  "id": 1,
  "scores": {
    "openness": 72.5,
    "conscientiousness": 65.0,
    "extraversion": 55.0,
    "agreeableness": 80.0,
    "neuroticism": 45.0
  },
  "percentiles": {
    "openness": 75.0,
    "conscientiousness": 68.0,
    "extraversion": 50.0,
    "agreeableness": 85.0,
    "neuroticism": 42.0
  },
  "suggestions": "## Your Personality Profile\n\nBased on your Big Five scores..."
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input (wrong length, non-numeric, out of range)
- `500 Internal Server Error` - Database or server error

**Validation Rules:**
- Answers must be exactly 44 or 50 numeric values
- Each value must be 1-5 (Likert scale)
- Scores normalized to 0-100 scale

#### `GET /big-five`

Displays the Big Five personality test form (HTML page).

### Newsletter Subscription

#### `POST /api/subscribe`

Subscribe to newsletter with rate limiting and validation.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Successfully subscribed to newsletter",
  "email_sent": true,
  "email_provider": "sendgrid"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid email or suspicious fields
- `429 Too Many Requests` - Rate limit exceeded (5 requests/hour per IP)
- `500 Internal Server Error` - Server error

**Features:**
- Rate limiting: 5 requests per hour per IP
- Email validation and sanitization
- Suspicious field detection (spam prevention)
- Idempotent operations (safe to retry)
- SendGrid with SMTP and console fallbacks

**AI-Powered Suggestions:**
- Primary: Google Gemini 2.0 Flash API
- Fallback: Generic trait-based suggestions
- Retry logic: 3 attempts with exponential backoff
- Response time: ~2-5 seconds (API) or instant (fallback)

### SEO Endpoints

#### `GET /sitemap.xml`

Returns XML sitemap for search engines.

**Response:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://focusedroom.com/</loc>
    <lastmod>2025-10-02</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- Additional URLs -->
</urlset>
```

#### `GET /robots.txt`

Returns crawler instructions for search engines.

**Response:**

User-agent: *
Allow: /
Disallow: /api/
Disallow: /admin/
Sitemap: https://focusedroom.com/sitemap.xml


### Other Routes

- `GET /` - Homepage
- `GET /download` - Redirects to Chrome Web Store
- `GET /features` - Features page
- `GET /blog` - Blog listing page
- `GET /privacy` - Privacy policy

## Testing

### Run All Tests

```bash
# Run all 203 tests
pytest -v

# Expected output: 202 passed, 1 skipped (31 Big Five + 21 Subscribe + 20 SEO + 27 CI/CD + 30 Gemini + 43 Deployment)
```

### Run Specific Test Suites

```bash
# Big Five tests (31 tests)
pytest tests/test_bigfive.py -v

# Subscribe & Email tests (21 tests)
pytest tests/test_subscribe.py -v

# SEO tests (20 tests)
pytest tests/test_seo.py -v

# CI/CD tests
pytest tests/test_ci.py -v

# Gemini AI tests (30 tests)
pytest tests/test_gemini.py -v

# Deployment tests (43 tests)
pytest tests/test_deployment.py -v
```

### Test with Coverage

```bash
# Generate coverage report
pytest --cov=app --cov-report=term-missing

# Generate HTML coverage report
pytest --cov=app --cov-report=html

# Open HTML report
open htmlcov/index.html
```

### Test Coverage Summary

Current test coverage by module:
- ✅ **Big Five**: 100% coverage (31 tests)
- ✅ **Subscribe & Email**: 100% coverage (21 tests)
- ✅ **SEO**: 100% coverage (20 tests)
- ✅ **CI/CD**: 100% coverage (27 tests, 1 skipped)
- ✅ **Gemini AI**: 100% coverage (30 tests)
- ✅ **Deployment**: 100% coverage (43 tests)

**Overall**: 202/203 tests passing (99.5% pass rate, 1 intentionally skipped)

## CI/CD & Code Quality

### GitHub Actions Pipeline

All code is automatically tested on every push and pull request.

**Workflow Jobs:**
1. **Test** - Run test suite on Python 3.9, 3.10, 3.11, 3.12
2. **Lint** - Code quality checks (Black, Flake8, Ruff, isort, mypy)
3. **Security** - Security scans (Bandit, Safety)
4. **Build** - Verify application can build and start

**Status Badge:**
```markdown
![CI/CD Pipeline](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/CI%2FCD%20Pipeline/badge.svg)
```

### Pre-commit Hooks

Automatically check code quality before commits.

**Installation:**
```bash
# Install pre-commit
pip install pre-commit

# Install git hooks
pre-commit install

# Run manually on all files
pre-commit run --all-files
```

**Configured Hooks:**
- **Black** - Code formatting (line length: 100)
- **isort** - Import sorting
- **Flake8** - Linting and style checks
- **Ruff** - Fast Python linter
- **mypy** - Type checking
- **Bandit** - Security vulnerability scanning
- **trailing-whitespace** - Remove trailing spaces
- **end-of-file-fixer** - Ensure newline at EOF
- **check-yaml/json** - Validate config files
- **detect-private-key** - Prevent committing secrets
- **no-commit-to-branch** - Prevent direct commits to main

### Code Formatting

**Black** - Automatic code formatting:
```bash
# Format all code
black app/ tests/

# Check formatting without changes
black --check app/ tests/
```

**isort** - Import sorting:
```bash
# Sort imports
isort app/ tests/

# Check import sorting
isort --check-only app/ tests/
```

### Linting

**Flake8** - Style guide enforcement:
```bash
# Run flake8
flake8 app/ tests/

# With statistics
flake8 app/ tests/ --statistics
```

**Ruff** - Fast Python linter:
```bash
# Run ruff
ruff check app/ tests/

# Auto-fix issues
ruff check --fix app/ tests/
```

### Type Checking

**mypy** - Static type checking:
```bash
# Run type checking
mypy app/ --ignore-missing-imports

# Strict mode
mypy app/ --strict
```

### Security Scanning

**Bandit** - Security vulnerability scanner:
```bash
# Scan for security issues
bandit -r app/

# Generate JSON report
bandit -r app/ -f json -o bandit-report.json
```

**Safety** - Dependency vulnerability checker:
```bash
# Check for known vulnerabilities
safety check

# Check with JSON output
safety check --json
```

### Configuration Files

- **`pyproject.toml`** - Modern Python configuration (Black, Ruff, isort, pytest, coverage)
- **`.flake8`** - Flake8 configuration
- **`.pre-commit-config.yaml`** - Pre-commit hooks
- **`.github/workflows/ci.yml`** - GitHub Actions workflow
- **`pytest.ini`** - Pytest configuration

### Code Quality Standards

**Style Guidelines:**
- Line length: 100 characters
- Python version: 3.9+
- Import sorting: Black-compatible isort profile
- Docstrings: Google style
- Type hints: Encouraged for public APIs

**Quality Metrics:**
- Test coverage: Target 80%+ (currently ~95%)
- Complexity: Max cyclomatic complexity of 10
- Security: Zero known vulnerabilities
- Linting: Zero errors, minimal warnings

### Local Development Workflow

**Before committing:**
```bash
# 1. Run tests
pytest tests/ -v

# 2. Check formatting
black --check app/ tests/

# 3. Run linting
flake8 app/ tests/
ruff check app/ tests/

# 4. Check types
mypy app/ --ignore-missing-imports

# 5. Run pre-commit hooks
pre-commit run --all-files
```

**Or use automated hooks:**
```bash
# Just commit - hooks run automatically
git commit -m "feat: your changes"
```

### Continuous Integration

**On every push/PR:**
1. ✅ Tests run on 4 Python versions
2. ✅ Code formatting checked
3. ✅ Linting performed
4. ✅ Type checking executed
5. ✅ Security scans completed
6. ✅ Coverage report generated
7. ✅ Build verification completed

**Branch Protection:**
- PRs must pass all CI checks before merge
- At least one approval required (recommended)
- No direct commits to main branch

### Troubleshooting

**Pre-commit hook failures:**
```bash
# Update hooks
pre-commit autoupdate

# Clear cache and reinstall
pre-commit clean
pre-commit install --install-hooks
```

**Black formatting conflicts:**
```bash
# Let Black auto-fix
black app/ tests/
git add .
git commit -m "style: apply black formatting"
```

**Import sorting issues:**
```bash
# Let isort auto-fix
isort app/ tests/
git add .
git commit -m "style: sort imports with isort"
```

### Best Practices

✅ **DO:**
- Run tests before pushing
- Use pre-commit hooks
- Keep test coverage high
- Write type hints for new code
- Follow conventional commit messages
- Review CI/CD results

❌ **DON'T:**
- Commit directly to main
- Skip pre-commit hooks
- Ignore linting warnings
- Commit with failing tests
- Hardcode secrets or credentials
- Commit large files or binaries

## SEO & Social Media

### Implemented Features

#### Comprehensive Meta Tags
- Primary meta tags (title, description, keywords)
- Open Graph tags for social media sharing
- Twitter Card tags for Twitter integration
- Canonical URLs to prevent duplicate content
- Mobile-optimized viewport settings

#### XML Sitemap
- Dynamically generated at `/sitemap.xml`
- Includes all public pages with priorities
- Automatically updated with route changes

#### Robots.txt
- Crawler instructions at `/robots.txt`
- Blocks sensitive endpoints (`/api/`, `/admin/`)
- References sitemap location
- Bot-specific rules for major crawlers

#### JSON-LD Structured Data
- Website schema for organization information
- SoftwareApplication schema for Chrome extension
- BreadcrumbList for navigation hierarchy
- Article schema for blog posts
- Enhanced search result appearance

#### Page-Specific SEO
- **Home**: Productivity and Chrome extension keywords
- **Big Five**: Personality test and assessment keywords
- **Features**: Product features and capabilities
- **Blog**: Content marketing and education
- **Privacy**: Privacy policy and data protection

### SEO Best Practices

✅ **On-Page SEO**
- Semantic HTML5 structure
- Proper heading hierarchy (H1, H2, H3)
- Alt text for images
- Descriptive link text
- Mobile-responsive design

✅ **Technical SEO**
- Fast page load times
- Clean URL structure
- HTTPS-ready (for production)
- XML sitemap
- Robots.txt configuration

✅ **Social Media SEO**
- Open Graph tags for Facebook/LinkedIn
- Twitter Card tags
- High-quality OG images (1200x630px)
- Compelling social descriptions

✅ **Structured Data**
- JSON-LD format (Google recommended)
- Multiple schema types
- Rich snippet eligibility
- Enhanced search results

### SEO Validation Tools

After deployment, validate with:

1. **Google Search Console** - Submit sitemap, check indexing
2. **Rich Results Test** - https://search.google.com/test/rich-results
3. **Meta Tags Validator** - https://metatags.io/
4. **PageSpeed Insights** - https://pagespeed.web.dev/
5. **Lighthouse Audit** - Chrome DevTools
6. **Facebook Debugger** - https://developers.facebook.com/tools/debug/
7. **Twitter Card Validator** - https://cards-dev.twitter.com/validator

### Future SEO Enhancements

- [ ] Blog post sitemap index
- [ ] Image sitemap
- [ ] FAQ schema
- [ ] Video schema (if adding video content)
- [ ] Breadcrumb navigation UI
- [ ] hreflang tags (multi-language)
- [ ] Performance optimization (lazy loading, CDN)

## Development Workflow

### Creating a Feature Branch

```bash
# Create and switch to feature branch
git checkout -b feature/your-feature-name

# Make changes and test
pytest -v

# Commit with conventional format
git commit -m "feat: descriptive commit message"

# Push to GitHub
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

### Conventional Commits

Use semantic commit messages:

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Test additions or changes
- `chore:` - Maintenance tasks

### Running Tests Before Commit

```bash
# Quick test
pytest -q

# Full test with coverage
pytest --cov=app --cov-report=term-missing

# Run pre-commit hooks
pre-commit run --all-files
```

## Deployment

**📖 See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete deployment guide**

### Quick Start Options

#### Option 1: Docker (Local Testing)

```bash
# Build and run
docker-compose up --build

# Access application
http://localhost:5000

# Check health
curl http://localhost:5000/health
```

#### Option 2: Render.com (Production)

1. **Connect Repository**: Link GitHub repo to Render
2. **Auto-Deploy**: Uses `render.yaml` for configuration
3. **Environment Variables**: Set in Render dashboard
4. **Health Checks**: Automatic via `/health` endpoint

#### Option 3: Railway (Alternative)

1. **Connect Repository**: Link to Railway
2. **Auto-Detection**: Railway detects Flask automatically
3. **Environment Variables**: Set in project settings
4. **Deploy**: Automatic on push to main

### Health Check Endpoint

```bash
GET /health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2025-10-04T12:34:56.789Z",
  "database": "healthy",
  "version": "1.5.0",
  "environment": "production"
}
```

### Production Requirements

- Python 3.9+
- PostgreSQL (or SQLite for testing)
- Environment variables configured
- Gunicorn for WSGI server

### Production Environment Variables

Set these in your hosting platform:
- `SECRET_KEY` - Generate a strong random key
- `DATABASE_URL` - PostgreSQL URL (provided by host)
- `MAIL_SERVER`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`
- `GEMINI_API_KEY` - (optional, for AI features)
- `FLASK_ENV=production`

### Pre-deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations prepared
- [ ] Secret key generated
- [ ] HTTPS configured
- [ ] Error monitoring set up
- [ ] Backups configured

## Project Structure
02_FocusedRoom_website/
├── .github/
│ └── workflows/
│ └── ci.yml # GitHub Actions CI/CD
├── app/
│ ├── init.py # Flask app factory
│ ├── config.py # Configuration
│ ├── models.py # Database models
│ ├── routes.py # API routes
│ ├── forms.py # WTForms (if needed)
│ ├── static/ # CSS, JS, images
│ │ ├── assets/
│ │ ├── css/
│ │ ├── js/
│ │ └── robots.txt
│ ├── templates/ # Jinja2 templates
│ │ ├── base.html
│ │ ├── index.html
│ │ ├── bigfive.html
│ │ ├── privacy.html
│ │ ├── features.html
│ │ └── ...
│ └── utils/ # Helper modules
│ ├── bigfive.py # Big Five scoring
│ ├── emailer.py # Email service
│ ├── rate_limiter.py # Rate limiting
│ ├── validators.py # Input validation
│ ├── seo.py # SEO utilities
│ └── gemini_client.py # Gemini AI client
├── tests/
│ ├── test_bigfive.py # 31 tests
│ ├── test_subscribe.py # 21 tests
│ ├── test_seo.py # 20 tests
│ ├── test_ci.py # 27 tests (1 skipped)
│ └── test_gemini.py # 30 tests
├── instance/
│ └── focusedroom.db # SQLite database (dev)
├── .pre-commit-config.yaml # Pre-commit hooks
├── .flake8 # Flake8 config
├── .gitignore # Git ignore rules
├── pyproject.toml # Python project config
├── pytest.ini # Pytest config
├── requirements.txt # Dependencies
├── run.py # Entry point
└── README.md # This file


## Milestones & Roadmap

- ✅ **MILESTONE 1**: Big Five Core - Scoring logic + 31 tests
- ✅ **MILESTONE 2**: Subscribe & Email - Validation + SendGrid + 21 tests
- ✅ **MILESTONE 3**: SEO, Sitemap, OG Images - Complete SEO + 20 tests
- ✅ **MILESTONE 4**: CI/CD, Linting, Pre-commit - Automation + quality gates + 27 tests
- ✅ **MILESTONE 5**: Gemini/LLM Integration - AI-powered suggestions + 30 tests
- ✅ **MILESTONE 6**: Deployment Prep - Docker + production setup + 43 tests
- ⏳ **MILESTONE 7**: Performance & Accessibility - Lighthouse optimization

**Current Progress: 6 of 7 milestones complete (86%)


## Security & Privacy

### Security Measures

- ✅ No API keys in code (environment variables only)
- ✅ Input validation on all endpoints
- ✅ SQL injection protection (SQLAlchemy ORM)
- ✅ Rate limiting (5 requests/hour per IP)
- ✅ Email validation and sanitization
- ✅ Suspicious field detection (spam prevention)
- ⏳ CSRF protection (Flask-WTF integration)
- ⏳ Security scanning (Bandit, Safety)

### Privacy Measures

- ✅ No PII in logs
- ✅ Explicit opt-in for newsletter
- ✅ Data minimization (only collect necessary data)
- ✅ Idempotent operations (safe to retry)
- ⏳ Cookie consent (GDPR compliance)
- ⏳ Data retention policies

### Best Practices

- Environment variables for secrets
- Generic error messages in production
- Secure session management
- HTTPS in production
- Regular dependency updates
- Security scanning in CI/CD

## Contributing

This is a focused project with specific milestones. Contributions must:

1. **Be on a feature branch** - No direct commits to main
2. **Include tests** - >80% coverage required
3. **Pass all tests** - 100% pass rate required
4. **Include documentation** - Update README and docstrings
5. **Follow PEP8** - Use Black formatter (line length: 100)
6. **Pass CI/CD** - All checks must pass
7. **Use conventional commits** - Clear, descriptive messages

### Development Setup

```bash
# Clone and setup
git clone <repo-url>
cd 02_FocusedRoom_website
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Install pre-commit hooks
pre-commit install

# Run tests
pytest -v

# Start developing!
```

## License

Proprietary - All rights reserved

## Contact

For questions or support, visit [focusedroom.com](https://focusedroom.com)

---

**Note**: The Chrome extension source code is located in `../01_FocusedRoom/` and should not be modified as part of website development unless explicitly required.

**Last Updated**: October 4, 2025  
**Version**: 1.6.0  
**Status**: Active Development (MILESTONE 7 next - Performance & Accessibility)
