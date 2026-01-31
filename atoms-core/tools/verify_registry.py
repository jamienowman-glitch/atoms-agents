import sys
from pathlib import Path
try:
    import psycopg2
except ImportError:
    print("❌ Error: psycopg2 module not found.")
    sys.exit(1)

# Config
VAULT_DIR = Path("/Users/jaynowman/northstar-keys")

def read_vault(filename):
    path = VAULT_DIR / filename
    if not path.exists():
        return None
    with open(path, "r") as f:
        return f.read().strip()

def verify_registry():
    print("🕵️  Verifying Registry Integrity...")
    
    # 1. Connect
    db_url = read_vault("postgres-connection-string.txt") or read_vault("supabase-db-url.txt")
    if not db_url:
        print("❌ Connect failed: No DB URL in Vault.")
        sys.exit(1)
        
    try:
        conn = psycopg2.connect(db_url)
        cur = conn.cursor()
        
        # 2. Count by Type
        cur.execute("SELECT type, count(*) FROM registry_components GROUP BY type ORDER BY count DESC;")
        counts = cur.fetchall()
        
        print("\n📊 Registry Composition:")
        print("-" * 30)
        print(f"{'Type':<20} | {'Count':<5}")
        print("-" * 30)
        total = 0
        for type_, count in counts:
            print(f"{type_:<20} | {count:<5}")
            total += count
        print("-" * 30)
        print(f"{'TOTAL':<20} | {total:<5}\n")
        
        # 3. List Products (Muscle & Connector & Vertical Slice)
        cur.execute("SELECT alias, product_name, type FROM registry_components WHERE type IN ('vertical_slice', 'muscle', 'connector');")
        slices = cur.fetchall()
        
        print(f"📦 Products (Count: {len(slices)}):")
        for alias, name, type_ in slices:
            print(f"  • [{type_}] {name} ({alias})")
            
        print("\n✅ Verification Complete.")
        cur.close()
        conn.close()

    except Exception as e:
        print(f"❌ Verification Failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    verify_registry()
