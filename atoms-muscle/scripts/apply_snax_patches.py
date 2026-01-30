
import os
import psycopg2
from urllib.parse import urlparse

# PORTS
VAULT_PATH = "/Users/jaynowman/northstar-keys/supabase-db-url.txt"
SQL_015 = "/Users/jaynowman/dev/atoms-core/sql/015_snax_auth_patch_uuid.sql"
SQL_016 = "/Users/jaynowman/dev/atoms-core/sql/016_discount_engine_uuid.sql"
SQL_099 = "/Users/jaynowman/.gemini/antigravity/brain/a202e341-c620-47fd-a36a-29bd73fe99f0/verification_and_seeding_uuid.sql"

def main():
    print("--- STARTING SNAX APPLICATION ---")
    
    # 1. READ VAULT
    try:
        with open(VAULT_PATH, "r") as f:
            db_url = f.read().strip()
    except FileNotFoundError:
        print(f"❌ Vault file not found: {VAULT_PATH}")
        return

    # 2. CONNECT
    try:
        conn = psycopg2.connect(db_url)
        conn.autocommit = True
        cur = conn.cursor()
        print("✅ Connected to Supabase via Postgres")
    except Exception as e:
        print(f"❌ Connection failed: {e}")
        return

    # 3. APPLY 015
    try:
        print("\n--- Applying 015_snax_auth_patch.sql ---")
        with open(SQL_015, "r") as f:
            sql = f.read()
            cur.execute(sql)
            print("✅ 015 Applied Successfully")
    except Exception as e:
        print(f"⚠️ 015 Failed (might be partial/duplicate): {e}")

    # 4. APPLY 016
    try:
        print("\n--- Applying 016_discount_engine.sql ---")
        with open(SQL_016, "r") as f:
            sql = f.read()
            cur.execute(sql)
            print("✅ 016 Applied Successfully")
    except Exception as e:
        print(f"⚠️ 016 Failed (might be partial/duplicate): {e}")

    # 5. APPLY 099 (Verification/Seeding)
    try:
        print("\n--- Applying 099 Seeding & Verification ---")
        with open(SQL_099, "r") as f:
            sql = f.read()
            # Split by statement if needed, but standard driver handles multiple statements usually
            cur.execute(sql)
            
            # Fetch last result if any (verification step 4)
            # The script has multiple queries at the end. psycopg2 executes all but only returns result of last one?
            # Actually, `execute` with multiple statements is tricky for returning results.
            # I will execute verification separately for clarity.
            print("✅ Seeding Applied")

    except Exception as e:
        print(f"⚠️ Seeding Failed: {e}")

    # 6. RUN EXPLICIT VERIFICATION
    print("\n--- VERIFICATION OUTPUT ---")
    try:
        cur.execute("select 'tenants' as table_name, count(*) as row_count from public.tenants union all select 'pricing', count(*) from public.pricing union all select 'discount_policy', count(*) from public.discount_policy")
        rows = cur.fetchall()
        print("Row Counts:")
        for r in rows:
            print(f"  {r[0]}: {r[1]}")
            
        cur.execute("select key, value from public.system_config")
        rows = cur.fetchall()
        print("\nSystem Config:")
        for r in rows:
            print(f"  {r[0]}: {r[1]}")

    except Exception as e:
        print(f"❌ Verification Query Failed: {e}")

    conn.close()
    print("\n--- DONE ---")

if __name__ == "__main__":
    main()
