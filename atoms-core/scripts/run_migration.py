import os
import sys
import argparse
from pathlib import Path

# Try to import psycopg2
try:
    import psycopg2
except ImportError:
    print("❌ Error: psycopg2 module not found.")
    print("   Please run: pip install psycopg2-binary")
    sys.exit(1)

# Config
VAULT_DIR = Path("/Users/jaynowman/northstar-keys")

def read_vault(filename):
    path = VAULT_DIR / filename
    if not path.exists():
        return None
    with open(path, "r") as f:
        return f.read().strip()

def run_migration(sql_file_path):
    print(f"🚀 Starting Migration: {sql_file_path}...")

    # 1. Get Credentials
    db_url = read_vault("postgres-connection-string.txt")
    if not db_url:
        # print("⚠️  Warning: 'postgres-connection-string.txt' not found in Vault.")
        db_url = read_vault("db-url.txt")
    
    if not db_url:
        db_url = read_vault("supabase-db-url.txt")

    if not db_url:
        print("❌ FATAL: Could not find Postgres Connection String in Vault.")
        sys.exit(1)

    # 2. Read SQL
    migration_file = Path(sql_file_path)
    if not migration_file.exists():
        print(f"❌ FATAL: SQL file not found at {migration_file}")
        sys.exit(1)

    with open(migration_file, "r") as f:
        sql = f.read()

    # 3. Execute
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        print(f"📄 Executing SQL...")
        cur.execute(sql)
        conn.commit()
        cur.close()
        conn.close()
        print("✅ Migration executed successfully.")

    except Exception as e:
        print(f"❌ Database Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run a SQL migration file.")
    parser.add_argument("file", help="Path to the SQL file to execute")
    args = parser.parse_args()
    
    run_migration(args.file)
