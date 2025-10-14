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

from app.models import BigFiveResult, Subscriber, db
from app.utils.emailer import email_service


def extract_name_from_email(email: str) -> str:
    """Extract a name from email address."""
    name = email.split("@")[0]
    name = name.replace(".", " ").replace("_", " ").title()
    return name.split()[0] if " " in name else name


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
    print(f"\n🔗 Connecting to database...")
    engine = create_engine(db_url)
    Session = scoped_session(sessionmaker(bind=engine))
    session = Session()

    try:
        # Get all subscribers
        subscribers = session.query(Subscriber).order_by(Subscriber.created_at).all()
        total_subscribers = len(subscribers)

        print(f"✅ Connected successfully!")
        print(f"📊 Found {total_subscribers} subscribers in database")

        # Count subscribers with Big Five results
        with_big_five = sum(
            1
            for sub in subscribers
            if session.query(BigFiveResult).filter_by(subscriber_id=sub.id).first()
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

        # Track results
        results = {"welcome_success": 0, "welcome_fail": 0, "report_success": 0, "report_fail": 0}

        # Send emails to each subscriber
        for i, subscriber in enumerate(subscribers, 1):
            email = subscriber.email
            user_name = extract_name_from_email(email)

            print(f"\n[{i}/{total_subscribers}] Processing: {email}")
            print(f"   Name: {user_name}")

            # Send Email #1: Welcome + Vision
            if not dry_run:
                try:
                    result = email_service.send_welcome_vision_email(email, user_name)
                    if result.get("success"):
                        print("   ✅ Welcome email sent")
                        results["welcome_success"] += 1
                    else:
                        print(f"   ❌ Welcome email failed: {result.get('error')}")
                        results["welcome_fail"] += 1
                    time.sleep(0.5)  # Rate limiting
                except Exception as e:
                    print(f"   ❌ Welcome email exception: {str(e)}")
                    results["welcome_fail"] += 1
            else:
                print("   [DRY RUN] Would send Welcome email")
                results["welcome_success"] += 1

            # Send Email #2: Big Five Report (if exists)
            big_five = session.query(BigFiveResult).filter_by(subscriber_id=subscriber.id).first()
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
                            print("   ✅ Big Five report sent")
                            results["report_success"] += 1
                        else:
                            print(f"   ❌ Big Five report failed: {result.get('error')}")
                            results["report_fail"] += 1
                        time.sleep(0.5)  # Rate limiting
                    except Exception as e:
                        print(f"   ❌ Big Five report exception: {str(e)}")
                        results["report_fail"] += 1
                else:
                    print("   [DRY RUN] Would send Big Five report")
                    results["report_success"] += 1
            else:
                print("   ⚠️  No Big Five result - skipping report email")

        # Summary
        print("\n" + "=" * 80)
        print("✅ EMAIL CAMPAIGN COMPLETE!")
        print("=" * 80)
        print(f"\n📊 RESULTS:")
        print(f"   Welcome Emails:")
        print(f"     ✅ Sent: {results['welcome_success']}")
        print(f"     ❌ Failed: {results['welcome_fail']}")
        print(f"\n   Big Five Reports:")
        print(f"     ✅ Sent: {results['report_success']}")
        print(f"     ❌ Failed: {results['report_fail']}")
        print(f"\n   TOTAL EMAILS SENT: {results['welcome_success'] + results['report_success']}")
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

