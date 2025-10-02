"""
Application entry point for Focused Room Website.

This module loads environment variables and starts the Flask application.
Environment variables are loaded from .env file using python-dotenv.
"""

import os
from pathlib import Path

from dotenv import load_dotenv

# Load environment variables from .env file
# This MUST happen before importing app to ensure Config can read env vars
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

# Verify critical environment variables (optional but recommended for debugging)
if __name__ == "__main__":
    # Only show this info when running directly, not in production
    print("🔧 Environment Configuration:")
    secret_key_status = "✅ Set" if os.environ.get("SECRET_KEY") else "❌ Not set (using default)"
    print(f"   - SECRET_KEY: {secret_key_status}")

    db_url_status = "✅ Set" if os.environ.get("DATABASE_URL") else "❌ Not set (using default)"
    print(f"   - DATABASE_URL: {db_url_status}")

    gemini_key = os.environ.get("GEMINI_API_KEY", "")
    if gemini_key:
        gemini_status = f"✅ Set ({len(gemini_key)} chars)"
    else:
        gemini_status = "❌ Not set (using fallback)"
    print(f"   - GEMINI_API_KEY: {gemini_status}")
    print()

# Now import app AFTER environment is loaded
from app import create_app  # noqa: E402

app = create_app()

if __name__ == "__main__":
    print("🚀 Starting Flask development server...")
    print("   📍 URL: http://127.0.0.1:5000")
    print("   🔄 Debug mode: ON")
    print()
    app.run(debug=True, host="127.0.0.1", port=5000)
