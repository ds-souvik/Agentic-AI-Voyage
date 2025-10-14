#!/usr/bin/env python3
"""
Test Email Sending Script for Focused Room

This script sends test emails to verify the email infrastructure works correctly.
It sends:
1. Welcome + Vision email from founder
2. Big Five personality report email

Usage:
    python test_send_emails.py --email souvik312@gmail.com
    python test_send_emails.py  # Uses first subscriber from database
"""

import argparse
import sys
from datetime import datetime

# Add parent directory to path for imports
sys.path.insert(0, ".")

from app import create_app
from app.models import Subscriber
from app.utils.emailer import email_service


def extract_name_from_big_five_report(report: str) -> str | None:
    """
    Extract user's actual name from Big Five report markdown.
    Pattern: ## 🎯 NAME, Here's Your Unique Personality Blueprint
    """
    import re

    # Try pattern: ## 🎯 NAME,
    match = re.search(r"##\s*🎯\s*([^,]+),", report)
    if match:
        name = match.group(1).strip()
        # Remove any remaining emoji or special chars
        name = re.sub(r"[^\w\s-]", "", name).strip()
        return name if name else None

    # Fallback: Try HTML pattern
    match = re.search(r"<h2>.*?>\s*([^,]+),\s*Here\'s Your Unique Personality Blueprint", report)
    if match:
        name = match.group(1).strip()
        name = re.sub(r"[^\w\s-]", "", name).strip()
        return name if name else None

    return None


def extract_name_from_email(email: str) -> str:
    """
    Fallback: Extract a name from email address.
    Only used if Big Five report doesn't have name.
    """
    username = email.split("@")[0]

    # Handle common separators (. _ -)
    if "." in username:
        return username.split(".")[0].title()
    elif "_" in username:
        return username.split("_")[0].title()
    elif "-" in username:
        return username.split("-")[0].title()
    else:
        # For combined names or usernames, use generic greeting
        if len(username) >= 10:
            return "there"
        return username.title()


def send_test_emails(target_email: str = None, use_db: bool = True):
    """
    Send test emails to verify email infrastructure.

    Args:
        target_email: Specific email to send to (optional)
        use_db: Whether to pull data from database (default: True)
    """
    app = create_app()

    with app.app_context():
        print("=" * 70)
        print("🧪 FOCUSED ROOM - EMAIL TESTING SCRIPT")
        print("=" * 70)
        print(f"⏰ Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"📧 Email Provider: {email_service.provider}")
        print(f"📤 Sender: {email_service.mail_sender}")
        print("=" * 70)

        # Determine target email and get user data
        if use_db:
            if target_email:
                subscriber = Subscriber.query.filter_by(email=target_email).first()
                if not subscriber:
                    print(f"\n❌ Email {target_email} not found in database")
                    print("   Creating mock subscriber for testing...")
                    subscriber = None
                    email = target_email
                else:
                    email = subscriber.email
            else:
                # Get first subscriber from database
                subscriber = Subscriber.query.first()
                if not subscriber:
                    print("\n❌ No subscribers found in database")
                    print("   Please provide an email address with --email")
                    return
                email = subscriber.email

            # Get Big Five result if exists (GET THE LATEST ONE!)
            if subscriber:
                from app.models import BigFiveResult

                big_five = subscriber.big_five_results.order_by(
                    BigFiveResult.created_at.desc()
                ).first()
                if big_five:
                    print(f"🧠 Big Five Result Found: ID {big_five.id}")
                    print(f"   Scores: {big_five.scores.get('scores', {})}")
                    print(f"   Report Length: {len(big_five.suggestions)} characters")
                    # Extract name from Big Five report (BEST SOURCE!)
                    user_name = extract_name_from_big_five_report(big_five.suggestions)
                    if user_name:
                        print(f"👤 Name from Big Five: '{user_name}' ✅")
                    else:
                        print("⚠️  Could not extract name from report, using email fallback")
                        user_name = extract_name_from_email(email)
                        print(f"👤 Name from Email: '{user_name}'")
                else:
                    print("⚠️  No Big Five result found for this user")
                    big_five = None
                    user_name = extract_name_from_email(email)
                    print(f"👤 Name from Email: '{user_name}'")
            else:
                big_five = None
                user_name = extract_name_from_email(email)
                print(f"👤 Name from Email: '{user_name}'")

            print(f"\n📧 Target Email: {email}")
        else:
            email = target_email or "test@example.com"
            user_name = extract_name_from_email(email)
            big_five = None
            print(f"\n📧 Target Email: {email} (not using database)")
            print(f"👤 User Name: {user_name}")

        # Send Email #1: Welcome + Vision
        print("\n" + "=" * 70)
        print("📨 EMAIL #1: WELCOME + VISION FROM FOUNDER")
        print("=" * 70)
        try:
            result = email_service.send_welcome_vision_email(email, user_name)

            if result.get("success"):
                print("✅ Welcome email sent successfully!")
                print(f"   Provider: {result.get('provider')}")
                if result.get("status_code"):
                    print(f"   Status Code: {result.get('status_code')}")
                if result.get("message_id"):
                    print(f"   Message ID: {result.get('message_id')}")
            else:
                print("❌ Welcome email failed!")
                print(f"   Error: {result.get('error')}")
                print(f"   Provider: {result.get('provider')}")
        except Exception as e:
            print(f"❌ Exception while sending welcome email: {str(e)}")

        # Send Email #2: Big Five Report (if available)
        if big_five:
            print("\n" + "=" * 70)
            print("📨 EMAIL #2: BIG FIVE PERSONALITY REPORT")
            print("=" * 70)
            try:
                scores = big_five.scores.get("scores", {})
                markdown_report = big_five.suggestions or "No report available"

                result = email_service.send_big_five_report_email(
                    email=email,
                    user_name=user_name,
                    markdown_report=markdown_report,
                    scores=scores,
                )

                if result.get("success"):
                    print("✅ Big Five report email sent successfully!")
                    print(f"   Provider: {result.get('provider')}")
                    if result.get("status_code"):
                        print(f"   Status Code: {result.get('status_code')}")
                    if result.get("message_id"):
                        print(f"   Message ID: {result.get('message_id')}")
                else:
                    print("❌ Big Five report email failed!")
                    print(f"   Error: {result.get('error')}")
                    print(f"   Provider: {result.get('provider')}")
            except Exception as e:
                print(f"❌ Exception while sending Big Five email: {str(e)}")
        else:
            print("\n" + "=" * 70)
            print("⚠️  SKIPPING EMAIL #2: No Big Five result available")
            print("=" * 70)

        print("\n" + "=" * 70)
        print("✅ TEST COMPLETE - CHECK YOUR EMAIL INBOX!")
        print("=" * 70)
        print(f"📬 Email sent to: {email}")
        print("\n💡 NEXT STEPS:")
        print("   1. Check your email inbox (including spam folder)")
        print("   2. Verify both emails look good")
        print("   3. Test on mobile and desktop")
        print("   4. Once approved, we can send to all production users")
        print("=" * 70)


def main():
    """Main entry point for the script."""
    parser = argparse.ArgumentParser(
        description="Send test emails for Focused Room",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python test_send_emails.py
  python test_send_emails.py --email souvik312@gmail.com
  python test_send_emails.py --email test@example.com --no-db
        """,
    )

    parser.add_argument(
        "--email", type=str, help="Email address to send test emails to", default=None
    )

    parser.add_argument(
        "--no-db",
        action="store_true",
        help="Don't use database, send with mock data",
        default=False,
    )

    args = parser.parse_args()

    send_test_emails(target_email=args.email, use_db=not args.no_db)


if __name__ == "__main__":
    main()
