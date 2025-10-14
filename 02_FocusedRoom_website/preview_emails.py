#!/usr/bin/env python3
"""
Email Preview Script for Focused Room

This script generates HTML previews of the emails WITHOUT sending them.
Perfect for reviewing designs before sending to users.

Usage:
    python preview_emails.py
"""

import sys
from pathlib import Path

# Add parent directory to path for imports
sys.path.insert(0, ".")

from app import create_app
from app.models import BigFiveResult, Subscriber
from app.utils.emailer import email_service


def preview_emails():
    """Generate HTML previews of both emails."""
    app = create_app()

    with app.app_context():
        print("=" * 70)
        print("👁️  FOCUSED ROOM - EMAIL PREVIEW GENERATOR")
        print("=" * 70)

        # Create preview directory
        preview_dir = Path("email_previews")
        preview_dir.mkdir(exist_ok=True)

        # Get sample data from database
        subscriber = Subscriber.query.first()
        if subscriber:
            email = subscriber.email
            user_name = email.split("@")[0].replace(".", " ").title().split()[0]
            big_five = subscriber.big_five_results.first()

            print(f"\n📧 Using data from: {email}")
            print(f"👤 User Name: {user_name}")

            if big_five:
                scores = big_five.scores.get("scores", {})
                markdown_report = big_five.suggestions or "No report available"
                print(f"🧠 Big Five Result: Found")
            else:
                print("⚠️  No Big Five result - using sample data")
                scores = {
                    "openness": 75,
                    "conscientiousness": 80,
                    "extraversion": 65,
                    "agreeableness": 70,
                    "neuroticism": 45,
                }
                markdown_report = "## Sample Report\n\nThis is a sample personality report."
        else:
            print("\n⚠️  No subscribers in database - using sample data")
            user_name = "Friend"
            scores = {
                "openness": 75,
                "conscientiousness": 80,
                "extraversion": 65,
                "agreeableness": 70,
                "neuroticism": 45,
            }
            markdown_report = "## Sample Report\n\nThis is a sample personality report."

        # Generate Email #1: Welcome + Vision
        print("\n" + "=" * 70)
        print("📧 EMAIL #1: WELCOME + VISION")
        print("=" * 70)

        welcome_html = email_service._get_welcome_vision_email_html(user_name)
        welcome_file = preview_dir / "01_welcome_vision.html"

        with open(welcome_file, "w", encoding="utf-8") as f:
            f.write(welcome_html)

        print(f"✅ Preview saved to: {welcome_file}")
        print(f"   Open in browser to view!")

        # Generate Email #2: Big Five Report
        print("\n" + "=" * 70)
        print("📧 EMAIL #2: BIG FIVE PERSONALITY REPORT")
        print("=" * 70)

        report_html = email_service._get_big_five_report_email_html(
            user_name, markdown_report, scores
        )
        report_file = preview_dir / "02_big_five_report.html"

        with open(report_file, "w", encoding="utf-8") as f:
            f.write(report_html)

        print(f"✅ Preview saved to: {report_file}")
        print(f"   Open in browser to view!")

        # Summary
        print("\n" + "=" * 70)
        print("✅ PREVIEW GENERATION COMPLETE!")
        print("=" * 70)
        print(f"\n📂 Preview files saved in: {preview_dir.absolute()}/")
        print("\n💡 NEXT STEPS:")
        print("   1. Open the HTML files in your browser")
        print("   2. Review the design, content, and formatting")
        print("   3. Check on both desktop and mobile view")
        print("   4. If approved, run test_send_emails.py to send test emails")
        print("=" * 70)
        print("\n🚀 To send test emails:")
        print("   python test_send_emails.py --email souvik312@gmail.com")
        print("=" * 70)


if __name__ == "__main__":
    preview_emails()

