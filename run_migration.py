"""
Script to add verification flag columns to the users table.
Run this script to update your database schema.
"""

import psycopg2
from app.core.config import settings

def run_migration():
    """Add verification flag columns to users table."""
    
    # Parse DATABASE_URL
    # Format: postgresql://user:password@host:port/database
    db_url = settings.DATABASE_URL
    
    try:
        # Connect to database
        print("Connecting to database...")
        conn = psycopg2.connect(db_url)
        cursor = conn.cursor()
        
        print("Adding verification flag columns...")
        
        # Add columns
        cursor.execute("""
            ALTER TABLE users 
            ADD COLUMN IF NOT EXISTS password_change_verified BOOLEAN DEFAULT FALSE NOT NULL,
            ADD COLUMN IF NOT EXISTS account_delete_verified BOOLEAN DEFAULT FALSE NOT NULL,
            ADD COLUMN IF NOT EXISTS verification_expiry TIMESTAMP;
        """)
        
        conn.commit()
        print("✓ Columns added successfully!")
        
        # Verify columns were added
        cursor.execute("""
            SELECT column_name, data_type, is_nullable, column_default
            FROM information_schema.columns
            WHERE table_name = 'users'
            AND column_name IN ('password_change_verified', 'account_delete_verified', 'verification_expiry');
        """)
        
        columns = cursor.fetchall()
        print("\nVerification:")
        for col in columns:
            print(f"  - {col[0]}: {col[1]} (nullable: {col[2]}, default: {col[3]})")
        
        cursor.close()
        conn.close()
        
        print("\n✓ Migration completed successfully!")
        print("You can now restart your backend server.")
        
    except Exception as e:
        print(f"\n✗ Migration failed: {e}")
        print("\nAlternatively, you can run this SQL manually in your PostgreSQL database:")
        print("""
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password_change_verified BOOLEAN DEFAULT FALSE NOT NULL,
ADD COLUMN IF NOT EXISTS account_delete_verified BOOLEAN DEFAULT FALSE NOT NULL,
ADD COLUMN IF NOT EXISTS verification_expiry TIMESTAMP;
        """)

if __name__ == "__main__":
    run_migration()
