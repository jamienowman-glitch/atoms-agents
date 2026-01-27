import os
import psycopg2
from tabulate import tabulate

VAULT_PATH = "/Users/jaynowman/northstar-keys/"
def read_vault(filename):
    with open(os.path.join(VAULT_PATH, filename), "r") as f:
        return f.read().strip()

DB_URL = read_vault("supabase-db-url.txt")

try:
    conn = psycopg2.connect(DB_URL)
    cur = conn.cursor()
    
    print("\n🔍 Checking 'public.surfaces'...")
    cur.execute("SELECT key, name FROM public.surfaces;")
    rows = cur.fetchall()
    
    if not rows:
        print("⚠️  Result: TABLE IS EMPTY")
    else:
        print(f"✅ Result: Found {len(rows)} Surfaces")
        print(tabulate(rows, headers=["Key", "Name"], tablefmt="grid"))
        
    cur.close()
    conn.close()

except Exception as e:
    print(f"❌ Error: {e}")
