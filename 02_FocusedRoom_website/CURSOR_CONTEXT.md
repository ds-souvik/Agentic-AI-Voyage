# Cursor AI Development Context - Focused Room Website

## 🎯 Project Overview

**Project Name**: Focused Room Website  
**Repository**: `02_FocusedRoom_website/`  
**Purpose**: Privacy-first landing page and web platform for the Focused Room Chrome extension  
**Current Status**: MILESTONE 1 Complete ✅ | MILESTONE 2 In Progress  

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
- **Code Quality**: Type hints, docstrings, PEP8

## 📁 Project Structure
02_FocusedRoom_website/
├── app/
│ ├── init.py # Flask app factory
│ ├── config.py # Configuration management
│ ├── models.py # Database models (SQLAlchemy)
│ ├── routes.py # API routes and endpoints
│ ├── forms.py # WTForms (if needed)
│ ├── static/ # CSS, JS, images
│ │ ├── assets/
│ │ ├── css/
│ │ └── js/
│ ├── templates/ # Jinja2 templates
│ │ ├── base.html
│ │ ├── index.html
│ │ ├── bigfive.html
│ │ └── ...
│ └── utils/ # Helper modules
│ ├── bigfive.py # ✅ Big Five scoring logic
│ ├── emailer.py # ⏳ Email service (MILESTONE 2)
│ ├── gemini_stub.py # ⏳ LLM stub (MILESTONE 5)
│ └── gemini_wrapper.py # ⏳ LLM wrapper (MILESTONE 5)
├── tests/
│ ├── init.py # Makes tests a package
│ ├── test_bigfive.py # ✅ Big Five tests (31 tests)
│ └── test_subscribe.py # ⏳ Subscription tests (MILESTONE 2)
├── instance/
│ └── focusedroom.db # SQLite database (dev)
├── pytest.ini # Pytest configuration
├── requirements.txt # Python dependencies
├── run.py # Application entry point
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
- **Status**: Complete and tested
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
- **Ready for**: GitHub commit and merge to main

### Newsletter Subscription
- `POST /api/subscribe` - Subscribe to newsletter
  - **Input**: `{"email": "user@example.com"}`
  - **Output**: Success/error response with email provider info
  - **Features**: Rate limiting (5 req/hour), email validation, SendGrid integration
  - **Security**: Input sanitization, suspicious field detection, idempotent operations

### ⏳ MILESTONE 3 - SEO, Sitemap, OG Images
- **Target**: Search engine optimization and social sharing
- **Components**: sitemap.xml, robots.txt, OG tags, JSON-LD schema

### ⏳ MILESTONE 4 - CI/CD, Linting, Pre-commit
- **Target**: Automated testing and code quality
- **Components**: GitHub Actions, flake8/ruff, pre-commit hooks

### ⏳ MILESTONE 5 - Gemini/LLM Integration
- **Target**: AI-powered personality suggestions
- **Components**: Gemini API integration with fallback stubs

### ⏳ MILESTONE 6 - Deployment Prep
- **Target**: Production deployment ready
- **Components**: Dockerfile, render.yaml, environment setup

### ⏳ MILESTONE 7 - Performance & Accessibility
- **Target**: Lighthouse optimization
- **Components**: Performance audit, accessibility fixes

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

## 🛡️ Security & Privacy Standards

### Code Security
- ✅ **No hardcoded secrets** - Environment variables only
- ✅ **Input validation** - All endpoints validate input
- ✅ **SQL injection protection** - SQLAlchemy ORM usage
- ✅ **Error handling** - Generic error messages in production
- ⏳ **Rate limiting** - IP-based throttling (MILESTONE 2)
- ⏳ **CSRF protection** - Flask-WTF integration (MILESTONE 2)

### Privacy Requirements
- ✅ **No PII in logs** - Personal data not logged
- ✅ **Explicit opt-in** - Clear consent for newsletter
- ⏳ **Cookie consent** - GDPR compliance (MILESTONE 3)
- ⏳ **Data minimization** - Only collect necessary data

## 📋 Code Quality Standards

### Python Best Practices
- ✅ **Type hints** - All functions have type annotations
- ✅ **Docstrings** - Comprehensive documentation
- ✅ **PEP8 compliance** - Consistent code formatting
- ✅ **Single responsibility** - Each function has one purpose
- ✅ **Error handling** - Proper exception management

### Testing Standards
- ✅ **Comprehensive coverage** - Edge cases and error conditions
- ✅ **Descriptive test names** - Clear test purpose
- ✅ **Independent tests** - No test dependencies
- ✅ **Fast execution** - Tests complete in <1 second

### API Design Standards
- ✅ **RESTful endpoints** - Proper HTTP methods and status codes
- ✅ **JSON responses** - Consistent response format
- ✅ **Input validation** - Comprehensive validation
- ✅ **Error handling** - Proper error responses

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

## 📊 Current API Endpoints

### Big Five Personality Test
- `GET /big-five` - Display test form
- `POST /big-five` - Submit responses and get scores
  - **Input**: `{"answers": [1-5, ...]}`
  - **Output**: Scores, percentiles, suggestions

### ✅ MILESTONE 2 - Subscribe & Email (COMPLETE)
- **Status**: Complete and tested
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
- **Ready for**: GitHub commit and merge to main

### Other Routes
- `GET /` - Homepage
- `GET /download` - Chrome Store redirect
- `GET /features` - Features page (planned)
- `GET /blog` - Blog listing (planned)
- `GET /privacy` - Privacy policy

## 🚫 Project Constraints

### What NOT to Modify
- ❌ **Extension files** - Do not modify `../01_FocusedRoom/` unless explicitly requested
- ❌ **Secrets in code** - Never commit API keys or passwords
- ❌ **Database migrations** - Use SQLAlchemy create_all() for now

### What to Always Do
- ✅ **Run tests before commit** - All tests must pass
- ✅ **Update documentation** - Keep README and API docs current
- ✅ **Use environment variables** - Never hardcode configuration
- ✅ **Follow conventional commits** - Clear, descriptive commit messages

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
- **Test Coverage**: >80% (currently 100% for Big Five)
- **Test Pass Rate**: 100%
- **Security**: No vulnerabilities
- **Performance**: <200ms response time

### Development Efficiency
- **Feature Completion**: On schedule
- **Bug Rate**: Minimal post-merge issues
- **Documentation**: Complete and current
- **Deployment**: Ready for production

## 🔄 Current Session Context

### Last Completed
- ✅ MILESTONE 1: Big Five personality scoring
- ✅ 31 comprehensive tests implemented
- ✅ API endpoints functional
- ✅ Documentation complete
- ✅ Code committed and pushed to GitHub

### Current Task
- 🎯 MILESTONE 2: Subscribe & Email implementation
- 🎯 Focus: Newsletter subscription with validation and rate limiting
- 🎯 Next: SendGrid email integration

### Session Notes
- User prefers step-by-step debugging guidance
- User prefers detailed analysis over quick fixes
- User wants code patches to preserve original intent
- Chrome compatibility issue resolved with explicit host binding

---

**This context file should be referenced at the start of each development session to maintain consistency and quality standards.**