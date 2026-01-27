import os
import psycopg2

# 1. Load DB URL from Vault
with open('/Users/jaynowman/northstar-keys/supabase-db-url.txt', 'r') as f:
    DB_URL = f.read().strip()

# 2. Load Migration SQL
MIGRATION_FILE = '/Users/jaynowman/dev/atoms-core/sql/011_complete_registry.sql'
with open(MIGRATION_FILE, 'r') as f:
    SQL = f.read()

# 3. Apply
print(f"Connecting to {DB_URL.split('@')[1]}...") # Log safe part
try:
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    cur.execute(SQL)
    conn.commit()
    print("Migration applied successfully!")
    cur.close()
    conn.close()
except Exception as e:
    print(f"Migration failed: {e}")
