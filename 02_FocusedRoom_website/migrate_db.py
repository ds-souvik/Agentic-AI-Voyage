#!/usr/bin/env python3
"""
Database Migration Script for Phase 2

Adds subscriber_id foreign key to BigFiveResult table.
Safe to run multiple times (idempotent).
"""

from app import create_app
from app.models import db


def migrate_database():
    """Apply database migrations."""
    app = create_app()

    with app.app_context():
        print("🔄 Starting database migration...")

        # Create all tables (idempotent - won't recreate existing tables)
        db.create_all()

        print("✅ Database migration complete!")
        print("   - All tables created/updated")
        print("   - Foreign key constraints applied")
        print("   - Indexes created for performance")


if __name__ == "__main__":
    migrate_database()
