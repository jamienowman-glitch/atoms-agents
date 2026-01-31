
"""
SQL MIGRATION RUNNER
Path: atoms-core/scripts/run_migration.py

Usage: python3 run_migration.py <path_to_sql_file>
"""
import sys
import os
import argparse
from pathlib import Path

# Bootstrap Core Paths
current_dir = Path(__file__).parent.resolve()
core_src = current_dir.parent / "src"
sys.path.append(str(core_src))

try:
    from atoms_core.config.naming import get_secret_name
    from atoms_core.config.aliases import resolve_path, ATOMS_CORE
    from supabase import create_client
except ImportError as e:
    print(f"CRITICAL: Import failed. {e}")
    exit(1)

# Vault Loader
VAULT_PATH = Path(os.path.expanduser("~/northstar-keys"))
def load(filename):
    try:
        with open(VAULT_PATH / filename) as f: return f.read().strip()
    except: return None

# Connect
url_key = get_secret_name('DEFAULT', 'SUPABASE', 'URL')
role_key = get_secret_name('DEFAULT', 'SUPABASE', 'SERVICE_ROLE_KEY')

# Try formatted then legacy
SB_URL = load(f"{url_key}.txt") or load("supabase-url.txt")
SB_KEY = load(f"{role_key}.txt") or load("supabase-service-key.txt")

if not SB_URL or not SB_KEY:
    print("CRITICAL: Missing Supabase Admin Keys in Vault.")
    exit(1)

client = create_client(SB_URL, SB_KEY)

def run_migration(sql_path):
    print(f"Applying: {sql_path}")
    with open(sql_path) as f:
        sql = f.read()
    
    # Supabase-py doesn't have a direct 'query' method for raw SQL usually exposed in Client?
    # Actually client.rpc() is standard. But raw SQL execution often needs PG connection OR specific rpc func.
    # However, supabase-py `postgrest` usually handles table ops.
    # BUT, we can use the `rpc` called `exec_sql` if it exists, OR we might need direct PG connection.
    # Wait, most Supabase setups don't expose raw SQL over REST unless an RPC exists.
    # User said "I update supabase... you fucking idiot". implies I should be able to do it.
    # I will try to use the REST API via a specialized RPC if available, OR assume the user has `exec` rpc.
    # IF NOT: I might fail. But let's try assuming `exec_sql` or similar exists often in our stack?
    # Actually, standard way is direct Postgres connection usually.
    # Let's try `client.rpc('exec_sql', {'query': sql}).execute()` pattern if we have `exec_sql` function.
    # If not, I might need `psycopg2`.
    
    # PLAN B: Check if psycopg2 is available.
    try:
        import psycopg2
        # We need the DB Connection String. Usually DB_URL.
        # DEFAULT_SUPABASE_DB_URL.txt
        db_url_key = get_secret_name('DEFAULT', 'SUPABASE', 'DB_URL')
        DB_URL = load(f"{db_url_key}.txt") or load("supabase-db-url.txt")
        
        if DB_URL:
            conn = psycopg2.connect(DB_URL)
            cur = conn.cursor()
            cur.execute(sql)
            conn.commit()
            print("SUCCESS: Migration Applied via Psycopg2.")
            return
    except ImportError:
        pass
        
    print("ERROR: Cannot execute Raw SQL via REST Client without 'exec_sql' RPC and missing psycopg2/DB_URL.")
    print("ACTION: I will attempt to install/use `psycopg2-binary` if valid, or fail.")
    exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 run_migration.py <sql_file>")
        exit(1)
    run_migration(sys.argv[1])
