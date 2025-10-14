#!/usr/bin/env python3
"""
Production Email Sender for Focused Room

This script sends emails to ALL subscribers in the PRODUCTION database.

⚠️  WARNING: This script sends REAL emails to REAL users.
    Only run this AFTER testing and approval!

Sends:
1. Welcome + Vision email from founder (to ALL subscribers)
2. Big Five personality report (only to those who took the test)

Usage:
    python send_to_production_users.py --production-db-url "postgresql://..."
    python send_to_production_users.py  # Interactive mode (prompts for confirmation)
"""

import argparse
import os
import sys
import time
from datetime import datetime

# Add parent directory to path for imports
sys.path.insert(0, ".")

from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

from app.models import BigFiveResult, Subscriber
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


def send_to_all_users(db_url: str = None, dry_run: bool = False):
    """
    Send emails to all production users.

    Args:
        db_url: Production database URL (if None, uses environment variable)
        dry_run: If True, show what would be sent without actually sending
    """
    # Get database URL
    if not db_url:
        db_url = os.environ.get("DATABASE_URL")
        if not db_url:
            print("❌ No database URL provided!")
            print("   Set DATABASE_URL environment variable or use --production-db-url")
            return

    print("=" * 80)
    print("🚀 FOCUSED ROOM - PRODUCTION EMAIL SENDER")
    print("=" * 80)
    print(f"⏰ Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"📧 Email Provider: {email_service.provider}")
    print(f"📤 Sender: {email_service.mail_sender}")
    print(f"🔧 Mode: {'DRY RUN (no emails sent)' if dry_run else 'PRODUCTION (REAL EMAILS)'}")
    print("=" * 80)

    # Connect to production database
    print("\n🔗 Connecting to database...")
    engine = create_engine(db_url)
    Session = scoped_session(sessionmaker(bind=engine))
    session = Session()

    try:
        # Get all subscribers
        subscribers = session.query(Subscriber).order_by(Subscriber.created_at).all()
        total_subscribers = len(subscribers)

        print("✅ Connected successfully!")
        print(f"📊 Found {total_subscribers} subscribers in database")

        # Count subscribers with Big Five results
        with_big_five = sum(
            1
            for sub in subscribers
            if session.query(BigFiveResult)
            .filter_by(subscriber_id=sub.id)
            .order_by(BigFiveResult.created_at.desc())
            .first()
        )

        print(f"🧠 {with_big_five} have Big Five results")
        print(f"📧 {total_subscribers} will receive Welcome email")
        print(f"📧 {with_big_five} will receive Big Five report email")

        # Confirmation prompt
        if not dry_run:
            print("\n" + "=" * 80)
            print("⚠️  WARNING: You are about to send REAL emails to REAL users!")
            print("=" * 80)
            confirmation = input("\nType 'SEND NOW' to proceed: ")
            if confirmation != "SEND NOW":
                print("❌ Cancelled. No emails sent.")
                return

        print("\n" + "=" * 80)
        print("📨 STARTING EMAIL CAMPAIGN...")
        print("=" * 80)

        # Track results and failed emails for notification
        results = {"welcome_success": 0, "welcome_fail": 0, "report_success": 0, "report_fail": 0}
        failed_emails = {
            "welcome": [],  # [(email, user_name, error), ...]
            "report": [],  # [(email, user_name, error), ...]
        }

        # Send emails to each subscriber
        for i, subscriber in enumerate(subscribers, 1):
            email = subscriber.email

            # Get Big Five result first (to extract real name from report)
            big_five = (
                session.query(BigFiveResult)
                .filter_by(subscriber_id=subscriber.id)
                .order_by(BigFiveResult.created_at.desc())
                .first()
            )

            # Extract name from Big Five report (BEST SOURCE!) or fall back to email
            if big_five:
                user_name = extract_name_from_big_five_report(big_five.suggestions)
                if user_name:
                    print(f"\n[{i}/{total_subscribers}] Processing: {email}")
                    print(f"   👤 Name from Big Five: '{user_name}' ✅")
                else:
                    user_name = extract_name_from_email(email)
                    print(f"\n[{i}/{total_subscribers}] Processing: {email}")
                    print(f"   👤 Name from Email: '{user_name}'")
            else:
                user_name = extract_name_from_email(email)
                print(f"\n[{i}/{total_subscribers}] Processing: {email}")
                print(f"   👤 Name from Email: '{user_name}' (no Big Five test)")

            # Send Email #1: Welcome + Vision
            if not dry_run:
                try:
                    result = email_service.send_welcome_vision_email(email, user_name)
                    if result.get("success"):
                        sender_used = result.get("sender_used", "founder@focusedroom.com")
                        if result.get("fallback_used"):
                            print("   ✅ Welcome email sent (via fallback: noreply@)")
                        else:
                            print(f"   ✅ Welcome email sent (from {sender_used})")
                        results["welcome_success"] += 1
                    else:
                        error_msg = result.get("error", "Unknown error")
                        print(f"   ❌ Welcome email failed: {error_msg}")
                        results["welcome_fail"] += 1
                        failed_emails["welcome"].append((email, user_name, error_msg))
                    time.sleep(0.5)  # Rate limiting
                except Exception as e:
                    error_msg = str(e)
                    print(f"   ❌ Welcome email exception: {error_msg}")
                    results["welcome_fail"] += 1
                    failed_emails["welcome"].append((email, user_name, error_msg))
            else:
                print("   [DRY RUN] Would send Welcome email")
                results["welcome_success"] += 1

            # Send Email #2: Big Five Report (if exists)
            if big_five:
                scores = big_five.scores.get("scores", {})
                markdown_report = big_five.suggestions or ""

                if not dry_run:
                    try:
                        result = email_service.send_big_five_report_email(
                            email=email,
                            user_name=user_name,
                            markdown_report=markdown_report,
                            scores=scores,
                        )
                        if result.get("success"):
                            sender_used = result.get("sender_used", "founder@focusedroom.com")
                            if result.get("fallback_used"):
                                print("   ✅ Big Five report sent (via fallback: noreply@)")
                            else:
                                print(f"   ✅ Big Five report sent (from {sender_used})")
                            results["report_success"] += 1
                        else:
                            error_msg = result.get("error", "Unknown error")
                            print(f"   ❌ Big Five report failed: {error_msg}")
                            results["report_fail"] += 1
                            failed_emails["report"].append((email, user_name, error_msg))
                        time.sleep(0.5)  # Rate limiting
                    except Exception as e:
                        error_msg = str(e)
                        print(f"   ❌ Big Five report exception: {error_msg}")
                        results["report_fail"] += 1
                        failed_emails["report"].append((email, user_name, error_msg))
                else:
                    print("   [DRY RUN] Would send Big Five report")
                    results["report_success"] += 1
            else:
                print("   ⚠️  No Big Five result - skipping report email")

        # Summary
        print("\n" + "=" * 80)
        print("✅ EMAIL CAMPAIGN COMPLETE!")
        print("=" * 80)
        print("\n📊 RESULTS:")
        print("   Welcome Emails:")
        print(f"     ✅ Sent: {results['welcome_success']}")
        print(f"     ❌ Failed: {results['welcome_fail']}")
        print("\n   Big Five Reports:")
        print(f"     ✅ Sent: {results['report_success']}")
        print(f"     ❌ Failed: {results['report_fail']}")
        print(f"\n   TOTAL EMAILS SENT: {results['welcome_success'] + results['report_success']}")
        print("=" * 80)

        # Show failed emails for manual follow-up
        if failed_emails["welcome"] or failed_emails["report"]:
            print("\n" + "=" * 80)
            print("⚠️  FAILED EMAILS - MANUAL FOLLOW-UP REQUIRED")
            print("=" * 80)
            print("\n🚨 ACTION REQUIRED: Send these emails manually tomorrow")
            print("   (SendGrid free tier: 100 emails/day limit may have been reached)")

            if failed_emails["welcome"]:
                print(f"\n📧 WELCOME EMAILS FAILED ({len(failed_emails['welcome'])} users):")
                for email, name, error in failed_emails["welcome"]:
                    print(f"   • {email} (Name: {name})")
                    print(f"     Error: {error[:100]}...")  # Truncate long errors

            if failed_emails["report"]:
                print(f"\n🧠 BIG FIVE REPORTS FAILED ({len(failed_emails['report'])} users):")
                for email, name, error in failed_emails["report"]:
                    print(f"   • {email} (Name: {name})")
                    print(f"     Error: {error[:100]}...")  # Truncate long errors

            print("\n💡 To send manually tomorrow:")
            print("   1. Wait for SendGrid daily limit to reset (24 hours)")
            print("   2. Use test_send_emails.py --email <EMAIL> for each failed user")
            print("   3. Or re-run this script with only failed emails")
            print("=" * 80)

        if not dry_run:
            print("\n💡 Users should receive emails within 1-5 minutes")
            print("   Check SendGrid dashboard for delivery status")

    finally:
        session.close()


def main():
    """Main entry point for the script."""
    parser = argparse.ArgumentParser(
        description="Send production emails to all Focused Room subscribers",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
⚠️  WARNING: This sends REAL emails to REAL users!

Examples:
  # Dry run (no emails sent, just preview)
  python send_to_production_users.py --dry-run

  # Production run (requires confirmation)
  python send_to_production_users.py --production-db-url "postgresql://..."

Environment Variables:
  DATABASE_URL - Production PostgreSQL database URL
                 (can be set instead of using --production-db-url)
        """,
    )

    parser.add_argument(
        "--production-db-url",
        type=str,
        help="Production database URL (PostgreSQL connection string)",
        default=None,
    )

    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Preview what would be sent without actually sending emails",
        default=False,
    )

    args = parser.parse_args()

    send_to_all_users(db_url=args.production_db_url, dry_run=args.dry_run)


if __name__ == "__main__":
    main()
