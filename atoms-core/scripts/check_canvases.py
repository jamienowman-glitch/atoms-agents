import os
import psycopg2
from tabulate import tabulate

# 1. Load Credentials
VAULT_PATH = "/Users/jaynowman/northstar-keys/"
def read_vault(filename):
    with open(os.path.join(VAULT_PATH, filename), "r") as f:
        return f.read().strip()

DB_URL = read_vault("supabase-db-url.txt")

# 2. Connect & Query
try:
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    
    print("\n🔍 Checking 'public.canvases'...")
    cur.execute("SELECT * FROM public.canvases;")
    rows = cur.fetchall()
    
    if not rows:
        print("⚠️  Result: TABLE IS EMPTY")
    else:
        print(f"✅ Result: Found {len(rows)} Canvases")
        # Get Headers
        headers = [desc[0] for desc in cur.description]
        print(tabulate(rows, headers=headers, tablefmt="grid"))
        
    cur.close()
    conn.close()

except Exception as e:
    print(f"❌ Error: {e}")
