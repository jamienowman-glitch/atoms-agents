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
    
    # Query all tables in 'public' schema
    cur.execute("""
        SELECT 
            table_name,
            (xpath('/row/c/text()', query_to_xml(format('select count(*) as c from %I.%I', table_schema, table_name), false, true, '')))[1]::text::int as rows
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name;
    """)
    
    rows = cur.fetchall()
    
    print("\n📊 SUPABASE REGISTRY INVENTORY")
    print("=============================")
    if not rows:
        print("⚠️  No tables found in public schema.")
    else:
        # Format as list: index, name, rows
        data = [[i+1, row[0], row[1]] for i, row in enumerate(rows)]
        print(tabulate(data, headers=["#", "Table Name", "Rows"], tablefmt="simple"))
        
    cur.close()
    conn.close()

except Exception as e:
    print(f"❌ Error: {e}")
