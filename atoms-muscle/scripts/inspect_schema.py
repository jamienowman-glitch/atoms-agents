
import psycopg2
from urllib.parse import urlparse

VAULT_PATH = "/Users/jaynowman/northstar-keys/supabase-db-url.txt"

def main():
    try:
        with open(VAULT_PATH, "r") as f:
            db_url = f.read().strip()
        
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        tables = ['tenants', 'tenant_members', 'pricing']
        
        for t in tables:
            print(f"\n--- TABLE: {t} ---")
            try:
                cur.execute(f"select column_name, data_type, udt_name from information_schema.columns where table_schema='public' and table_name='{t}'")
                rows = cur.fetchall()
                if not rows:
                    print("  (Table does not exist)")
                else:
                    for r in rows:
                        print(f"  {r[0]}: {r[1]} ({r[2]})")
            except Exception as e:
                print(f"  Error: {e}")
                
        conn.close()
        
    except Exception as e:
        print(f"FATAL: {e}")

if __name__ == "__main__":
    main()
