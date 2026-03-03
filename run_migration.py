"""
Script to run database migrations for reports table
Run this with: python run_migration.py
"""
import psycopg2
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Get database URL
DATABASE_URL = os.getenv('DATABASE_URL')

# Parse the database URL
# Format: postgresql://user:password@host:port/database
url_parts = DATABASE_URL.replace('postgresql://', '').split('@')
user_pass = url_parts[0].split(':')
host_port_db = url_parts[1].split('/')
host_port = host_port_db[0].split(':')

user = user_pass[0]
password = user_pass[1]
host = host_port[0]
port = host_port[1]
database = host_port_db[1]

print(f"Connecting to database: {database} at {host}:{port}")

try:
    # Connect to the database
    conn = psycopg2.connect(
        host=host,
        port=port,
        database=database,
        user=user,
        password=password
    )
    
    # Create a cursor
    cur = conn.cursor()
    
    print("Connected successfully!")
    
    # Migration 1: Add owner_notice column
    cur.execute("""
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='reports' AND column_name='owner_notice';
    """)
    
    if cur.fetchone():
        print("✓ Column 'owner_notice' already exists.")
    else:
        print("Adding 'owner_notice' column to reports table...")
        cur.execute("ALTER TABLE reports ADD COLUMN owner_notice TEXT;")
        conn.commit()
        print("✓ Successfully added 'owner_notice' column!")
    
    # Migration 2: Add is_read column
    cur.execute("""
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='reports' AND column_name='is_read';
    """)
    
    if cur.fetchone():
        print("✓ Column 'is_read' already exists.")
    else:
        print("Adding 'is_read' column to reports table...")
        cur.execute("ALTER TABLE reports ADD COLUMN is_read BOOLEAN NOT NULL DEFAULT false;")
        conn.commit()
        print("✓ Successfully added 'is_read' column!")
    
    # Migration 3: Add owner_is_read column
    cur.execute("""
        SELECT column_name 
        FROM information_schema.columns 
        WHERE table_name='reports' AND column_name='owner_is_read';
    """)
    
    if cur.fetchone():
        print("✓ Column 'owner_is_read' already exists.")
    else:
        print("Adding 'owner_is_read' column to reports table...")
        cur.execute("ALTER TABLE reports ADD COLUMN owner_is_read BOOLEAN NOT NULL DEFAULT false;")
        conn.commit()
        print("✓ Successfully added 'owner_is_read' column!")
    
    # Close cursor and connection
    cur.close()
    conn.close()
    
    print("\nAll migrations completed successfully!")
    
except Exception as e:
    print(f"Error: {e}")
    if conn:
        conn.rollback()
