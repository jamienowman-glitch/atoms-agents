import os
import psycopg2
from pathlib import Path

# Config
VAULT_KEY_PATH = "/Users/jaynowman/northstar-keys/supabase-db-url.txt"
SQL_FILES = [
    "/Users/jaynowman/dev/atoms-core/sql/060_marketplace_payouts.sql",
    "/Users/jaynowman/dev/atoms-core/sql/061_merkle_roots.sql"
]

def main():
    print(f"🚀 Applying Marketplace Schemas...")

    # 1. Get DB URL
    if not os.path.exists(VAULT_KEY_PATH):
        print(f"❌ Error: Vault key not found at {VAULT_KEY_PATH}")
        return
    
    with open(VAULT_KEY_PATH, 'r') as f:
        db_url = f.read().strip()

    # 2. Connect
    try:
        conn = psycopg2.connect(db_url)
        conn.autocommit = True
        cur = conn.cursor()
        print("✅ Connected to Database")
    except Exception as e:
        print(f"❌ Connection Failed: {e}")
        return

    # 3. Apply SQL
    for sql_file in SQL_FILES:
        try:
            print(f"Applying {os.path.basename(sql_file)}...")
            with open(sql_file, 'r') as f:
                sql = f.read()
                cur.execute(sql)
                print(f"  ✅ Applied Successfully!")
        except Exception as e:
            print(f"  ⚠️ SQL Execution Failed (Check logs): {e}")
            
    conn.close()

if __name__ == "__main__":
    main()
