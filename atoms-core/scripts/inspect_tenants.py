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
    
    print("\n🔍 Inspecting 'public.tenants' Schema...")
    cur.execute("""
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_schema = 'public' AND table_name = 'tenants';
    """)
    rows = cur.fetchall()
    
    if not rows:
        print("⚠️  Table 'public.tenants' NOT FOUND (despite being in list earlier?)")
    else:
        print(tabulate(rows, headers=["Column", "Type"], tablefmt="grid"))
        
        # Check content
        cur.execute("SELECT * FROM public.tenants LIMIT 5;")
        data = cur.fetchall()
        print("\n📊 Data Sample:")
        if data:
            print(data)
        else:
            print("   [Empty]")

    cur.close()
    conn.close()

except Exception as e:
    print(f"❌ Error: {e}")
