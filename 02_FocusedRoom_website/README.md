# Focused Room Website

Privacy-first landing page and web platform for the Focused Room Chrome extension.

## Features

- **Landing Page**: Modern, SEO-optimized homepage showcasing the extension
- **Big Five Personality Test**: Science-backed personality assessment with scoring
- **Newsletter Subscription**: Email collection for updates and launch announcements
- **Blog**: Educational content about productivity and focus
- **Chrome Store Redirect**: Direct download link to extension

## Tech Stack

- **Backend**: Flask (Python 3.9+)
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: SQLAlchemy
- **Testing**: pytest
- **Deployment**: Render / Railway compatible

## Local Development Setup

### Prerequisites

- Python 3.9 or higher
- pip (Python package manager)
- Git

### Installation

1. **Clone the repository**
   ```bash
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
   
   Create a `.env` file in the project root (see Environment Variables section below).

5. **Run the application**
   ```bash
   python run.py
   ```

6. **Access the application**
   
   Open your browser to: `http://127.0.0.1:5000`

## Environment Variables

Create a `.env` file in the project root with the following variables:

```bash
# Flask Configuration
SECRET_KEY=your-secret-key-here-change-in-production
FLASK_ENV=development

# Database (optional, defaults to SQLite)
DATABASE_URL=sqlite:///focusedroom.db

# Email Service (for newsletter - MILESTONE 2)
MAIL_SERVER=smtp.sendgrid.net
MAIL_PORT=587
MAIL_USERNAME=apikey
MAIL_PASSWORD=your-sendgrid-api-key
MAIL_DEFAULT_SENDER=noreply@focusedroom.com

# Gemini API (for AI suggestions - MILESTONE 5)
GEMINI_API_KEY=your-gemini-api-key-here
```

**⚠️ IMPORTANT: Never commit the `.env` file or any secrets to version control.**

## API Endpoints

### Big Five Personality Test

#### `POST /big-five`

Submit Big Five personality test responses and receive scores.

**Request Body:**
```json
{
  "answers": [3, 4, 2, 5, 3, ...]  // Array of 44 or 50 numeric values (1-5)
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
  "suggestions": "Your high agreeableness score suggests strong cooperation and empathy. ..."
}
```

**Error Responses:**

- `400 Bad Request`: Invalid input (wrong length, non-numeric, out of range)
- `500 Internal Server Error`: Database or server error

**Validation Rules:**
- Answers must be an array of exactly 44 or 50 numeric values
- Each value must be in the range 1-5 (Likert scale)
- Scores are normalized to 0-100 scale

#### `GET /big-five`

Displays the Big Five personality test form (HTML page).

### Newsletter Subscription

#### `POST /api/subscribe`

Subscribe to newsletter updates.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Subscribed successfully"
}
```

**Note**: Currently uses placeholder emailer. Full implementation in MILESTONE 2.

### Other Routes

- `GET /` - Homepage
- `GET /download` - Redirects to Chrome Web Store
- `GET /features` - Features page (coming soon)
- `GET /blog` - Blog listing (coming soon)
- `GET /privacy` - Privacy policy

## Testing

### Run all tests

```bash
pytest
```

### Run with verbose output

```bash
pytest -v
```

### Run specific test file

```bash
pytest tests/test_bigfive.py
```

### Run with coverage

```bash
pytest --cov=app tests/
```

### Test Coverage

Current test coverage includes:
- ✅ Big Five scoring logic (all edge cases)
- ✅ Input validation
- ✅ Score normalization and percentiles
- ⏳ Newsletter subscription (MILESTONE 2)
- ⏳ Email integration (MILESTONE 2)

## Project Structure

```
02_FocusedRoom_website/
├── app/
│   ├── __init__.py           # Flask app factory
│   ├── config.py             # Configuration
│   ├── models.py             # Database models
│   ├── routes.py             # API routes
│   ├── forms.py              # WTForms (if needed)
│   ├── static/               # CSS, JS, images
│   │   ├── assets/
│   │   ├── css/
│   │   └── js/
│   ├── templates/            # Jinja2 templates
│   │   ├── base.html
│   │   ├── index.html
│   │   ├── bigfive.html
│   │   └── ...
│   └── utils/                # Helper modules
│       ├── bigfive.py        # Big Five scoring logic
│       ├── emailer.py        # Email service (MILESTONE 2)
│       ├── gemini_stub.py    # LLM stub (MILESTONE 5)
│       └── gemini_wrapper.py # LLM wrapper (MILESTONE 5)
├── tests/
│   ├── test_bigfive.py       # Big Five tests
│   └── test_subscribe.py     # Subscription tests (MILESTONE 2)
├── instance/
│   └── focusedroom.db        # SQLite database (dev)
├── requirements.txt          # Python dependencies
├── run.py                    # Application entry point
└── README.md                 # This file
```

## Development Workflow

### Creating a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### Running Tests Before Commit

```bash
pytest -q
```

### Committing Changes

```bash
git add .
git commit -m "feat: descriptive commit message"
```

## Deployment

### Render Deployment (Recommended)

1. **Create a new Web Service** on [Render](https://render.com)
2. **Connect your GitHub repository**
3. **Set environment variables** in Render dashboard
4. **Deploy command**: `gunicorn run:app`
5. **Health check path**: `/`

### Railway Deployment

1. **Create a new project** on [Railway](https://railway.app)
2. **Connect repository**
3. **Add environment variables**
4. Railway will auto-detect Flask and deploy

### Environment Variables for Production

Ensure all required environment variables are set in your hosting platform:
- `SECRET_KEY` (generate a strong random key)
- `DATABASE_URL` (provided by hosting service for PostgreSQL)
- `MAIL_SERVER`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`
- `GEMINI_API_KEY` (optional, for AI features)

## Milestones & Roadmap

- ✅ **MILESTONE 1**: Big Five Core (scoring logic + tests)
- ⏳ **MILESTONE 2**: Subscribe & Email (validation + SendGrid)
- ⏳ **MILESTONE 3**: SEO, Sitemap, OG Images
- ⏳ **MILESTONE 4**: CI/CD, Linting, Pre-commit hooks
- ⏳ **MILESTONE 5**: Gemini/LLM Integration
- ⏳ **MILESTONE 6**: Deployment Prep & Production
- ⏳ **MILESTONE 7**: Performance & Accessibility Audit

## Security & Privacy

- ✅ No API keys in code (environment variables only)
- ✅ Input validation on all endpoints
- ⏳ Rate limiting (MILESTONE 2)
- ⏳ CSRF protection (MILESTONE 2)
- ⏳ Cookie consent (MILESTONE 3)
- ✅ No PII in logs
- ✅ Explicit opt-in for newsletter

## Contributing

This is a focused project with specific milestones. Changes must:
1. Be on a feature branch
2. Include tests with >80% coverage
3. Pass all existing tests
4. Include updated documentation
5. Follow PEP8 style guidelines

## License

Proprietary - All rights reserved

## Contact

For questions or support, visit [focusedroom.com](https://focusedroom.com)

---

**Note**: The Chrome extension source code is located in `../01_FocusedRoom/` and should not be modified as part of website development unless explicitly required.

