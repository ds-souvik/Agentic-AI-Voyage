#!/usr/bin/env python3
"""
Database migration script to add BlogEngagement table.
Run this script to create the blog engagement table in your database.

Usage:
    python migrate_blog_engagement.py
"""

import sys
from pathlib import Path

# Add parent directory to path to import app modules
sys.path.insert(0, str(Path(__file__).parent))

from app import create_app
from app.models import db


def migrate_blog_engagement():
    """Create the BlogEngagement table."""
    app = create_app()

    with app.app_context():
        print("🔄 Starting blog engagement migration...")

        try:
            # Create the table
            db.create_all()
            print("✅ BlogEngagement table created successfully!")

            # Verify the table exists
            from sqlalchemy import inspect

            inspector = inspect(db.engine)
            tables = inspector.get_table_names()

            if "blog_engagement" in tables:
                print("✅ Verified: blog_engagement table exists")
                columns = [col["name"] for col in inspector.get_columns("blog_engagement")]
                print(f"   Columns: {', '.join(columns)}")
            else:
                print("⚠️  Warning: blog_engagement table not found in database")

            print("\n🎉 Migration completed successfully!")
            print("\n📊 Blog engagement features are now active:")
            print("   - Like/Unlike posts")
            print("   - Helpful voting")
            print("   - Feedback collection")
            print("   - Anonymous tracking via IP + User Agent hash")

        except Exception as e:
            print(f"❌ Migration failed: {str(e)}")
            raise


if __name__ == "__main__":
    migrate_blog_engagement()
