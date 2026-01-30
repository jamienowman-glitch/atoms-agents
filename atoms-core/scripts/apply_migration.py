import os
import asyncio
import psycopg2
from urllib.parse import urlparse

# --- SETUP ---
VAULT_PATH = "/Users/jaynowman/northstar-keys/"

def read_vault(filename):
    try:
        with open(os.path.join(VAULT_PATH, filename), "r") as f:
            return f.read().strip()
    except FileNotFoundError:
        print(f"❌ Critical: Could not find vault key {filename}")
        exit(1)

# Read Connection String
DB_URL = read_vault("supabase-db-url.txt")

def apply_migration(sql_path):
    print(f"🔄 Applying Migration: {sql_path}...")
    
    try:
        # Connect to Postgres
        conn = psycopg2.connect(DB_URL)
        conn.autocommit = True # Important for some DDL
        cur = conn.cursor()
        
        # Read SQL
        with open(sql_path, 'r') as f:
            sql_content = f.read()
            
        # Execute
        cur.execute(sql_content)
        
        print("✅ Migration Applied Successfully.")
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Migration Failed: {e}")
        exit(1)

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Usage: python3 apply_migration.py <sql_file>")
        exit(1)
        
    apply_migration(sys.argv[1])
