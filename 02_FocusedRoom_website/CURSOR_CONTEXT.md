# Cursor AI Development Context - Focused Room Website

## 🎯 Project Overview

**Project Name**: Focused Room Website  
**Repository**: `02_FocusedRoom_website/`  
**Purpose**: Privacy-first landing page and web platform for the Focused Room Chrome extension  
**Current Status**: MILESTONE 1-3 Complete ✅ | MILESTONE 4 In Progress  

## 🏗️ Tech Stack & Architecture

### Backend
- **Framework**: Flask 2.2.5 (Python 3.9+)
- **Database**: SQLite (dev) / PostgreSQL (production)
- **ORM**: SQLAlchemy with Flask-SQLAlchemy
- **Testing**: pytest 8.3.4
- **Deployment**: Render/Railway compatible

### Frontend
- **Templates**: Jinja2
- **CSS**: Custom CSS with themes
- **JavaScript**: Vanilla JS (no frameworks)
- **Responsive**: Mobile-first design

### Development Tools
- **IDE**: Cursor with AI assistance
- **Version Control**: Git with conventional commits
- **Package Management**: pip with requirements.txt
- **Code Quality**: Black, Flake8, Ruff, isort, mypy, pre-commit hooks
- **CI/CD**: GitHub Actions

## 📁 Project Structure
02_FocusedRoom_website/
├── .github/
│ └── workflows/
│ └── ci.yml # GitHub Actions CI/CD
├── app/
│ ├── init.py # Flask app factory
│ ├── config.py # Configuration management
│ ├── models.py # Database models (SQLAlchemy)
│ ├── routes.py # API routes and endpoints
│ ├── forms.py # WTForms (if needed)
│ ├── static/ # CSS, JS, images
│ │ ├── assets/
│ │ ├── css/
│ │ ├── js/
│ │ └── robots.txt # ✅ SEO crawler rules
│ ├── templates/ # Jinja2 templates
│ │ ├── base.html # ✅ Enhanced with SEO meta tags
│ │ ├── index.html # ✅ SEO optimized
│ │ ├── bigfive.html # ✅ SEO optimized
│ │ ├── privacy.html # ✅ SEO optimized
│ │ ├── features.html # ✅ SEO optimized
│ │ └── ...
│ └── utils/ # Helper modules
│ ├── bigfive.py # ✅ Big Five scoring logic
│ ├── emailer.py # ✅ Email service (SendGrid + SMTP + console)
│ ├── rate_limiter.py # ✅ IP-based rate limiting
│ ├── validators.py # ✅ Input validation and security
│ ├── seo.py # ✅ SEO utilities (sitemap, JSON-LD, meta tags)
│ ├── gemini_stub.py # ⏳ LLM stub (MILESTONE 5)
│ └── gemini_wrapper.py # ⏳ LLM wrapper (MILESTONE 5)
├── tests/
│ ├── init.py # Makes tests a package
│ ├── test_bigfive.py # ✅ Big Five tests (31 tests)
│ ├── test_subscribe.py # ✅ Subscription tests (21 tests)
│ ├── test_seo.py # ✅ SEO tests (20 tests)
│ └── test_ci.py # ⏳ CI/CD tests (MILESTONE 4)
├── instance/
│ └── focusedroom.db # SQLite database (dev)
├── .pre-commit-config.yaml # ⏳ Pre-commit hooks (MILESTONE 4)
├── .flake8 # ⏳ Flake8 configuration (MILESTONE 4)
├── pyproject.toml # ⏳ Modern Python config (MILESTONE 4)
├── pytest.ini # Pytest configuration
├── requirements.txt # Python dependencies
├── run.py # Application entry point
├── .gitignore # Git ignore rules
└── README.md # Comprehensive documentation


## 🎯 Milestone Roadmap

### ✅ MILESTONE 1 - Big Five Core (COMPLETE)
- **Status**: Complete and merged to main
- **Implementation**:
  - `app/utils/bigfive.py` - Scoring logic with validation
  - `tests/test_bigfive.py` - 31 comprehensive tests
  - `POST /big-five` endpoint with DB persistence
  - Complete documentation and setup
- **Test Results**: 31/31 passing
- **Git**: Committed and pushed to GitHub

### ✅ MILESTONE 2 - Subscribe & Email (COMPLETE)
- **Status**: Complete and merged to main
- **Implementation**:
  - `app/utils/emailer.py` - SendGrid + SMTP + console fallbacks
  - `app/utils/rate_limiter.py` - IP-based rate limiting (5 req/hour)
  - `app/utils/validators.py` - Email validation, sanitization, security
  - `tests/test_subscribe.py` - 21 comprehensive tests
  - Enhanced `POST /api/subscribe` endpoint with full validation
  - Idempotent database operations with `Subscriber` model
- **Test Results**: 21/21 passing (100% success rate)
- **Features**: Email validation, rate limiting, SendGrid integration, security
- **Integration**: Full compatibility with MILESTONE 1 Big Five features
- **Git**: Committed and pushed to GitHub

### ✅ MILESTONE 3 - SEO, Sitemap, OG Images (COMPLETE)
- **Status**: Complete and merged to main
- **Implementation**:
  - `app/utils/seo.py` - SEO utilities (sitemap, JSON-LD, meta tags)
  - `app/static/robots.txt` - Search engine crawler instructions
  - `tests/test_seo.py` - 20 comprehensive SEO tests
  - Enhanced `app/templates/base.html` with comprehensive meta tags
  - Updated all page templates with page-specific SEO
  - Added `/sitemap.xml` and `/robots.txt` endpoints
  - Complete JSON-LD structured data for all page types
- **SEO Features**:
  - XML sitemap with all routes
  - Open Graph tags for social media
  - Twitter Card integration
  - JSON-LD structured data (Website, SoftwareApplication, Breadcrumb, Article)
  - Canonical URLs
  - Page-specific meta tags and keywords
  - Robots.txt with crawler rules
- **Test Results**: 20/20 passing
- **Documentation**: Complete README with SEO guidelines and validation tools
- **Git**: Committed and pushed to GitHub

### ⏳ MILESTONE 4 - CI/CD, Linting, Pre-commit (IN PROGRESS)
- **Target**: Automated testing and code quality enforcement
- **Implementation**:
  - `.github/workflows/ci.yml` - GitHub Actions CI/CD pipeline
  - `.pre-commit-config.yaml` - Pre-commit hooks configuration
  - `pyproject.toml` - Modern Python project configuration
  - `.flake8` - Flake8 linting configuration
  - `tests/test_ci.py` - CI/CD validation tests
  - Updated `requirements.txt` with dev dependencies
- **Components**:
  - GitHub Actions for automated testing (Python 3.9-3.12)
  - Black for code formatting
  - Flake8 and Ruff for linting
  - isort for import sorting
  - mypy for type checking
  - Bandit for security scanning
  - Pre-commit hooks for quality gates
- **Status**: Implementation in progress

### ⏳ MILESTONE 5 - Gemini/LLM Integration
- **Target**: AI-powered personality suggestions
- **Components**: Gemini API integration with fallback stubs

### ⏳ MILESTONE 6 - Deployment Prep
- **Target**: Production deployment ready
- **Components**: Dockerfile, render.yaml, environment setup

### ⏳ MILESTONE 7 - Performance & Accessibility
- **Target**: Lighthouse optimization
- **Components**: Performance audit, accessibility fixes

## 📊 Current API Endpoints

### Big Five Personality Test
- `GET /big-five` - Display test form
- `POST /big-five` - Submit responses and get scores
  - **Input**: `{"answers": [1-5, ...]}`
  - **Output**: Scores, percentiles, suggestions

### Newsletter Subscription
- `POST /api/subscribe` - Subscribe to newsletter
  - **Input**: `{"email": "user@example.com"}`
  - **Output**: Success/error response with email provider info
  - **Features**: Rate limiting (5 req/hour), email validation, SendGrid integration
  - **Security**: Input sanitization, suspicious field detection, idempotent operations

### SEO Endpoints
- `GET /sitemap.xml` - XML sitemap for search engines
- `GET /robots.txt` - Crawler instructions

### Other Routes
- `GET /` - Homepage
- `GET /download` - Chrome Store redirect
- `GET /features` - Features page
- `GET /blog` - Blog listing
- `GET /privacy` - Privacy policy

## 🔧 Development Workflow

### Git Workflow
```bash
# Create feature branch
git checkout -b feature/description

# Make changes and test
pytest -v

# Commit with conventional format
git commit -m "feat: description of changes"

# Push and create PR
git push origin feature/description
```

### Testing Workflow
```bash
# Run all tests
pytest -v

# Run specific test file
pytest tests/test_bigfive.py -v

# Run with coverage
pytest --cov=app tests/
```

### Development Server
```bash
# Start Flask server
python run.py

# Access application
http://127.0.0.1:5000
```

### Code Quality Workflow (MILESTONE 4)
```bash
# Format code
black app/ tests/

# Sort imports
isort app/ tests/

# Run linting
flake8 app/ tests/
ruff check app/ tests/

# Type checking
mypy app/ --ignore-missing-imports

# Run pre-commit hooks
pre-commit run --all-files
```

## 🛡️ Security & Privacy Standards

### Code Security
- ✅ **No hardcoded secrets** - Environment variables only
- ✅ **Input validation** - All endpoints validate input
- ✅ **SQL injection protection** - SQLAlchemy ORM usage
- ✅ **Error handling** - Generic error messages in production
- ✅ **Rate limiting** - IP-based throttling (MILESTONE 2)
- ⏳ **CSRF protection** - Flask-WTF integration (MILESTONE 2)
- ⏳ **Security scanning** - Bandit integration (MILESTONE 4)

### Privacy Requirements
- ✅ **No PII in logs** - Personal data not logged
- ✅ **Explicit opt-in** - Clear consent for newsletter
- ⏳ **Cookie consent** - GDPR compliance (future)
- ✅ **Data minimization** - Only collect necessary data

## 📋 Code Quality Standards

### Python Best Practices
- ✅ **Type hints** - All functions have type annotations
- ✅ **Docstrings** - Comprehensive documentation
- ✅ **PEP8 compliance** - Consistent code formatting
- ✅ **Single responsibility** - Each function has one purpose
- ✅ **Error handling** - Proper exception management
- ⏳ **Code formatting** - Black (100 char line length) (MILESTONE 4)
- ⏳ **Import sorting** - isort with Black profile (MILESTONE 4)

### Testing Standards
- ✅ **Comprehensive coverage** - Edge cases and error conditions
- ✅ **Descriptive test names** - Clear test purpose
- ✅ **Independent tests** - No test dependencies
- ✅ **Fast execution** - Tests complete in <1 second
- ⏳ **Coverage tracking** - pytest-cov integration (MILESTONE 4)

### API Design Standards
- ✅ **RESTful endpoints** - Proper HTTP methods and status codes
- ✅ **JSON responses** - Consistent response format
- ✅ **Input validation** - Comprehensive validation
- ✅ **Error handling** - Proper error responses

### CI/CD Standards (MILESTONE 4)
- ⏳ **Automated testing** - GitHub Actions on every push/PR
- ⏳ **Multi-version testing** - Python 3.9, 3.10, 3.11, 3.12
- ⏳ **Code quality gates** - Linting, formatting, type checking
- ⏳ **Security scanning** - Bandit, Safety checks
- ⏳ **Pre-commit hooks** - Quality checks before commit

## 🔑 Environment Variables

### Required Variables
```bash
# Flask Configuration
SECRET_KEY=your-secret-key-here
FLASK_ENV=development

# Database
DATABASE_URL=sqlite:///focusedroom.db

# Email Service (MILESTONE 2)
MAIL_SERVER=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=your-sendgrid-api-key
MAIL_DEFAULT_SENDER=noreply@focusedroom.com

# Gemini API (MILESTONE 5)
GEMINI_API_KEY=your-gemini-api-key
```

## 🚫 Project Constraints

### What NOT to Modify
- ❌ **Extension files** - Do not modify `../01_FocusedRoom/` unless explicitly requested
- ❌ **Secrets in code** - Never commit API keys or passwords
- ❌ **Database migrations** - Use SQLAlchemy create_all() for now
- ❌ **Main branch** - No direct commits, use feature branches

### What to Always Do
- ✅ **Run tests before commit** - All tests must pass
- ✅ **Update documentation** - Keep README and API docs current
- ✅ **Use environment variables** - Never hardcode configuration
- ✅ **Follow conventional commits** - Clear, descriptive commit messages
- ✅ **Use feature branches** - Single feature per branch
- ✅ **Create PRs** - Code review before merge

## 🎯 Cursor AI Best Practices

### Code Generation
- ✅ **Generate complete, working code** - Not just snippets
- ✅ **Include error handling** - Comprehensive exception management
- ✅ **Add type hints** - Full type annotations
- ✅ **Write tests** - Generate test cases for new functionality
- ✅ **Update documentation** - Keep docs in sync with code

### Code Review
- ✅ **Check for security issues** - No secrets, proper validation
- ✅ **Verify test coverage** - All new code has tests
- ✅ **Ensure consistency** - Follow established patterns
- ✅ **Validate functionality** - Code works as intended

### File Management
- ✅ **One feature per PR** - Atomic changes when possible
- ✅ **Preserve file names** - Include file path in patches
- ✅ **Explain modifications** - Document any changes to patches

## 📈 Success Metrics

### Code Quality
- **Test Coverage**: >80% (currently ~95%)
- **Test Pass Rate**: 100% (72/72 tests passing)
- **Security**: No known vulnerabilities
- **Performance**: <200ms response time
- **Code Style**: PEP8 compliant, Black formatted (target for MILESTONE 4)

### Development Efficiency
- **Feature Completion**: On schedule (3/7 milestones complete)
- **Bug Rate**: Minimal post-merge issues
- **Documentation**: Complete and current
- **Deployment**: Ready for production preparation (MILESTONE 6)

## 🔄 Current Session Context

### Completed Milestones
- ✅ MILESTONE 1: Big Five personality scoring (31 tests)
- ✅ MILESTONE 2: Subscribe & Email (21 tests)
- ✅ MILESTONE 3: SEO, Sitemap, OG Images (20 tests)
- **Total**: 72/72 tests passing (100% success rate)

### Current Task
- 🎯 MILESTONE 4: CI/CD, Linting, Pre-commit
- 🎯 Focus: GitHub Actions, code quality tools, pre-commit hooks
- 🎯 Next: Test implementation and validation

### Session Notes
- User prefers step-by-step debugging guidance
- User wants organized, logical file structure
- User requires proper line numbers and file scanning before changes
- User wants production-grade, industry-standard solutions
- User emphasizes no bandaid fixes, only root cause solutions
- Chrome compatibility issue resolved with explicit host binding (MILESTONE 1)

---

**This context file should be referenced at the start of each development session to maintain consistency and quality standards.**
